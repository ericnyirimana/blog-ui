"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { login } from "@/lib/auth";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      login(token).then(() => {
        router.push('/posts');
        window.location.reload();
      });
    } else {
      router.push('/login');
    }
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Processing authentication...</h1>
        <p className="text-muted-foreground">Please wait while we sign you in.</p>
      </div>
    </div>
  );
}