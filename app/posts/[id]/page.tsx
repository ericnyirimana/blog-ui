import { api } from "@/lib/api";
import { PostContent } from "./post-content";

export async function generateStaticParams() {
  // Get all posts for static generation
  const posts = await api.posts.getAll(1, 100);
  return posts.map((post) => ({
    id: post.id.toString(),
  }));
}

export default async function PostPage({ params }: { params: { id: string } }) {
  return <PostContent id={params.id} />;
}