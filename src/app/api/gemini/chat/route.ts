import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Initialize Gemini SDK with telemetry header
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("WARNING: GEMINI_API_KEY environment variable is not set. Chatbot queries will fail.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request payload. 'messages' array is required." }, { status: 400 });
    }

    const ai = getGeminiClient();
    
    // Format memory context for the generateContent payload
    const formattedContents = messages.map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    }));

    // Generate content using gemini-3.5-flash as mandated for generic text/Q&A
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: "You are EduPulse Copilot, an AI classroom assistant designed to support K-12 teachers. Your goal is to provide supportive, actionable, and concrete advice on differentiated learning, lesson modification, remedial scaffolding, advanced student enrichment, standardized test alignments (such as Common Core CCSS), parent-teacher messaging tone adjustments, and classroom grouping strategies. Use formatting like bullet points and bold text where appropriate to make your advice easy to parse quickly by a busy teacher."
      }
    });

    const reply = response.text || "I was unable to formulate a response. Please check your instructions or try again.";
    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error("Gemini API error:", err);
    return NextResponse.json({ 
      error: "The AI Copilot was unable to complete the request at the moment.", 
      details: err.message 
    }, { status: 500 });
  }
}
