"use client";

import { GoogleOAuthProvider } from '@react-oauth/google';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Use runtime environment variable
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    console.warn('Google Client ID not configured');
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}