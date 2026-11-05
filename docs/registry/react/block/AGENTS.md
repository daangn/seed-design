# docs/registry/react/block

CLI로 설치하는 block snippet이다. 파일 하나가 독립 UI 블록 템플릿이고, MDX의 `BlockPreview`가 `/blocks/<id>` 페이지를 iframe으로 띄우면 `docs/app/blocks/[name]/block-renderer.tsx`가 id와 같은 이름의 파일을 lazy import해 렌더링한다.

## 작업 절차

### block을 추가할 때

1. `{component}-{두 자리 번호}.tsx`로 만든다(예: `footer-01.tsx`). 번호는 `01`부터 시작하고 의미를 담지 않는다.
2. `docs/registry/react/registry-block.ts`에 파일명과 같은 id로 item을 등록한다. snippet `dependencies`에는 기존 item처럼 `@seed-design/react`·`@seed-design/css` 버전 범위를 적는다.
3. `docs/content/react/blocks/<component>.mdx`에 같은 id로 `<BlockPreview name>`, `<BlockCodeTabs name>`, `npx @seed-design/cli@latest add block:<id>`를 넣는다.
4. 루트 `AGENTS.md`「생성」대로 `bun docs:generate`를 실행한다.

## 규칙

- 첫 줄에 `"use client"`를 둔다. block은 iframe 안에서 client lazy 렌더링된다.
- `export default function`으로 export한다. renderer가 default export를 불러온다.
- 레이아웃은 `@seed-design/react`의 `Box`, `HStack`, `VStack` 등으로 구성한다.
- 다른 registry 파일은 `seed-design/...` alias 대신 상대 경로로 import한다: `../ui/action-button`, `../icon/icon-facebook`. alias import는 registry 생성이 실패하고, 상대 import는 `innerDependencies`로 기록돼 CLI가 함께 설치한다.
- SNS 아이콘 `ActionButton`에는 `bleedX="asPadding"`을 준다.
