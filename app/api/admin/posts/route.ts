import { NextRequest, NextResponse } from "next/server";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
const OWNER = process.env.GITHUB_OWNER ?? "yongsugim183-stack";
const REPO = process.env.GITHUB_REPO ?? "personal-blog";

async function githubRequest(path: string, options: RequestInit = {}) {
  return fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) ?? {}),
    },
  });
}

// POST: 새 글 저장 / 기존 글 수정
export async function POST(req: NextRequest) {
  const { slug, title, date, excerpt, tags, content, sha } = await req.json();
  const frontmatter = `---\ntitle: "${title}"\ndate: "${date}"\nexcerpt: "${excerpt}"\ntags: [${tags.map((t: string) => `"${t}"`).join(", ")}]\n---\n\n`;
  const fileContent = Buffer.from(frontmatter + content).toString("base64");

  const body: Record<string, unknown> = {
    message: sha ? `글 수정: ${title}` : `새 글: ${title}`,
    content: fileContent,
  };
  if (sha) body.sha = sha;

  const res = await githubRequest(`content/posts/${slug}.mdx`, {
    method: "PUT",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json();
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

// DELETE: 글 삭제
export async function DELETE(req: NextRequest) {
  const { slug, sha } = await req.json();
  const res = await githubRequest(`content/posts/${slug}.mdx`, {
    method: "DELETE",
    body: JSON.stringify({ message: `글 삭제: ${slug}`, sha }),
  });
  if (!res.ok) return NextResponse.json({ error: "삭제 실패" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
