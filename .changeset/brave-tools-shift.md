---
"@seed-design/cli": patch
"@seed-design/codemod": patch
"@seed-design/mcp": patch
"@seed-design/figma-extractor": patch
---

CLI 기반 도구의 `cac` 의존성을 v7로 업데이트합니다.

- `@seed-design/cli`와 `@seed-design/codemod`의 Node.js 요구사항을 `>=20.19.0`으로 맞춥니다.
- `@seed-design/mcp`와 `@seed-design/figma-extractor`에서도 최신 `cac` 런타임을 사용합니다.
