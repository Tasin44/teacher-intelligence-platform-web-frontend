import React from 'react'
import authBg from '@/assets/bg/auth.png'
import { EduPulseProvider } from '@/lib/context/EduPulseContext'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <EduPulseProvider>
      <div 
        className="min-h-screen w-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA]"
        style={{
          backgroundImage: `url(${authBg.src})`,
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center',
        }}
      >
        <div className="w-full max-w-[480px] sm:max-w-[540px] flex flex-col items-center gap-8 animate-fadeIn">
          {/* Header Logo */}
          <div className="flex items-center gap-3">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 shadow-md shadow-orange-500/10 rounded-xl">
              <rect width="48" height="48" rx="12" fill="#F97316" />
              <path d="M24 14L32.66 19V29L24 34L15.34 29V19L24 14Z" fill="white" />
              <circle cx="24" cy="24" r="5" fill="#F97316" />
            </svg>
            <span className="font-sans font-black text-3xl tracking-tight text-[#1E293B]">
              EduPulse <span className="text-accent-orange">AI</span>
            </span>
          </div>

          {/* Auth Page Content Card */}
          <div className="w-full bg-[#F5F5F5] border border-accent-border shadow-xl shadow-slate-100/50 rounded-2xl p-6 sm:p-10 flex flex-col">
            {children}
          </div>
        </div>
      </div>
    </EduPulseProvider>
  )
}

export default Layout