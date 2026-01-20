# tools

## 디렉토리 개요

**Figma 플러그인과 위젯** 모음. `packages/figma` 라이브러리와 달리 실행 가능한 도구들이다.

## 하위 프로젝트

| 디렉토리 | 역할 |
|----------|------|
| `figma-mcp/` | Figma MCP 서버 (AI 연동) |
| `figma-codegen/` | Figma → 코드 생성 |
| `figma-v3-migration/` | V2→V3 마이그레이션 |
| `figma-checklist-widget/` | 디자인 체크리스트 |
| `figma-contrast-checker/` | 색상 대비 검사 |
| `figma-expose-variables/` | 변수 노출 도구 |
| `figma-spec-widget/` | 스펙 위젯 |

## 파일 작성 컨벤션

- 각 플러그인은 독립 패키지
- `manifest.json` + `src/` 구조
- TypeScript 권장

## packages/figma와의 차이

- `packages/figma`: 라이브러리 (import해서 사용)
- `tools/figma-*`: 실행 가능한 플러그인 (Figma에서 직접 실행)
