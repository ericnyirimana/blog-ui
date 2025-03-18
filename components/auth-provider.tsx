"use client";

import { GoogleOAuthProvider } from '@react-oauth/google';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // For static builds, use a mock client ID if not provided
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'mock_client_id';

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}