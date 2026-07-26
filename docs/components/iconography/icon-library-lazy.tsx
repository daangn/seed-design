"use client";

import dynamic from "next/dynamic";

/**
 * `IconLibrary`를 온디맨드 청크로 분리한다.
 *
 * `./icons`는 아이콘 세트 전체를 정적 import한다 — 컴포넌트
 * (`@karrotmarket/react-{monochrome,multicolor}-icon`)와 raw SVG 소스 JSON
 * (`@karrotmarket/icon-data`) 양쪽 다, 이름으로 조회해야 해서 네임스페이스로 가져오므로
 * tree shaking도 안 된다. 아이콘이 추가될수록 커지는 쪽이다.
 *
 * 이걸 `components/mdx-components.tsx`에서 직접 import하면 그 맵을 공유하는 모든
 * `[[...slug]]` 라우트의 번들에 들어가서, `<IconLibrary>`를 쓰는 문서가
 * `content/foundations/iconography/library.mdx` 하나뿐인데도 전체 문서 페이지가
 * 내려받게 된다.
 *
 * `ssr: false`인 이유: nuqs URL 상태를 쓰는 브라우저 전용 아이콘 브라우저라 서버 HTML의
 * 가치가 없다. 에이전트용 마크다운은 `app/_llms/rules/icon-library.ts`가 빌드타임에 따로
 * 만들므로 영향받지 않는다.
 *
 * `mdx-components.tsx`는 서버 모듈이라 `ssr: false`를 직접 못 쓴다(Next 15+ 제약).
 * 이 파일이 클라이언트 경계 역할을 한다.
 */
const LazyIconLibrary = dynamic(() => import("./icons").then((mod) => mod.IconLibrary), {
  ssr: false,
});

// dynamic()의 반환 타입은 ComponentClass를 포함하는 유니온이라 MDXComponents 맵에 그대로 못 넣는다
// (문자열 인덱스 시그니처 요구). props 없는 함수 컴포넌트로 감싸서 캐스팅 없이 해결한다.
export function IconLibrary() {
  return <LazyIconLibrary />;
}
