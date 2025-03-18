"use client";

import { GoogleOAuthProvider } from '@react-oauth/google';
import { useEffect, useState } from 'react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [clientId, setClientId] = useState<string>('');

  useEffect(() => {
    setMounted(true);
    // Load client ID at runtime to prevent it from being included in the build
    setClientId(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '');
  }, []);

  // Don't render the provider during SSR
  if (!mounted) {
    return <>{children}</>;
  }

  if (!clientId) {
    console.warn('Google OAuth client ID not configured');
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}