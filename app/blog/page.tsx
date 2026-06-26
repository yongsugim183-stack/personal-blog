import { getAllPosts, getAllTags } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import Link from "next/link";

export default function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  return <BlogList searchParams={searchParams} />;
}

async function BlogList({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
  const { tag } = await searchParams;
  const allPosts = getAllPosts();
  const tags = getAllTags();
  const posts = tag ? allPosts.filter((p) => p.tags.includes(tag)) : allPosts;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">글 목록</h1>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href="/blog"
            className={`text-sm px-3 py-1 rounded-full transition-colors ${
              !tag
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            전체
          </Link>
          {tags.map((t) => (
            <Link
              key={t}
              href={`/blog?tag=${t}`}
              className={`text-sm px-3 py-1 rounded-full transition-colors ${
                tag === t
                  ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              #{t}
            </Link>
          ))}
        </div>
      )}

      {posts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 py-12 text-center">
          {tag ? `'${tag}' 태그의 글이 없습니다.` : "아직 작성된 글이 없습니다."}
        </p>
      ) : (
        posts.map((post) => <PostCard key={post.slug} post={post} />)
      )}
    </div>
  );
}
