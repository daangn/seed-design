# AGENTS.md

## 디렉토리 개요

SEED Doctor의 SEED 룰 팩. `@seed-design/doctor-core`의 계약 위에 SEED 지식(rootage·registry 아티팩트)과 룰을 얹는다. CLI `doctor` 커맨드와 seed-observability 서버가 `loadSeedRulePack`으로 소비한다.

## 파일 작성 컨벤션

- `src/knowledge/`: seed-design.io 아티팩트 로더. 로더는 반드시 `fetchImpl` 주입을 지원한다(테스트는 네트워크 없이 스텁으로).
- `src/rules/`: 룰 하나당 파일 하나, `create<RuleName>Rule(knowledge, options)` 팩토리 형태.
- 테스트는 `src/tests/*.test.ts`. 룰 테스트는 `fixtures.ts`의 지식 픽스처를 쓴다 — 실제 rootage/registry 데이터에서 발췌해 유지한다.

## 코드 작성 컨벤션

- **지식 선(先)fetch**: 룰 팩 로드 시점에 지식을 전부 가져오고, 룰의 `check`는 동기·네트워크 없음을 유지한다 (결정론 보장).
- **오탐 제로 원칙**: 확신할 수 없으면 보고하지 않는다. 표현식 값·namespace import처럼 정적으로 판정 불가한 케이스는 건너뛴다.
- **결정론화 가능하면 static으로**: agent 룰은 static으로 판정 불가능한 것에만 쓴다.
- ts-morph를 직접 의존하지 않는다 — AST 타입·`Node` 가드·`SyntaxKind`는 doctor-core가 재노출한 것을 쓴다.
- 룰 id는 `seed/<kebab-case>` 네임스페이스를 쓴다.
- 사용자 노출 메시지(message/remediation)는 한국어 -어요/에요 톤 (CLI 관례).
