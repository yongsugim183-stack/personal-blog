import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";

export default function HomePage() {
  const posts = getAllPosts().slice(0, 5);

  return (
    <div>
      <section className="mb-12">
        <h1 className="text-3xl font-bold mb-3">안녕하세요 👋</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
          개발과 일상의 생각을 기록하는 공간입니다.
        </p>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">최근 글</h2>
          <Link href="/blog" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            전체 보기 →
          </Link>
        </div>
        {posts.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 py-8 text-center">
            아직 작성된 글이 없습니다.
          </p>
        ) : (
          posts.map((post) => <PostCard key={post.slug} post={post} />)
        )}
      </section>
    </div>
  );
}
