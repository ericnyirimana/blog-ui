"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";

export function AuthButton() {
  const router = useRouter();

  const handleLogin = async () => {
    // Redirect to your backend's Google OAuth endpoint
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <Button
      variant="outline"
      onClick={handleLogin}
      className="flex items-center gap-2 text-base py-6"
    >
      <LogIn className="h-5 w-5" />
      Sign in with Google
    </Button>
  );
}