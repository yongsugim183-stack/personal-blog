import Editor from "@/components/admin/Editor";

async function getPost(slug: string) {
  const res = await fetch(
    `https://api.github.com/repos/yongsugim183-stack/personal-blog/contents/content/posts/${slug}.mdx`,
    { headers: { Accept: "application/vnd.github+json" }, cache: "no-store" }
  );
  if (!res.ok) return null;
  const data = await res.json();
  const raw = Buffer.from(data.content, "base64").toString("utf-8");

  const titleMatch = raw.match(/^title:\s*"(.+)"/m);
  const dateMatch = raw.match(/^date:\s*"(.+)"/m);
  const excerptMatch = raw.match(/^excerpt:\s*"(.+)"/m);
  const tagsMatch = raw.match(/^tags:\s*\[(.+)\]/m);
  const contentMatch = raw.match(/^---[\s\S]+?---\n\n([\s\S]*)/m);

  return {
    title: titleMatch?.[1] ?? "",
    date: dateMatch?.[1] ?? "",
    excerpt: excerptMatch?.[1] ?? "",
    tags: tagsMatch?.[1]?.replace(/"/g, "").replace(/,\s*/g, ", ") ?? "",
    content: contentMatch?.[1] ?? "",
    sha: data.sha,
  };
}

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) return <p className="text-red-500">글을 찾을 수 없습니다.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">글 편집</h1>
      <Editor
        initialSlug={slug}
        initialTitle={post.title}
        initialDate={post.date}
        initialExcerpt={post.excerpt}
        initialTags={post.tags}
        initialContent={post.content}
        sha={post.sha}
      />
    </div>
  );
}
