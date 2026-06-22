"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthScreen from '@/components/AuthScreen';

export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('edupulse_logged_teacher');
    if (saved) {
      router.push('/');
    }
  }, [router]);

  if (!mounted) {
    return <div className="min-h-screen bg-brand-bg" />;
  }

  const handleLoginSuccess = () => {
    // Relies on reload to refresh the main layout state
    window.location.href = '/';
  };

  return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
}
