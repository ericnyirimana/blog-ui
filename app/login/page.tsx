"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthButton } from "@/components/auth-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getUser } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  
  useEffect(() => {
    const user = getUser();
    if (user) {
      router.push('/posts');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
      <div className="container max-w-[400px] px-4 py-8">
        <Card className="w-full">
          <CardHeader className="space-y-2 text-center pb-8">
            <CardTitle className="text-3xl font-bold">Welcome back</CardTitle>
            <CardDescription className="text-lg">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <AuthButton />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}