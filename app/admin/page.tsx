"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PenLine, LogOut, Plus } from "lucide-react";

interface PostItem {
  slug: string;
  title: string;
  date: string;
  sha: string;
}

export default function AdminPage() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("https://api.github.com/repos/yongsugim183-stack/personal-blog/contents/content/posts", {
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((r) => r.json())
      .then((files: { name: string; sha: string }[]) => {
        return Promise.all(
          files
            .filter((f) => f.name.endsWith(".mdx"))
            .map(async (f) => {
              const slug = f.name.replace(/\.mdx$/, "");
              const res = await fetch(
                `https://api.github.com/repos/yongsugim183-stack/personal-blog/contents/content/posts/${f.name}`,
                { headers: { Accept: "application/vnd.github+json" } }
              );
              const data = await res.json();
              const raw = atob(data.content.replace(/\n/g, ""));
              const titleMatch = raw.match(/^title:\s*"(.+)"/m);
              const dateMatch = raw.match(/^date:\s*"(.+)"/m);
              return {
                slug,
                title: titleMatch?.[1] ?? slug,
                date: dateMatch?.[1] ?? "",
                sha: data.sha,
              };
            })
        );
      })
      .then((list) => {
        setPosts(list.sort((a, b) => (a.date < b.date ? 1 : -1)));
        setLoading(false);
      });
  }, []);

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">글 관리</h1>
        <div className="flex gap-2">
          <Link
            href="/admin/new"
            className="flex items-center gap-1 px-4 py-2 text-sm rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-80"
          >
            <Plus size={14} /> 새 글 쓰기
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <LogOut size={14} /> 로그아웃
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400 py-8 text-center">불러오는 중...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-400 py-8 text-center">글이 없습니다.</p>
      ) : (
        <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
          {posts.map((post) => (
            <div key={post.slug} className="flex items-center justify-between py-4">
              <div>
                <p className="font-medium">{post.title}</p>
                <p className="text-sm text-gray-400">{post.date}</p>
              </div>
              <Link
                href={`/admin/edit/${post.slug}?sha=${post.sha}`}
                className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <PenLine size={14} /> 편집
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
