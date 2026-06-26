import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import Link from "next/link";
import Comments from "@/components/Comments";

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article>
      <header className="mb-8">
        <Link href="/blog" className="text-sm text-gray-500 dark:text-gray-400 hover:underline mb-4 inline-block">
          ← 글 목록
        </Link>
        <h1 className="text-3xl font-bold mt-2 mb-3">{post.title}</h1>
        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <time>{post.date}</time>
          <span>·</span>
          <span>{post.readingTime}</span>
        </div>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${tag}`}
                className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <MDXRemote source={post.content} />
      </div>

      <Comments />
    </article>
  );
}
