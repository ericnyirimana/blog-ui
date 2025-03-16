import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
      <div className="container max-w-[800px] px-4 py-8">
        <div className="flex flex-col items-center gap-8 text-center">
          <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:text-7xl lg:leading-[1.1]">
            Welcome to the Modern Blog Platform
          </h1>
          <p className="max-w-[600px] text-lg text-muted-foreground sm:text-xl md:text-2xl">
            Share your thoughts, engage with others, and discover amazing content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/posts">Browse Posts</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
              <Link href="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}