"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { getAuthHeader } from "@/lib/auth";
import { formatDistanceToNow } from "date-fns";

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    picture?: string;
  };
  createdAt: string;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/posts?page=${page}&limit=10`,
        {
          headers: {
            ...getAuthHeader(),
          },
        }
      );
      const data = await response.json();
      setPosts(prev => page === 1 ? data.posts : [...prev, ...data.posts]);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Latest Posts</h1>
          <p className="text-lg text-muted-foreground">Discover stories, thinking, and expertise.</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader>
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Latest Posts</h1>
        <p className="text-lg text-muted-foreground">Discover stories, thinking, and expertise.</p>
        <div className="mt-6">
          <Button size="lg" className="px-8" asChild>
            <Link href="/posts/new">Create Post</Link>
          </Button>
        </div>
      </div>
      
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="line-clamp-2">
                <Link href={`/posts/${post.id}`} className="hover:underline">
                  {post.title}
                </Link>
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <span>By {post.author.name}</span>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground line-clamp-3">{post.content}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link href={`/posts/${post.id}`}>Read More</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-12">
          <Button
            size="lg"
            variant="outline"
            className="px-8"
            onClick={() => setPage(prev => prev + 1)}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}