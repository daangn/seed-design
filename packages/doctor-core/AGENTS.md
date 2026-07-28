# AGENTS.md

## 디렉토리 개요

SEED Doctor의 중립 룰 엔진. Rule/Finding 계약, static 룰 실행기, 억제(suppression), 리포터, agent 룰 핸드오프 생성기를 제공한다. `@seed-design/doctor-preset` 같은 룰 팩과 CLI `doctor` 커맨드·seed-observability 서버가 이 패키지를 소비한다.

## 파일 작성 컨벤션

- `src/types.ts`가 조직 공용 계약의 단일 소스. 계약 변경은 `JSON_SCHEMA_VERSION` 영향 여부를 먼저 판단한다.
- 도메인별 하위 디렉토리(`engine/`, `suppression/`, `report/`, `agent/`)로 나누고, 공개 API는 `src/index.ts` barrel에서만 노출한다.
- 테스트는 `src/tests/*.test.ts` (bun test).

## 코드 작성 컨벤션

- **중립성**: SEED 특화 지식(컴포넌트 이름, 토큰, seed-design.io URL 등)을 절대 넣지 않는다. 그런 지식은 룰 팩(doctor-preset)에 속한다.
- **I/O 금지**: 디스크·네트워크 접근 금지. 파일은 `ScannedFile`로 받고, AST는 in-memory ts-morph 프로젝트로만 파싱한다. 유일한 런타임 의존성은 ts-morph.
- **zod 금지**: 계약은 플레인 타입. 호스트별 zod 메이저가 달라(cli v3, docs-mcp v4) 스키마를 노출하면 경계에서 깨진다. 외부 입력 검증은 `parseDoctorConfig`처럼 수기로 한다.
- **크래시 금지**: 룰 실행·파싱 실패는 `EngineDiagnostic`으로 수집한다. 한 룰의 실패가 실행 전체를 죽이면 안 된다.
- 엔진은 LLM을 호출하지 않는다. agent 룰은 핸드오프 마크다운 생성까지만 담당한다.
- 점수를 계산하지 않는다. 출력은 raw finding과 severity 카운트뿐이다.
