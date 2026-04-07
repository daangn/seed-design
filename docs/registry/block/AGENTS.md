# docs/registry/block/

## 디렉토리 개요

CLI로 설치 가능한 block 스니펫 파일. 각 파일은 독립적인 UI 블록 템플릿이다.

## 파일 작성 컨벤션

- **네이밍**: `{component}-{zero-padded 번호}.tsx` (예: `footer-01.tsx`, `header-01.tsx`)
- 번호는 `01`부터 시작하며 의미를 담지 않는다
- `registry-block.ts`의 id, 파일명, MDX 참조, CLI 명령어 모두 동일한 넘버링을 따른다

## 코드 작성 컨벤션

- `"use client"` 필수 (iframe 내에서 렌더링되므로)
- `export default function` 으로 export
- `@seed-design/react` 패키지의 레이아웃 컴포넌트(Box, HStack, VStack 등) 사용
- innerDeps 파일(ui/action-button, lib/block-icons 등)은 상대 경로로 import: `../ui/action-button`, `../lib/block-icons`
- SNS 아이콘 ActionButton에는 `bleedX="asPadding"` 적용
