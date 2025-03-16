"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { api } from "@/lib/api";
import { getUser } from "@/lib/auth";

interface FormData {
  title: string;
  body: string;
}

export default function NewPostPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [submitting, setSubmitting] = useState(false);
  const user = getUser();

  if (!user) {
    router.push("/login");
    return null;
  }

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const post = await api.posts.create({
        title: data.title,
        body: data.body,
        // userId: parseInt(user.id)
      });
      router.push(`/posts/${post.id}`);
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Post</CardTitle>
          <CardDescription>Share your thoughts with the community</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Input
                placeholder="Post title"
                {...register("title", { required: "Title is required" })}
                className="text-lg"
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder="Write your post content here..."
                {...register("body", { required: "Content is required" })}
                className="min-h-[300px]"
              />
              {errors.body && (
                <p className="text-sm text-destructive">{errors.body.message}</p>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Publishing..." : "Publish Post"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}