export default function AboutPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">소개</h1>
      <div className="prose prose-gray dark:prose-invert">
        <p>안녕하세요, 김용수입니다.</p>
        <p>
          이 블로그는 개발과 일상의 생각을 기록하는 공간입니다.
          궁금한 점이 있으시면 아래 연락처로 연락해 주세요.
        </p>
        <h2>연락처</h2>
        <ul>
          <li>
            이메일:{" "}
            <a href="mailto:ysukim@kpc.or.kr">ysukim@kpc.or.kr</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
