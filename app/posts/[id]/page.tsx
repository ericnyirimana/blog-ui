import { api } from "@/lib/api";
import { PostContent } from "./post-content";

export async function generateStaticParams() {
  // Generate paths for posts 1-100 since that's the range of posts in JSONPlaceholder
  return Array.from({ length: 100 }, (_, i) => ({
    id: (i + 1).toString(),
  }));
}

export default async function PostPage({ params }: { params: { id: string } }) {
  return <PostContent id={params.id} />;
}