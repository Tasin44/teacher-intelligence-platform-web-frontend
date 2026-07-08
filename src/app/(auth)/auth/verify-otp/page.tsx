import VerifyOtpPage from '@/components/auth/VerifyOtpPage'
import React, { Suspense } from 'react'

// useSearchParams() inside VerifyOtpPage requires a Suspense boundary
const page = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-40 text-slate-400 text-sm">Loading…</div>}>
      <VerifyOtpPage />
    </Suspense>
  )
}

export default page