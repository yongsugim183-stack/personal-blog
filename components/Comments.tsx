"use client";

import { useEffect, useRef } from "react";

export default function Comments() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return;
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", "YOUR_GITHUB_USERNAME/YOUR_REPO");
    script.setAttribute("data-repo-id", "YOUR_REPO_ID");
    script.setAttribute("data-category", "General");
    script.setAttribute("data-category-id", "YOUR_CATEGORY_ID");
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", document.documentElement.classList.contains("dark") ? "dark" : "light");
    script.setAttribute("data-lang", "ko");
    script.crossOrigin = "anonymous";
    script.async = true;
    ref.current.appendChild(script);
  }, []);

  return (
    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
      <h2 className="text-lg font-semibold mb-4">댓글</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        댓글을 사용하려면{" "}
        <a href="https://giscus.app" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">
          giscus.app
        </a>
        에서 설정을 완료하고 위 스크립트 속성을 업데이트하세요.
      </p>
      <div ref={ref} />
    </div>
  );
}
