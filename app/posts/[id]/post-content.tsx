"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api, Post, User, Comment } from "@/lib/api";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getUser } from "@/lib/auth";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, MessageSquare } from "lucide-react";
import Link from "next/link";

interface PostWithAuthor extends Post {
  author: User;
}

export function PostContent({ id }: { id: string }) {
  const router = useRouter();
  const [post, setPost] = useState<PostWithAuthor | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const currentUser = getUser();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<{ body: string }>();

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const [postData, commentsData] = await Promise.all([
        api.posts.getById(id),
        api.comments.getByPost(id)
      ]);
      
      const author = await api.users.getById(postData.userId.toString());
      setPost({ ...postData, author });
      setComments(commentsData);
    } catch (error) {
      console.error("Failed to fetch post:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitComment = async (data: { body: string }) => {
    if (!currentUser) return;

    setSubmitting(true);
    try {
      const newComment = await api.comments.create({
        postId: parseInt(id),
        name: currentUser.name,
        email: currentUser.email,
        body: data.body
      });
      setComments(prev => [newComment, ...prev]);
      reset();
    } catch (error) {
      console.error("Failed to create comment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-8"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-4" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <Card className="py-8">
          <CardContent className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-destructive">Post not found</h1>
            <p className="text-muted-foreground">The post you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link href="/posts">Back to Posts</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-8"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <Card className="mb-8">
        <CardHeader className="space-y-4">
          <CardTitle className="text-3xl font-bold leading-tight">
            {post.title}
          </CardTitle>
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">{post.author.name}</CardTitle>
              <CardDescription>{post.author.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed whitespace-pre-wrap">{post.body}</p>
        </CardContent>
      </Card>

      <div className="space-y-8">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>
        </div>

        {currentUser ? (
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit(onSubmitComment)} className="space-y-4">
                <div>
                  <Textarea
                    placeholder="Share your thoughts..."
                    {...register("body", { 
                      required: "Comment cannot be empty",
                      minLength: {
                        value: 3,
                        message: "Comment must be at least 3 characters long"
                      }
                    })}
                    className="resize-none"
                  />
                  {errors.body && (
                    <p className="mt-2 text-sm text-destructive">{errors.body.message}</p>
                  )}
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Posting..." : "Post Comment"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-6 text-center">
              <p className="text-muted-foreground mb-4">
                Please sign in to join the discussion
              </p>
              <Button asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>{comment.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{comment.name}</CardTitle>
                    <CardDescription>{comment.email}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground">{comment.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}