import { api } from "@/lib/api";
import { PostContent } from "./post-content";

// Reduce the number of static pages generated
export async function generateStaticParams() {
  // Generate only 20 pages instead of 100 to reduce memory usage
  return Array.from({ length: 20 }, (_, i) => ({
    id: (i + 1).toString(),
  }));
}

export default async function PostPage({ params }: { params: { id: string } }) {
  return <PostContent id={params.id} />;
}