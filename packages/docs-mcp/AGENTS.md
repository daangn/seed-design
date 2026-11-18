# packages/docs-mcp

배포된 SEED 문서 사이트의 `llms.txt`·Rootage·아이콘 데이터를 AI 도구에 제공하는 MCP 서버(`@seed-design/docs-mcp`)다.

## 검증

- `bun --filter @seed-design/docs-mcp typecheck`
- `bun --filter @seed-design/docs-mcp lint`

## 규칙

- 문서는 배포된 사이트(`src/constants.ts`의 `SEED_DOCS_BASE_URL`)에서 읽는다. 로컬 `docs/` 변경은 배포 전에는 도구 결과에 나타나지 않는다.
- `docs/content/`의 section을 추가·삭제하거나 `llms.txt` 경로를 바꿀 때 → `src/config.ts`의 `SectionId`와 `SECTIONS`를 함께 고친다. 고치지 않으면 서버가 없는 URL을 요청한다.
- 외부 요청 추가 → `src/fetch.ts`에 함수를 두고 그 파일의 `fetchWithCache<T>()`를 거친다(export되지 않는다). 도구 파일에서 `fetch`를 직접 호출하지 않는다.
- 도구 이름은 `snake_case`로 쓴다. 예: `get_doc`, `list_icons`.
- 상대 import에는 `.js` 확장자를 붙인다. 예: `./config.js`.
