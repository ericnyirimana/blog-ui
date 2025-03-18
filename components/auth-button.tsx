"use client";

import { Button } from "@/components/ui/button";
import { useGoogleLogin } from '@react-oauth/google';
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { login } from "@/lib/auth";

export function AuthButton() {
  const router = useRouter();

  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      // Get user info from Google
      const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${response.access_token}` },
      }).then(res => res.json());

      // Create a custom token with user info
      const token = btoa(JSON.stringify({
        id: userInfo.sub,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture
      }));

      // Store the token
      await login(token);
      
      // Redirect to posts page and reload
      router.push('/posts');
      window.location.reload();
    },
    onError: () => {
      console.error('Login Failed');
    }
  });

  return (
    <Button
      variant="outline"
      onClick={() => googleLogin()}
      className="flex items-center gap-2 text-base py-6"
    >
      <LogIn className="h-5 w-5" />
      Sign in with Google
    </Button>
  );
}