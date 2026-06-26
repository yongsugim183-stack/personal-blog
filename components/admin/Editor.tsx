"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageIcon, Save, Trash2, ArrowLeft } from "lucide-react";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface EditorProps {
  initialSlug?: string;
  initialTitle?: string;
  initialDate?: string;
  initialExcerpt?: string;
  initialTags?: string;
  initialContent?: string;
  sha?: string;
}

export default function Editor({
  initialSlug = "",
  initialTitle = "",
  initialDate = new Date().toISOString().slice(0, 10),
  initialExcerpt = "",
  initialTags = "",
  initialContent = "",
  sha,
}: EditorProps) {
  const router = useRouter();
  const [slug, setSlug] = useState(initialSlug);
  const [title, setTitle] = useState(initialTitle);
  const [date, setDate] = useState(initialDate);
  const [excerpt, setExcerpt] = useState(initialExcerpt);
  const [tags, setTags] = useState(initialTags);
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleSave() {
    if (!slug || !title) {
      setMessage("슬러그와 제목은 필수입니다.");
      return;
    }
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug,
        title,
        date,
        excerpt,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        content,
        sha,
      }),
    });
    setSaving(false);
    if (res.ok) {
      setMessage("저장되었습니다. (배포까지 약 1~2분 소요)");
      if (!sha) router.push("/admin");
    } else {
      setMessage("저장 실패. GitHub 토큰을 확인하세요.");
    }
  }

  async function handleDelete() {
    if (!sha || !confirm(`'${title}' 글을 삭제할까요?`)) return;
    const res = await fetch("/api/admin/posts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, sha }),
    });
    if (res.ok) router.push("/admin");
    else setMessage("삭제 실패");
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    setUploading(false);
    if (res.ok) {
      const { url } = await res.json();
      setContent((prev) => prev + `\n\n![이미지](${url})\n`);
      setMessage("이미지가 추가되었습니다.");
    } else {
      setMessage("이미지 업로드 실패");
    }
    e.target.value = "";
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 상단 툴바 */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/admin")}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft size={16} /> 목록으로
        </button>
        <div className="flex gap-2">
          {sha && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
            >
              <Trash2 size={14} /> 삭제
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1 px-4 py-1.5 text-sm rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-80 disabled:opacity-50"
          >
            <Save size={14} /> {saving ? "저장 중..." : "저장 & 배포"}
          </button>
        </div>
      </div>

      {message && (
        <p className={`text-sm px-3 py-2 rounded-lg ${message.includes("실패") || message.includes("필수") ? "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400" : "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"}`}>
          {message}
        </p>
      )}

      {/* 메타 정보 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">슬러그 (URL)</label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value.replace(/\s/g, "-"))}
            placeholder="my-first-post"
            disabled={!!sha}
            className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">날짜</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="col-span-2 flex flex-col gap-1">
          <label className="text-xs text-gray-500">제목</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="글 제목"
            className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">요약</label>
          <input
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="한 줄 요약"
            className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">태그 (쉼표로 구분)</label>
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="개발, 일상, 여행"
            className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 이미지 업로드 버튼 */}
      <div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
        >
          <ImageIcon size={14} />
          {uploading ? "업로드 중..." : "사진 추가"}
        </button>
      </div>

      {/* 마크다운 에디터 */}
      <div data-color-mode="light" className="dark:[&>div]:!bg-gray-900">
        <MDEditor
          value={content}
          onChange={(v) => setContent(v ?? "")}
          height={500}
          preview="live"
        />
      </div>
    </div>
  );
}
