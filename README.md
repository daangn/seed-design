![SEED Design System](./cover.webp)

# SEED Design System

SEED는 당근 제품을 위한 통합된 디자인 언어입니다. 하나의 토큰 소스에서 React, iOS, Android, Lynx까지 여러 플랫폼에 일관된 디자인을 전달하고, Figma와 연동됩니다.

[문서 사이트](https://seed-design.io)

## 패키지

**Definitions** — 토큰·레시피 소스

- [@seed-design/rootage-artifacts](./packages/rootage) — 디자인 토큰·컴포넌트 스키마 정의
- [@seed-design/qvism-preset](./packages/qvism-preset) — 스타일 레시피 정의

**Base Libraries** — 스타일 생성물

- [@seed-design/css](./packages/css) — 디자인 토큰·컴포넌트 스타일·테마 CSS

**React**

- [@seed-design/react](./packages/react) — 스타일드 React 컴포넌트
- [@seed-design/react-headless](./packages/react-headless) — Headless UI 로직
- [@seed-design/stackflow](./packages/stackflow) — Stackflow 통합

**Lynx**

- [@seed-design/lynx-react](./packages/lynx-react) — Lynx 컴포넌트
- [@seed-design/lynx-css](./packages/lynx-css) — Lynx용 CSS
- [@seed-design/lynx-qvism-preset](./packages/lynx-qvism-preset) — Lynx용 스타일 레시피

**Framework Plugins** — 번들러·Tailwind 연동

- [@seed-design/vite-plugin](./packages/vite-plugin) — Vite에 SEED 테마 적용
- [@seed-design/webpack-plugin](./packages/webpack-plugin) — Webpack·Rspack에 SEED 테마 적용
- [@seed-design/rsbuild-plugin](./packages/rsbuild-plugin) — Rsbuild에 SEED 테마 적용
- [@seed-design/tailwind3-plugin](./packages/tailwind3-plugin) — Tailwind 3에서 SEED 토큰 사용
- [@seed-design/tailwind4-theme](./packages/tailwind4-theme) — Tailwind 4에서 SEED 토큰 사용

**CLI & Migration**

- [@seed-design/cli](./packages/cli) — 컴포넌트를 프로젝트에 추가하는 CLI
- [@seed-design/codemod](./packages/codemod) — 코드 마이그레이션 도구

**Integrations**

- [@seed-design/figma](./packages/figma) — Figma 연동
- [@seed-design/mcp](./packages/mcp) — MCP 서버
- [@seed-design/docs-mcp](./packages/docs-mcp) — 문서 MCP 서버

**Ecosystem** — 파이프라인 엔진

- [rootage](./ecosystem/rootage) — 토큰 빌드 엔진 (core·cli)
- [qvism](./ecosystem/qvism) — 스타일 레시피 엔진 (core·cli)
- [figma-extractor](./ecosystem/figma-extractor) — Figma 변수 추출
- [postcss-engaged](./ecosystem/postcss-engaged) · [postcss-responsive](./ecosystem/postcss-responsive) — PostCSS 플러그인

**Documentation**

- [@seed-design/docs](./docs)

## License

[Apache-2.0](./LICENSE)
