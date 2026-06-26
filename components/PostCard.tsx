import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="py-6 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <Link href={`/blog/${post.slug}`} className="group">
        <h2 className="text-xl font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {post.title}
        </h2>
      </Link>
      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
        <time>{post.date}</time>
        <span>·</span>
        <span>{post.readingTime}</span>
      </div>
      {post.excerpt && (
        <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2">
          {post.excerpt}
        </p>
      )}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog?tag=${tag}`}
              className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}
