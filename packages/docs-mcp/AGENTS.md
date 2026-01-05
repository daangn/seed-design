# @seed-design/docs-mcp

SEED Design 문서를 위한 공식 MCP(Model Context Protocol) 서버.

## 코드 작성 컨벤션

- TypeScript ESM 문법을 사용하며 import에 `.js` 확장자를 포함한다
- 타입 import에는 `type` 키워드를 사용한다
- Tool 이름은 `snake_case` (예: `get_react_component`)
- 함수/변수는 `camelCase`, 인터페이스/타입은 `PascalCase`
- 모든 외부 요청은 `src/fetch.ts`의 `fetchWithCache<T>()` 유틸리티를 사용한다

## 필수 작업 절차

### 작업 완료 후 체크리스트

1. **린트 및 타입 검사**: 모든 작업 후 반드시 실행

   ```bash
   bun run lint:fix   # 린트 수정
   bun run typecheck  # 타입 검사
   bun run build      # 빌드 검증
   ```

2. **README.md 동기화**: 코드 변경 시 README.md가 현재 상태를 반영하는지 확인
   - 새 Tool 추가/제거 시 → "Available Tools" 섹션 업데이트
   - API 변경 시 → 사용 예시 업데이트

## 버전 관리

- `src/server.ts`의 버전은 `package.json`에서 자동으로 가져온다
- 버전 변경은 `package.json`만 수정하면 된다
