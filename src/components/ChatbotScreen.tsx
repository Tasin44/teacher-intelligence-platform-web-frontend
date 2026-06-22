import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  Send, 
  Sparkles, 
  Trash2, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "copilot";
  content: string;
}

interface ChatbotScreenProps {
  teacherName: string;
  teacherEmail: string;
  teacherAvatar: string;
}

export default function ChatbotScreen({
  teacherName,
  teacherEmail,
  teacherAvatar
}: ChatbotScreenProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history safely on mount
  useEffect(() => {
    const saved = localStorage.getItem("edupulse_chatbot_messages");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (err) {
        console.error("Error parsing chatbot history:", err);
      }
    } else {
      setMessages([
        {
          id: "welcome",
          role: "copilot",
          content: `Hello **${teacherName}**! I am your **EduPulse Copilot**. How can I help you support your students today?\n\nHere are some of the things you can ask me:\n- *Draft custom homework modifications for Grade 4 math.*\n- *Craft scaffolding strategies for remedial reading instruction.*\n- *Write an encouraging outreach template for parents.*\n- *Plan a peer-to-peer tutoring activity for students struggling with CCSS.Math.4.OA.B.4.*`
        }
      ]);
    }
    setIsHydrated(true);
  }, [teacherName]);

  // Auto scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // Persist messages index safely
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("edupulse_chatbot_messages", JSON.stringify(messages));
    }
  }, [messages, isHydrated]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    if (!textToSend) {
      setInput("");
    }
    setError(null);

    const userMessage: Message = {
      id: "msg_" + Date.now() + "_user",
      role: "user",
      content: text
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsThinking(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({
            role: m.role === "user" ? "user" : "model",
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error("Unable to obtain response from server endpoint.");
      }

      const data = await response.json();
      
      const copilotMessage: Message = {
        id: "msg_" + Date.now() + "_copilot",
        role: "copilot",
        content: data.reply
      };

      setMessages(prev => [...prev, copilotMessage]);
    } catch (err: any) {
      console.error("Copilot Error:", err);
      setError("AI response timed out or could not be generated. Please make sure your secrets configuration has a valid GEMINI_API_KEY.");
    } finally {
      setIsThinking(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear your current conversation history?")) {
      const defaultMsg: Message = {
        id: "welcome",
        role: "copilot",
        content: `Hello again, **${teacherName}**! I've cleared our chat history. Ask me anything to jumpstart your educational planning!`
      };
      setMessages([defaultMsg]);
      setError(null);
    }
  };

  const suggestedPrompts = [
    {
      label: "Math Challenge",
      prompt: "Can you design a 10-minute enrichment challenge on 'Advanced Factoring Techniques' for Grade 4 math (CCSS.Math.4.OA.B.4)?"
    },
    {
      label: "Scaffolding Tactics",
      prompt: "Provide 3 concrete scaffolding ideas for students struggling to read multisyllabic words."
    },
    {
      label: "Parent Outreach",
      prompt: "Write a short, friendly, behavior-focused parent email template for an on-track student who has shown exceptional focus during fractions."
    },
    {
      label: "Classroom Groups",
      prompt: "Suggest a 15-minute rotation schema for a 4-group classroom (Developing, Remedial, On Track, Advanced)."
    }
  ];

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-140px)] text-slate-400">
        Loading Copilot Workspace...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-fadeIn font-sans text-slate-100" id="chatbot-screen-container">
      {/* Upper banner info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-slate-100 flex items-center gap-2">
            AI Copilot Chat
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">Differentiate, scaffold, and construct standard lesson resources with smart context-aware suggestions</p>
        </div>
        <button
          onClick={handleClearChat}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-rose-500/30 hover:border-rose-500/60 bg-transparent text-rose-400 hover:text-rose-300 rounded-lg text-xs font-bold transition cursor-pointer"
        >
          <Trash2 size={13} />
          Clear Chat Logs
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5 flex-1 min-h-0 bg-transparent" id="chatbot-main-layout">
        
        {/* Left column - Helper Prompts sidebar (1/4 space) */}
        <div className="xl:col-span-1 bg-[#1E2130] p-5 rounded-xl border border-[#2A2D3A] flex flex-col justify-between" id="chatbot-prompts-card">
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold text-orange-500 uppercase tracking-widest flex items-center gap-1.5 mb-2">
              <Sparkles size={13} fill="currentColor" />
              Quick Suggestions
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans mb-3">
              Click a pre-configured prompt category below to instantly query the copilot with relevant curricular challenges:
            </p>
            
            <div className="space-y-2.5">
              {suggestedPrompts.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(item.prompt)}
                  disabled={isThinking}
                  className="w-full text-left bg-[#0F1117] hover:bg-slate-800/10 border border-[#2A2D3A]/60 hover:border-orange-500/50 p-3.5 rounded-lg text-xs tracking-normal text-slate-300 hover:text-white transition cursor-pointer flex justify-between items-center group disabled:opacity-55"
                >
                  <span className="font-semibold">{item.label}</span>
                  <ArrowRight size={12} className="text-slate-500 group-hover:text-orange-500 transition shrink-0 ml-1" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-lg mt-4" id="ai-disclaimer-panel">
            <h4 className="text-[10px] font-bold text-orange-500 uppercase mb-1 flex items-center gap-1">
              <CheckCircle2 size={11} fill="currentColor" className="text-orange-500/10" />
              Standards Oriented
            </h4>
            <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
              EduPulse Copilot automatically structures teaching materials around common-core standards and aligns them with remedial or enrichment guidelines.
            </p>
          </div>
        </div>

        {/* Right column - Main Chat Screen (3/4 space) */}
        <div className="xl:col-span-3 bg-[#1E2130] rounded-xl border border-[#2A2D3A] flex flex-col min-h-0 overflow-hidden" id="chatbot-conversation-card">
          
          {/* Messages scroll section */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-[#0F1117]/10" id="chat-messages-scroll">
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div 
                  key={msg.id} 
                  className={`flex items-start gap-3 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                >
                  {/* Sender profile image / icon */}
                  {isUser ? (
                    <img 
                      src={teacherAvatar} 
                      alt={teacherName} 
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full border border-slate-700 object-cover shrink-0 mt-0.5"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-orange-500 text-slate-900 flex items-center justify-center shrink-0 mt-0.5 font-bold shadow shadow-orange-500/20">
                      <Bot size={16} />
                    </div>
                  )}

                  {/* Message body text */}
                  <div className={`p-4 rounded-xl text-xs leading-relaxed font-sans border shadow-sm ${
                    isUser 
                      ? "bg-orange-500 text-slate-900 border-orange-400/20 rounded-tr-none" 
                      : "bg-[#0F1117]/50 text-slate-200 border-[#2A2D3A]/50 rounded-tl-none whitespace-pre-wrap font-mono"
                  }`}>
                    <div className="prose prose-invert prose-xs max-w-none">
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })}

            {isThinking && (
              <div className="flex items-start gap-3 max-w-[80%] mr-auto">
                <div className="w-8 h-8 rounded-lg bg-orange-500 text-slate-900 flex items-center justify-center shrink-0 mt-0.5 font-bold animate-pulse">
                  <Bot size={16} />
                </div>
                <div className="bg-[#0F1117]/50 text-slate-400 border border-[#2A2D3A]/50 p-4 rounded-xl rounded-tl-none text-xs flex items-center gap-2 font-medium font-sans">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                  <span>Educator Copilot is drafting suggestions...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-start gap-3 text-rose-400 text-xs font-sans max-w-[85%] mx-auto">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-rose-400 mb-0.5">Copilot Request Failed</h4>
                  <p>{error}</p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom input area */}
          <div className="p-4 bg-[#1E2130] border-t border-[#2A2D3A]" id="chat-composer-section">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-3 relative"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isThinking}
                placeholder="Ask your query (e.g. 'How should I explain equivalence of 1/2 and 2/4?')..."
                className="w-full bg-[#0F1117] border border-[#2A2D3A] rounded-xl pl-4 pr-14 py-3.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-orange-500 transition font-sans font-medium"
              />
              <button
                type="submit"
                disabled={isThinking || !input.trim()}
                className="absolute right-2 px-3.5 py-1.5 bg-orange-500 hover:bg-orange-450 text-slate-900 border-0 rounded-lg cursor-pointer flex items-center justify-center transition disabled:opacity-35 disabled:cursor-not-allowed"
                title="Send Message"
              >
                <Send size={14} className="stroke-[2.5]" />
              </button>
            </form>
            <div className="flex justify-between items-center mt-2.5 px-1 font-sans text-[10px] text-slate-500">
              <span>Powered by gemini-3.5-flash AI Model</span>
              <span>All responses align with standardized curriculum strategies</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
