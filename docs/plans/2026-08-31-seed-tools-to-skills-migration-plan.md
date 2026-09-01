# SEED 전용 도구의 저장소 스킬 전환 계획

- 작성일: 2026-08-31
- 상태: 구현 완료, 2026-09-01 후속 검토 반영
- 대상 저장소: `/Users/ette/workspace/10-daangn-org/seed-design`
- 참고 구현: `/Users/ette/workspace/10-design-system/pi-seed-agent`
- 기준 리비전: `seed-design@4fd45a826`, `pi-seed-agent@9ebbe6f`

## 결론

Pi 확장에 들어 있는 SEED 전용 판단 로직을 `seed-design/skills`로 옮긴다. 저장소의 현재 체크아웃을 단일 원천으로 삼고, 반복 가능한 조회만 작은 TypeScript 스크립트로 만든다. 파일 수정, 명령 실행, 기기 연결 같은 행동은 각 코딩 에이전트의 기본 기능을 사용한다.

`skills/`가 유일한 원본이다. 현재 `.agents/skills`, `.claude/skills`, `.claude/plugins/seed-design/skills`가 이 디렉터리를 가리키므로, 클라이언트별 복사본은 만들지 않는다. 플러그인은 나중에 배포 경로로 붙일 수 있지만 사실과 정책을 별도 서버나 플러그인 런타임에 두지 않는다.

이번 계획은 저장소 스킬 이름을 `seed-*`로 통일한 뒤 기존 스킬의 책임을 좁힌다. `seed-create-component`, `seed-write-lynx-component-docs`, `seed-changeset`을 정리하고 `seed-submit-change`를 만든다. 그다음 Pi의 나머지 읽기 전용 도구를 목적별 스킬로 옮긴다.

### 2026-09-01 후속 결정

- `seed-verify-lynx-example`은 현재 절차를 유지하지 않고 제거했다. 실제 Lynx 실행 검증은 요구사항을 다시 정리한 뒤 별도 작업에서 스킬화한다.
- 활성 스킬은 제거된 스킬을 호출하지 않는다. 문서 미리보기에서 확인한 범위와 실제 Lynx 환경에서 확인한 범위를 구분하고, 후자를 확인하지 못했다면 미검증 상태로 보고한다.
- 아래의 최초 구현 기록에서 이 결정과 충돌하는 내용은 이 후속 결정을 우선한다.

## 이 문서로 후속 작업 시작하기

필수 구현과 검증은 완료했다. 후속 작업 에이전트는 아래 명령으로 현재 상태를 확인한 뒤, 실행 결과와 의도적으로 보류한 항목을 먼저 읽는다.

```bash
cd /Users/ette/workspace/10-daangn-org/seed-design
git status --short --branch
bun test skills/seed-component-map/scripts/component-map.test.ts
```

현재 변경을 되돌리거나 브랜치를 임의로 동기화하지 않는다. 아래 스냅샷은 구현 시작 당시 기록이므로 현재 `git status`와 같을 필요가 없다. 완료된 단계를 다시 실행하지 않고, 후속 범위가 있으면 실행 결과를 기준으로 새 계획을 세운다.

다른 에이전트에 작업을 맡길 때는 다음 문장을 시작 프롬프트로 사용할 수 있다.

> `docs/plans/2026-08-31-seed-tools-to-skills-migration-plan.md`의 실행 결과와 보류 항목을 읽고 후속 범위만 계획한다. `seed-design`의 기존 변경은 보존하고, `pi-seed-agent`는 읽기 전용 참고 자료로만 사용한다.

## 목표와 경계

### 목표

- SEED 저장소의 사실 조회와 작업 절차를 Codex, Claude, Amp 같은 여러 코딩 에이전트가 읽을 수 있는 저장소 스킬로 제공한다.
- 같은 체크아웃과 같은 입력에는 같은 결과를 주는 조회 스크립트를 만든다.
- 기존 작업 스킬의 중복 절차와 불안정한 셸 우회 방식을 줄인다.
- Pi 구현에서 검증된 판정과 테스트 사례를 가져오되, Pi의 세션과 UI에 묶인 부분은 제거한다.
- 변경 영향에 맞는 `dev`, `minor`, `major` 기준 브랜치와 PR base를 같은 근거로 선택한다.

### 목표가 아닌 것

- Pi 도구의 이름, JSON 스키마, 요약 길이 옵션을 그대로 보존하지 않는다.
- MCP 서버나 별도 인덱스, 정적 컴포넌트 카탈로그를 만들지 않는다.
- 스킬 안에서 Git 신뢰 UI, 확인 대화상자, 세션 상태, 결과 축약 계층을 다시 구현하지 않는다.
- 이번 계획에서 플러그인 manifest나 에이전트별 설치 패키지를 만들지 않는다.
- Figma 문서 쓰기, 외부 전송, 세션 조율 같은 호스트 기능을 스킬로 흉내 내지 않는다.
- 공용 유틸 패키지, 새 의존성, 새 테스트 기반을 미리 만들지 않는다.
- Pi와 스킬을 함께 유지하는 호환 계층이나 폴백을 만들지 않는다.
- 예전 스킬 이름을 유지하기 위한 alias 디렉터리나 wrapper를 만들지 않는다.

### 변경하지 않을 범위

- `packages/`, `docs/content/`, `docs/registry/`, `examples/`의 제품 코드와 문서 내용
- 기존 컴포넌트 API와 생성 파이프라인
- `.agents/skills`, `.claude/skills`, `.claude/plugins/seed-design/skills`의 심링크 구조
- Pi 저장소의 도구 제거와 확장 등록 변경. 이 작업은 스킬 이관이 끝난 뒤 별도 변경으로 수행한다.

### 전체 완료 조건

- 저장소 스킬 이름이 모두 `seed-*` 형식이고 이전 이름의 복사본이 남지 않는다.
- `seed-create-component`, `seed-write-lynx-component-docs`, `seed-changeset`의 책임이 겹치지 않는다.
- 필수 신규 스킬이 모두 현재 체크아웃을 직접 읽고 외부 서버 없이 동작한다.
- 각 스크립트는 한 번에 한 대상을 처리하고 JSON으로 근거 경로를 반환한다.
- 쓰기와 외부 실행 전에 사용자 확인이 필요한 지점이 각 `SKILL.md`에 명시된다.
- `seed-change-plan`이 기준 브랜치와 PR base를 근거와 함께 반환하고, `seed-submit-change`가 같은 값을 리베이스와 PR에 사용한다.
- 집중 테스트와 저장소 공통 검증 결과가 기록된다.
- 이관이 끝난 기능은 Pi에서 별도 삭제할 수 있고, 스킬 쪽에 Pi 호환 코드가 남지 않는다.

## 시작 당시 작업트리 스냅샷

이 항목은 2026-08-31 기준이다. 작업을 재개할 때 실제 상태가 우선한다.

### seed-design

- 경로: `/Users/ette/workspace/10-daangn-org/seed-design`
- 브랜치: `seed-work-skills`
- HEAD: `4fd45a826`
- 원격 기준:
  - `origin/dev`: `c5cb6a146`
  - `origin/minor`: `20b04170f`
  - `origin/major`: `bc301f4bc`
- 현재 변경:
  - 신규, 아직 추적되지 않음: [`docs/plans/2026-08-31-seed-tools-to-skills-migration-plan.md`](./2026-08-31-seed-tools-to-skills-migration-plan.md)
- 확인된 심링크:
  - `.agents/skills -> ../skills`
  - `.claude/skills -> ../skills`
  - `.claude/plugins/seed-design/skills -> ../../../skills`

`seed-component-map`과 이름 전환 전 `create-component`의 첫 연결은 `4fd45a826`에 커밋되어 있다. 이 문서의 실행 결과로 현재 디렉터리는 `skills/seed-create-component`가 되었다. `seed-component-map`은 컴포넌트 한 개의 Rootage, Recipe, 구현, export, Registry, 문서, 예제, 테스트 경로를 현재 체크아웃에서 찾는다.

구현 시작 전 기준선 검증은 다음과 같다.

- `bun test skills/seed-component-map/scripts/component-map.test.ts`: 2개 통과
- `git diff --check`: 통과
- 직전 `bun test:all`: 1,889개 통과, 4개 실패. `node_modules/@seed-design/react-scale-feedback` 연결이 없는 환경 문제였으므로 의존성을 준비한 뒤 다시 확인한다. 집중 테스트 통과와 전체 테스트의 기존 환경 실패를 구분해 기록한다.

### pi-seed-agent

- 경로: `/Users/ette/workspace/10-design-system/pi-seed-agent`
- 브랜치: `main`
- HEAD: `9ebbe6f`
- 작업트리에 도구, 워크플로우, 테스트 변경이 함께 남아 있다.

따라서 Pi의 HEAD만 원본이라고 가정하지 않는다. 이관 시 현재 파일과 대응 테스트를 함께 읽고, 참고한 Pi 파일 경로와 당시 Git 상태를 작업 기록에 남긴다. Pi 파일은 수정하지 않는다.

## 주요 파일 지도

### seed-design의 현재 원본

| 역할 | 경로 | 현재 맥락 |
|---|---|---|
| 컴포넌트 작업 라우터 | [`skills/seed-create-component/SKILL.md`](../../skills/seed-create-component/SKILL.md) | 이름 전환과 책임 정리를 마친 현재 원본이다. |
| 컴포넌트 경로 조회 | [`skills/seed-component-map/SKILL.md`](../../skills/seed-component-map/SKILL.md) | 이번 전환의 첫 기준 구현이다. |
| 컴포넌트 맵 스크립트 | [`skills/seed-component-map/scripts/component-map.ts`](../../skills/seed-component-map/scripts/component-map.ts) | 읽기 전용이며 한 컴포넌트의 표면을 JSON으로 반환한다. |
| Lynx 문서 작업 | [`skills/seed-write-lynx-component-docs/SKILL.md`](../../skills/seed-write-lynx-component-docs/SKILL.md) | 문서 작성과 확인 범위를 정리한 현재 원본이다. |
| Lynx 런타임 분류 | [`skills/seed-write-lynx-component-docs/references/preview-runtime.md`](../../skills/seed-write-lynx-component-docs/references/preview-runtime.md) | 브라우저 미리보기와 실제 Lynx의 확인 범위를 구분한다. |
| Lynx 문서 검증 | [`skills/seed-write-lynx-component-docs/references/verification.md`](../../skills/seed-write-lynx-component-docs/references/verification.md) | 정적 검증과 실제 Lynx 확인의 경계를 설명한다. |
| 릴리스 작업 | [`skills/seed-changeset/SKILL.md`](../../skills/seed-changeset/SKILL.md) | 후보 계산과 사용자 확인 절차를 정리한 현재 원본이다. |
| 버전 정책 | [`skills/seed-changeset/references/version-matrix.md`](../../skills/seed-changeset/references/version-matrix.md) | bump와 내부 의존성 전파의 단일 기준이다. |
| 메시지 정책 | [`skills/seed-changeset/references/patterns.md`](../../skills/seed-changeset/references/patterns.md) | 사용자 관점 changeset 문구를 정의한다. |
| 범용 SEED 안내 | [`skills/seed-design/SKILL.md`](../../skills/seed-design/SKILL.md) | 소비자 프로젝트 안내와 Doctor 라우팅이 중심이다. |

`seed_lynx_example_verify`의 스킬 전환은 후속 재설계 대상으로 돌렸다. `skills/seed-submit-change`는 변경 계획에서 확정한 기준 브랜치로 feature 커밋만 옮기고 같은 PR base를 사용하는 절차를 맡는다.

### Pi에서 참고할 원본

아래 경로는 모두 `/Users/ette/workspace/10-design-system/pi-seed-agent` 기준이다.

| Pi 기능 | 구현 | 대응 테스트 | 이관 방향 |
|---|---|---|---|
| `seed_component_map` | `extensions/tools/seed-component-map.ts` | `test/unit/component-map.test.ts` | `seed-component-map`에 이미 최소 이관됨 |
| `seed_api_parity` | `extensions/tools/seed-api-parity.ts` | `test/unit/api-parity.test.ts` | 신규 `seed-api-parity` |
| `seed_component_scaffold` | `extensions/tools/seed-component-scaffold.ts` | `test/unit/component-scaffold.test.ts` | `seed-create-component` 개선으로 흡수 |
| `seed_lynx_example_verify` | `extensions/tools/seed-lynx-example-verify.ts` | `test/unit/lynx-example-verify.test.ts` | 후속 재설계 후보. 현재 대응 스킬 없음 |
| `seed_changeset_plan` | `extensions/tools/seed-changeset-plan.ts` | `test/unit/changeset-plan.test.ts` | 기존 `seed-changeset` 개선 |
| `seed_change_impact` | `extensions/tools/seed-change-impact.ts` | `test/unit/change-impact.test.ts` | 신규 `seed-change-plan`에 통합 |
| `seed_change_plan` | `extensions/tools/seed-change-plan.ts` | `test/unit/change-plan.test.ts` | 신규 `seed-change-plan`에 통합 |
| `seed_verify_plan` | `extensions/tools/seed-verify-plan.ts` | `test/unit/verify-plan.test.ts` | 신규 `seed-change-plan`에 통합 |
| `seed_verify_run` | `extensions/tools/seed-verify-run.ts` | `test/unit/verify-run.test.ts` | 별도 스킬로 만들지 않음 |
| `seed_token_impact` | `extensions/tools/seed-token-impact.ts` | `test/unit/token-impact.test.ts` | 신규 `seed-token-analysis` |
| `seed_token_contrast` | `extensions/tools/seed-token-contrast.ts` | `test/unit/token-contrast.test.ts` | `seed-token-analysis`에 통합 |
| `seed_package_inspect` | `extensions/tools/seed-package-inspect.ts` | `test/unit/package-inspect.test.ts` | 신규 `seed-package-map` |
| `seed_workspace_inspect` | `extensions/tools/seed-workspace-inspect.ts` | 대응 단위 테스트와 공통 테스트 | 별도 스킬 없이 최소 사전 점검으로 흡수 |
| `seed_figma_target_map` | `extensions/tools/seed-figma-target-map.ts`와 `extensions/figma/target-map.ts` | `test/unit/figma-target-map.test.ts` | 후순위 `seed-figma-target-map` 후보 |

`extensions/index.ts`와 `extensions/tools/seed-tools.ts`는 Pi 등록 구조를 이해하는 자료일 뿐이다. 스킬 구현으로 복사하지 않는다.

## 설계 원칙

1. 현재 체크아웃이 단일 원천이다. 결과 파일, 캐시, 외부 서버를 사실의 원본으로 두지 않는다.
2. `SKILL.md`는 판단 순서와 안전 경계를 설명한다. 파일 순회, 경로 정규화, 그래프 계산처럼 반복 가능한 부분만 `scripts/`에 둔다.
3. 스크립트는 읽기 전용을 기본값으로 한다. 파일 작성은 에이전트가 변경 내용을 보여주고 사용자 확인을 받은 뒤 수행한다.
4. 한 번에 한 컴포넌트, 토큰, 패키지를 처리한다. Pi의 배치 입력, `detail`, 응답 잘라내기 옵션은 옮기지 않는다.
5. 저장소 루트는 현재 작업 경로에서 찾는다. 임의의 `cwd`, 신뢰 UI, 허용 루트 매개변수는 에이전트 호스트의 책임으로 남긴다.
6. 생성물과 원천 파일을 구분하되, 생성물을 직접 고치는 우회 경로를 제공하지 않는다.
7. 판단할 근거가 없으면 `unknown`이나 차단 상태를 반환한다. 비슷한 이름, 다른 플랫폼 파일, 외부 세션을 임의로 고르지 않는다.
8. 같은 규칙을 여러 스킬에 복사하지 않는다. 작업 스킬은 다른 스킬을 호출하고, 상세 규칙은 기존 reference 한 곳에 둔다.
9. 스킬은 강제 장치가 아니다. 외부 쓰기 금지와 필수 검증은 `AGENTS.md`, Git hook, CI 같은 저장소 정책으로 보장한다.
10. 두 번째 사용처가 생기기 전에는 공통 모듈이나 패키지를 추출하지 않는다.
11. 분석 스킬은 Git 상태를 바꾸지 않는다. 리베이스, 커밋, push, PR 생성은 별도 작업 스킬이 사용자 확인 뒤 수행한다.

## 스킬 이름 전환

`skills/` 아래 저장소 전용 스킬은 모두 `seed-*` 이름을 사용한다. 기능 변경 전에 디렉터리, `SKILL.md` frontmatter의 `name`, 스킬 간 상대 링크와 호출 이름을 한 번에 바꾼다.

| 현재 이름 | 변경할 이름 |
|---|---|
| `changeset` | `seed-changeset` |
| `create-component` | `seed-create-component` |
| `deprecation` | `seed-deprecation` |
| `dev-figma-v3-migration-plugin` | `seed-dev-figma-v3-migration-plugin` |
| `migrate-component-docs-from-figma` | `seed-migrate-component-docs-from-figma` |
| `snapshot-release` | `seed-snapshot-release` |
| `verify-figma-mcp-transports` | `seed-verify-figma-mcp-transports` |
| `write-lynx-component-docs` | `seed-write-lynx-component-docs` |

`seed-design`과 `seed-component-map`은 이미 규칙을 따르므로 유지한다. 새 스킬도 모두 `seed-*`로 만든다. 예전 이름을 위한 alias, 심링크, wrapper는 남기지 않는다.

이름 변경 단계에서는 본문 책임이나 스크립트 동작을 함께 바꾸지 않는다. 이동 뒤 `rg`로 이전 디렉터리명, frontmatter 이름, 호출 이름이 남았는지 확인하고 다음 단계부터 새 경로만 사용한다.

## 목표 스킬 구조

```text
seed-component-map ──> seed-api-parity ──> seed-create-component
                              └──────────> seed-write-lynx-component-docs

seed-change-plan ──> 에이전트 기본 셸 ──> seed-changeset
       ▲                                           ▲
       ├── seed-token-analysis ─────────────────────┘
       └── seed-package-map

seed-change-plan ──> seed-submit-change ──> Git rebase/commit/push
                              └────────────> PR base 확인
```

`seed-design`은 소비자 질문과 저장소 작업 스킬을 연결하는 얇은 입구로 남긴다. 모든 절차를 다시 설명하는 상위 스킬로 키우지 않는다.

## 기존 작업 스킬 개선 계획

### 1. seed-create-component

목적은 라우터 역할을 유지하면서, 구현 전에 현재 표면과 플랫폼 차이를 근거로 남기게 하는 것이다.

수정 대상:

- `skills/seed-create-component/SKILL.md`
- `skills/seed-create-component/references/api-design.md`
- `skills/seed-create-component/references/architecture-decisions.md`
- `skills/seed-create-component/references/verification-checklist.md`
- 계획된 신규 파일: `skills/seed-create-component/scripts/scaffold-plan.ts`
- 계획된 신규 파일: `skills/seed-create-component/scripts/scaffold-plan.test.ts`

변경 내용:

- 현재 작업트리의 `seed-component-map` 연결을 유지한다.
- React와 Lynx를 함께 다루면 `seed-api-parity` 결과를 Analog Parity Check의 입력으로 사용한다.
- `scaffold-plan.ts`는 사용자가 확정한 플랫폼과 공개 표면을 입력받아 원천, 생성물, 참고 파일, 기존 파일 충돌만 계산한다.
- Pi처럼 archetype, Registry, style 전략을 자동 확정하지 않는다. 아키텍처와 wrapper 가치는 기존 게이트에서 결정한다.
- 여러 reference에 반복된 검증 명령은 `verification-checklist.md`에 모은다. 실제 Lynx 환경 검증은 확인 가능한 범위와 미검증 범위를 수동으로 구분한다.

완료 조건:

- 신규 컴포넌트는 `not-found`, 기존 컴포넌트는 현재 표면을 근거로 계획한다.
- 스크립트가 파일을 만들거나 생성물을 수정하지 않는다.
- 원천과 생성물 경계, 기존 파일 충돌을 검증하는 주 경로 테스트 한 개가 있다.
- 게이트를 통과하지 않은 상태에서 scaffold 결과만으로 구현을 시작하지 않는다.

### 2. Lynx 실행 검증 후속 보류

최초 구현한 `seed-verify-lynx-example`은 2026-09-01 검토에서 제거했다. entry, manifest, bundle, client와 session을 한 절차에 묶기 전에 실제로 반복되는 검증 요구와 실행 환경을 다시 확인해야 한다.

현재는 문서와 예제의 정적 연결을 기존 빌드와 문서 미리보기로 확인한다. 실제 Lynx 동작을 새로 주장하는 변경은 가능한 환경에서 별도로 확인하고, 환경이 없으면 미검증으로 보고한다. 이를 우회하려는 임시 앱이나 별도 구현은 추가하지 않는다.

### 3. seed-write-lynx-component-docs

이 스킬은 문서와 예제 작성에 집중한다. 실제 Lynx 실행 검증 절차를 대신 설계하지 않는다.

수정 대상:

- `skills/seed-write-lynx-component-docs/SKILL.md`
- `skills/seed-write-lynx-component-docs/references/authoring.md`
- `skills/seed-write-lynx-component-docs/references/preview-runtime.md`
- `skills/seed-write-lynx-component-docs/references/verification.md`

변경 내용:

- 시작 단계에서 `seed-component-map`으로 문서, 예제, package export를 찾는다.
- React 문서와 차이를 설명해야 하면 `seed-api-parity`를 사용한다.
- `authoring.md`는 frontmatter, MDX, 예제 코드 규칙을 유지한다.
- `preview-runtime.md`는 브라우저 미리보기와 실제 런타임의 확인 범위만 구분한다.
- `verification.md`는 정적 검증과 실제 Lynx 환경에서 확인해야 할 조건을 구분하되 client/session 조작 절차를 포함하지 않는다.
- 문서만 바뀌었고 네이티브 동작이 달라지지 않았다면 실기기 검증을 무조건 요구하지 않는다. 변경 범위에 맞는 근거를 남긴다.

완료 조건:

- 문서 작성과 정적 확인 절차만 이 스킬에 두고, 실제 Lynx 실행 검증 절차는 후속 범위로 남긴다.
- 웹 미리보기 한계를 이유로 배포 컴포넌트를 바꾸지 않는 현재 원칙이 유지된다.
- 실제 런타임 동작을 주장할 때는 직접 확인한 환경과 근거를 요구한다. 확인하지 못했다면 미검증으로 남긴다.

### 4. seed-changeset

대화형 `bun changeset`을 일정 시간 뒤 종료하는 후보 탐색을 제거한다. 저장소의 Git 변경과 workspace 정보를 직접 읽는 작은 계획 스크립트로 바꾼다.

수정 대상:

- `skills/seed-changeset/SKILL.md`
- `skills/seed-changeset/references/version-matrix.md`
- 계획된 신규 파일: `skills/seed-changeset/scripts/changeset-plan.ts`
- 계획된 신규 파일: `skills/seed-changeset/scripts/changeset-plan.test.ts`

변경 내용:

- `.changeset/config.json`의 base branch와 현재 Git 변경에서 공개 workspace 패키지 후보를 찾는다.
- private 패키지와 `packages/archive/*`를 구분한다.
- 기존 `.changeset/*.md`가 이미 다루는 패키지를 함께 반환한다.
- workspace 의존 관계와 버전 범위를 읽어 reverse dependency와 Version Changes PR의 peer 하한 검토 후보를 제시한다.
- bump 추천은 `version-matrix.md`와 실제 공개 표면 변경을 읽은 에이전트가 사용자에게 확인한다. 스크립트가 의미를 추측하지 않는다.
- 사용자 확인 뒤 확정된 패키지별 bump와 가장 높은 bump를 `seed-change-plan`이 다시 읽을 수 있는 근거로 남긴다. 브랜치 선택은 이 스킬이 직접 수행하지 않는다.
- 메시지 작성과 최종 파일 생성은 기존처럼 사용자 확인 뒤 수행한다. 스크립트는 `.changeset` 파일을 쓰지 않는다.
- Pi의 `phase=write`, 호스트 UI 확인, 결과 파일 직접 쓰기를 이관하지 않는다.

완료 조건:

- `sleep`, `kill`, 터미널 폭, ANSI 출력에 의존하지 않고 후보를 얻는다.
- 이미 커버된 패키지와 전파 후보를 구분한다.
- 후보 계산 주 경로와 archive/private 제외 경로를 최소 테스트로 검증한다.
- 이 스킬은 package version과 dependency range를 바꾸지 않는다. changeset 파일은 사용자 확인 뒤에만 작성한다.

### 5. seed-component-map

현재 구현을 다음 스킬의 기준으로 사용한다. API parity나 scaffold 작업에서 실제 누락이 확인될 때만 탐색 범위를 고친다.

수정 원칙:

- 정적 컴포넌트 목록이나 결과 캐시를 추가하지 않는다.
- 다른 스킬을 위해 출력 필드를 무분별하게 늘리지 않는다. 필요한 근거 경로가 기존 분류로 표현되지 않을 때만 추가한다.
- 공통 경로 모듈은 두 번째 스크립트에서 같은 코드가 실제로 반복된 뒤 추출한다.
- 현재 테스트의 정확한 이름 조회와 부분 이름 모호성 처리를 유지한다.

### 6. seed-design

소비자 프로젝트용 Doctor와 저장소 저자용 작업 스킬을 섞지 않는다.

필요한 변경은 한정한다.

- SEED 저장소 안에서 컴포넌트 구현, Lynx 문서, changeset, 작업 제출을 요청받았을 때 해당 `seed-*` 작업 스킬로 보내는 짧은 라우팅 표만 추가한다.
- workspace 전체 검사 스크립트는 만들지 않는다. 저장소 루트와 적용 `AGENTS.md`, Git 상태를 확인하는 공통 사전 점검으로 충분하다.
- 기존 Doctor 규칙과 각 작업 스킬의 상세 절차를 복사하지 않는다.

## 신규 스킬 이관 계획

### 필수: seed-api-parity

Pi의 `seed_api_parity`를 현재 체크아웃 전용 읽기 스킬로 옮긴다.

계획된 파일:

- `skills/seed-api-parity/SKILL.md`
- `skills/seed-api-parity/scripts/api-parity.ts`
- `skills/seed-api-parity/scripts/api-parity.test.ts`

첫 범위는 한 컴포넌트의 React와 Lynx 공개 export, props, Recipe variant, slot, 상태, 이벤트, 접근성, Registry, 문서 차이다. `seed-component-map`의 경로를 입력 근거로 사용하고, 소스에서 확인하지 못한 차원은 `unknown`으로 남긴다. Pi의 신뢰 컨텍스트, `cwd`, `detail`, 결과 축약은 제외한다.

최소 테스트는 양쪽 플랫폼이 있는 컴포넌트 한 개와 한쪽 공개 표면이 없는 경우 한 개다.

### 필수: seed-change-plan

`seed_change_impact`, `seed_change_plan`, `seed_verify_plan`을 하나의 작업 스킬로 합친다.

계획된 파일:

- `skills/seed-change-plan/SKILL.md`
- `skills/seed-change-plan/scripts/change-plan.ts`
- `skills/seed-change-plan/scripts/change-plan.test.ts`

현재 Git 변경이나 명시한 계획 경로에서 package, source/generated, component, platform, docs/example 영향을 찾고 필요한 생성, 집중 테스트, build, 수동 검증을 순서대로 제안한다. 명령의 근거가 루트 정책인지 package script인지 함께 표시한다. 명령은 실행하지 않는다.

결과에는 아래 브랜치 정보를 함께 반환한다.

```text
targetBranch: dev | minor | major | unknown
targetRef: origin/dev | origin/minor | origin/major | unknown
prBase: dev | minor | major | unknown
reason: 선택 근거
evidence: 확인한 changeset, 경로, 브랜치 차이
```

브랜치 선택은 다음 순서를 따른다.

1. 현재 feature가 갈라진 기존 기준을 확인하고 `origin/dev`, `origin/minor`, `origin/major` 중 하나를 `--base-ref`로 명시한다. Git 근거를 모두 읽지 못하면 `unknown`을 반환한다.
2. 변경 경로가 `minor`나 `major`의 미출시 diff와 겹치면 후보로만 남긴다. 양쪽 diff를 직접 확인한 뒤 `--lane minor`, `--lane major`, `--lane none` 중 하나를 명시해야 확정할 수 있다.
3. 배포 가능한 패키지가 바뀌면 사용자가 확정한 changeset bump를 사용한다. `major`는 `major`, `minor`는 `minor`, `patch`는 `dev`다. changeset이 필요 없다고 확인한 경우에만 `--no-release`를 사용한다.
4. 확정 lane과 bump가 충돌하거나 배포 패키지의 bump가 아직 확정되지 않았으면 `unknown`을 반환한다.
5. lane 변경과 릴리스가 없는 문서, 스킬, 내부 도구 변경은 `dev`를 사용한다. SHA가 같더라도 선택한 브랜치 이름은 다른 이름으로 바꾸지 않는다.

최종 제출 전과 리베이스 후에는 최초에 확정한 `--lane` 및 `--bump` 또는 `--no-release`를 유지하고 `--base-ref`만 실제 기준에 맞춰 다시 실행한다.

최소 테스트는 릴리스가 없는 변경이 `dev`를 선택하는 주 경로와, 브랜치 전용 근거와 확정 bump가 충돌해 `unknown`을 반환하는 실패 경로를 다룬다.

`seed_verify_run`의 세션 baseline, 로그 저장, 실패 지문 분류는 옮기지 않는다. 에이전트가 계획을 보여주고 필요한 승인을 받은 뒤 기본 셸로 명령을 실행하며 실제 출력을 보고한다.

### 필수: seed-submit-change

변경 계획에서 확정한 기준 브랜치로 feature 브랜치를 정렬하고, 같은 base로 커밋, push, PR 생성 또는 갱신을 마치는 작업 스킬이다. `seed-change-plan`의 읽기 전용 책임과 Git 변경을 분리하기 위해 별도 스킬로 둔다.

계획된 파일:

- `skills/seed-submit-change/SKILL.md`
- 절차가 본문을 크게 만들 때만 `skills/seed-submit-change/references/branch-and-pr.md`

스크립트는 만들지 않는다. Git과 GitHub CLI 실행은 에이전트의 기본 기능을 사용한다.

변경 내용:

- `seed-change-plan`의 `targetBranch`, `targetRef`, `prBase`와 근거를 입력으로 사용한다. 값이 `unknown`이면 리베이스하지 않는다.
- `origin/dev`, `origin/minor`, `origin/major`를 최신 상태로 가져온 뒤 계획 결과가 여전히 맞는지 확인한다.
- 기준 브랜치 자체를 수정하지 않고 현재 feature 브랜치의 커밋만 선택한 `targetRef` 위로 리베이스한다.
- 커밋되지 않은 변경이 있으면 자동 stash나 `--autostash`를 사용하지 않는다. 먼저 포함할 파일과 커밋 메시지를 보여주고 사용자 확인을 받는다. 리베이스에 커밋이 필요하면 승인된 변경을 커밋한 뒤 해당 커밋을 기준 브랜치 위로 옮긴다.
- 충돌은 양쪽 파일의 의도를 읽고 현재 작업 범위 안에서만 해결한다. 판단 근거가 부족하면 `git rebase --abort`로 원래 상태를 복구하고 멈춘다.
- 리베이스 뒤 `seed-change-plan`이 제안한 집중 검증을 다시 실행한다.
- 아직 원격에 없는 feature 브랜치는 일반 push를 사용한다. 이미 원격에 있고 리베이스로 SHA가 바뀌었다면 원격의 예상 SHA를 다시 확인하고, 사용자 확인 뒤 정확한 ref와 SHA를 지정한 `--force-with-lease`만 사용한다.
- PR 생성은 `gh pr create --base <prBase>`처럼 base를 명시한다. 기존 PR의 base가 다르면 리베이스를 먼저 마친 뒤 사용자 확인을 받아 `gh pr edit --base <prBase>`로 바꾼다.
- 생성 또는 갱신 뒤 PR의 실제 `baseRefName`, `headRefName`, head SHA를 다시 읽어 계획 결과와 일치하는지 확인한다.
- 커밋 메시지와 PR 제목은 저장소의 영어 Conventional Commits 규칙을 따른다.

완료 조건:

- 변경 계획의 기준 브랜치와 실제 리베이스 대상, PR base가 같다.
- `dev`, `minor`, `major` 브랜치를 직접 커밋하거나 push하지 않는다.
- 충돌, 원격 SHA 변경, PR base 불일치가 성공으로 보고되지 않는다.
- push와 PR 생성 또는 base 변경은 실행 직전 사용자 확인을 받는다.
- 작업 전후 feature 브랜치 SHA, 기준 브랜치 SHA, 검증 결과, PR base를 보고한다.

### 후순위: seed-token-analysis

`seed_token_impact`와 `seed_token_contrast`의 저장소 원천 분석만 한 스킬에 둔다.

계획된 파일:

- `skills/seed-token-analysis/SKILL.md`
- `skills/seed-token-analysis/scripts/token-map.ts`
- `skills/seed-token-analysis/scripts/token-map.test.ts`
- `skills/seed-token-analysis/scripts/token-contrast.ts`
- `skills/seed-token-analysis/scripts/token-contrast.test.ts`

한 번에 색상 토큰 하나의 Rootage 정의, mode와 alias, 의존 토큰, 컴포넌트 사용, 실제 생성 표면을 찾는다. 대비 계산은 alias, alpha, backdrop을 명시적으로 해석한다. 여러 토큰 배치와 릴리스 bump 판단은 제외한다. 릴리스 영향은 `seed-change-plan`과 `seed-changeset`이 맡는다.

### 후순위: seed-package-map

workspace 패키지 하나의 로컬 관계만 다룬다.

계획된 파일:

- `skills/seed-package-map/SKILL.md`
- `skills/seed-package-map/scripts/package-map.ts`
- `skills/seed-package-map/scripts/package-map.test.ts`

직접 의존성, reverse dependency, workspace 범위, package exports, 공개 타입 entry를 반환한다. Pi의 `node_modules`, Bun cache, lockfile 설치 버전, 소비자 프로젝트 import 가능성 진단은 옮기지 않는다. 이 기능이 `seed-change-plan` 밖에서 독립적으로 두 번 이상 쓰이지 않으면 별도 스킬을 만들지 않고 change plan 내부에 유지한다.

### 보류: seed-figma-target-map

Figma URL의 file, branch, node 식별자 정규화와 로컬 컴포넌트 맵 연결만 순수 스크립트로 옮길 수 있다. Figma 연결 상태, 문서 읽기와 쓰기, 사용자 확인 UI는 각 호스트 기능이다.

핵심 스킬 이관 뒤 실제 반복 수요가 확인되면 다음 경로를 만든다.

- `skills/seed-figma-target-map/SKILL.md`
- `skills/seed-figma-target-map/scripts/target-map.ts`
- `skills/seed-figma-target-map/scripts/target-map.test.ts`

## 이관하지 않는 Pi 기능

| 기능 | 처리 |
|---|---|
| `seed_verify_run` | `seed-change-plan`이 계획만 만들고 각 에이전트의 기본 셸로 실행한다. |
| `seed_workspace_inspect` | 저장소 진입 사전 점검과 `seed-design` 라우팅에 최소 흡수한다. |
| capability doctor, session retrospective | Pi 런타임 운영 기능이므로 이관하지 않는다. |
| workflow define, reply, submit, finish | Pi 세션 조율 기능이므로 이관하지 않는다. Git 작업 제출은 별도 `seed-submit-change`가 맡는다. |
| Figma status, document inspect/plan/write | 원격 상태와 쓰기 기능이므로 범용 스킬로 가장하지 않는다. |
| 외부 쓰기 guard | 스킬이 아닌 저장소 정책, hook, CI에서 유지한다. |

## 실행 순서

각 단계는 독립적으로 끝낸다. 앞 단계가 완료되기 전에 다음 스킬의 공통 계층을 미리 만들지 않는다.

### 0단계: 기준선 고정

- [x] 현재 `seed-design` 변경과 Pi 변경을 다시 확인한다.
- [x] `seed-component-map`의 두 집중 테스트를 실행한다.
- [x] Pi 참고 파일과 테스트의 현재 diff를 읽고 참고 리비전을 작업 기록에 남긴다.
- [x] 새 패키지, 의존성, tsconfig, CI 변경이 필요하지 않음을 확인한다. 필요해지면 구현 전에 사용자에게 묻는다.

완료 조건: 현재 변경을 보존한 상태에서 map 기준선과 Pi 참고 범위가 기록되어 있다.

### 1단계: `seed-*` 이름 통일

- [x] 이름 전환 표의 기존 스킬 디렉터리를 새 이름으로 옮긴다.
- [x] 각 `SKILL.md` frontmatter의 `name`과 본문 호출 이름을 바꾼다.
- [x] 스킬 간 상대 링크, 계획 문서, 저장소 안의 명시적 호출을 새 경로로 바꾼다.
- [x] 이전 이름의 alias, 심링크, wrapper를 만들지 않는다.

집중 검증:

```bash
rg -n "skills/(changeset|create-component|deprecation|dev-figma-v3-migration-plugin|migrate-component-docs-from-figma|snapshot-release|verify-figma-mcp-transports|write-lynx-component-docs)" . --glob '!docs/plans/2026-08-31-seed-tools-to-skills-migration-plan.md'
rg -n "^name: (changeset|create-component|deprecation|dev-figma-v3-migration-plugin|migrate-component-docs-from-figma|snapshot-release|verify-figma-mcp-transports|write-lynx-component-docs)$" skills
git diff --check
```

두 `rg` 명령은 결과가 없어야 한다. 일반 명사로 쓰인 changeset, deprecation 같은 단어는 변경 대상이 아니다.

완료 조건: `skills/` 아래 모든 저장소 스킬 디렉터리와 frontmatter 이름이 `seed-*` 형식이고, 이전 호출 경로가 남지 않는다.

### 2단계: 컴포넌트 계획 축

- [x] `seed-api-parity`를 만든다.
- [x] `seed-create-component`가 map과 parity 결과를 게이트 입력으로 사용하도록 정리한다.
- [x] 작은 `scaffold-plan.ts`로 원천, 생성물, 충돌 계산만 분리한다.
- [x] 중복된 검증 문장을 한 reference로 모은다.

집중 검증:

```bash
bun test skills/seed-component-map/scripts/component-map.test.ts \
  skills/seed-api-parity/scripts/api-parity.test.ts \
  skills/seed-create-component/scripts/scaffold-plan.test.ts
bunx biome check skills/seed-component-map skills/seed-api-parity skills/seed-create-component
git diff --check
```

완료 조건: 한 컴포넌트의 현재 표면, 플랫폼 차이, 계획 파일 경계를 구현 전에 재현할 수 있다.

### 3단계: Lynx 문서와 실행 검증 경계 정리

- [x] `seed-verify-lynx-example`과 활성 참조를 제거한다.
- [x] `seed-write-lynx-component-docs`는 문서·예제 작성과 정적 확인만 안내한다.
- [x] `seed-create-component`는 실제 Lynx 환경에서 확인하지 못한 결과를 미검증으로 보고한다.
- [x] 문서 연구가 필요하면 현재 작업 환경에서는 로컬 Refer 자료와 Lynx 전용 스킬을 우선하고 Context7이나 웹 검색은 사용하지 않는다.

완료 조건: 브라우저 미리보기와 실제 Lynx 실행 근거가 구분되고, 제거된 스킬을 호출하는 활성 절차가 없다.

### 4단계: changeset 계획 안정화

- [x] `changeset-plan.ts`로 후보와 기존 coverage를 계산한다.
- [x] reverse dependency와 Version Changes PR의 peer 하한 검토 후보를 출력한다.
- [x] `seed-changeset/SKILL.md`에서 백그라운드 CLI 종료 방식을 제거한다.
- [x] bump와 메시지, 파일 쓰기는 사용자 확인 뒤에만 수행하는 흐름을 유지한다.

집중 검증:

```bash
bun test skills/seed-changeset/scripts/changeset-plan.test.ts
bunx biome check skills/seed-changeset
git diff --check
```

완료 조건: 대화형 CLI 출력을 파싱하지 않고 같은 변경 집합에서 같은 후보와 coverage를 얻는다.

### 5단계: 변경 영향, 기준 브랜치와 제출 흐름

- [x] `seed-change-plan`을 만든다.
- [x] source/generated, package, platform, docs/example 영향을 분류한다.
- [x] 루트 지침과 package script에 근거한 검증 순서를 반환한다.
- [x] 릴리스 lane과 브랜치 차이를 근거로 `targetBranch`, `targetRef`, `prBase`를 반환한다.
- [x] 명령 실행과 baseline 저장을 스킬에 넣지 않는다.
- [x] `seed-submit-change`를 만들고 리베이스, 커밋, push, PR base 확인 절차를 연결한다.
- [x] `unknown` 대상, 충돌, 원격 SHA 변경, PR base 불일치에서 멈추는 경계를 확인한다.

집중 검증:

```bash
bun test skills/seed-change-plan/scripts/change-plan.test.ts
bunx biome check skills/seed-change-plan
git diff --check
```

완료 조건: 현재 변경에서 필요한 검증과 수동 확인을 설명하고, 확정한 기준 브랜치와 같은 base로 feature 브랜치와 PR을 준비할 수 있다.

### 6단계: 반복 수요가 확인된 분석 스킬

- [ ] 토큰 변경 작업이 실제로 예정되어 있으면 `seed-token-analysis`를 만든다.
- [ ] package graph 조회가 change plan 밖에서도 필요하면 `seed-package-map`을 만든다.
- [ ] Figma URL과 로컬 표면 연결 수요가 남아 있으면 `seed-figma-target-map`을 만든다.
- [x] 수요가 확인되지 않은 항목은 체크하지 않은 채 보류 사유를 남긴다.

세 항목 모두 이번 작업에서 독립적인 반복 수요가 확인되지 않았다. 예상 수요만으로 스킬과 공통 계층을 늘리지 않기 위해 보류했다.

완료 조건: 예상 수요만으로 새 스킬이나 공통 계층을 만들지 않았다.

### 7단계: 저장소 공통 검증과 인식 확인

스킬 구현이 끝난 뒤 저장소 지침에 따라 실행한다.

```bash
bun generate:all
git status --short
bun test:all
git diff --check
```

TypeScript 스크립트를 바꿨다면 관련 집중 테스트와 Biome 검사를 먼저 통과시킨다. `bun generate:all`이 예상하지 않은 제품 파일을 바꾸면 원인을 확인하고 스킬 작업과 무관한 변경을 포함하지 않는다.

검증 결과는 다음과 같다.

- [x] 여섯 스크립트의 집중 테스트 32개가 통과했다.
- [x] 변경한 스크립트의 Biome 검사와 OXLint 순환 복잡도 최대 5 기준이 통과했다.
- [x] `bun generate:all`이 성공했다. 기존 원천 때문에 생성된 무관한 문서 인덱스 변경은 원인을 확인하고 작업에서 제외했다.
- [x] `bun packages:build`, Lynx 예제 타입 검사와 Lynx 도구 타입 검사가 통과했다.
- [x] `bun test docs`는 302개 통과, 1개 실패였다. 최종 `bun test:all`은 1,915개 통과, 5개 실패였다. 실패는 모두 작업 전에도 확인된 `node_modules/@seed-design/react-scale-feedback` 연결 누락에서 발생했다.
- [x] 이전 스킬 이름 검색, 14개 스킬의 디렉터리와 frontmatter 이름 대응, 세 클라이언트 심링크, `git diff --check`를 확인했다.
- [x] `seed-change-plan --base-ref origin/minor --no-release`는 `targetBranch: dev`, `targetRef: origin/dev`, `prBase: dev`를 반환했다. 변경한 MCP 파일은 배포 대상인 `files`에 포함되지 않으므로 changeset 없이 내부 도구 변경으로 확정했다.

각 클라이언트에서는 동일한 `skills/` 원본이 발견되는지만 확인한다.

- `.agents/skills`를 읽는 환경
- `.claude/skills`를 읽는 환경
- `.claude/plugins/seed-design/skills`를 읽는 Claude 플러그인 환경

인식 경로가 다른 앱은 새 복사본을 만들지 않는다. 필요한 경우 `skills/`를 가리키는 얇은 심링크나 manifest만 별도 변경으로 제안한다.

## 단계별 검토 기준

각 스킬 변경을 마칠 때 다음 질문에 답한다.

- 이 규칙은 저장소 사실인가, 작업 판단인가, 호스트 기능인가?
- 스크립트 없이도 짧고 정확하게 수행할 수 있는 일을 코드로 만들지 않았는가?
- Pi의 안전 계층을 제거하면서 필요한 사용자 확인까지 없애지 않았는가?
- 근거 경로를 직접 읽지 않고 이름이나 디렉터리 패턴만으로 결론 내리지 않았는가?
- 같은 설명이 다른 스킬이나 reference에 중복되지 않았는가?
- 새 테스트가 이번에 옮긴 주 경로 하나를 검증하는가?
- 현재 작업과 무관한 제품 코드나 생성물이 diff에 들어오지 않았는가?

## 전환과 Pi 정리

스킬 하나가 완료 조건을 만족하면 그 기능을 하나의 단위로 전환한다. Pi 도구를 호출하는 fallback이나 양쪽 결과 비교 계층은 만들지 않는다.

Pi 정리는 이 저장소 작업과 분리한다.

1. 대응 스킬과 집중 테스트가 통과한다.
2. Codex, Claude, Amp 중 실제 사용하는 환경에서 스킬 발견과 기본 실행을 확인한다.
3. Pi 저장소에서 대응 도구 등록, 구현, 테스트, 문서를 함께 제거하는 별도 계획을 세운다.
4. Pi의 도구 이름을 유지하기 위한 wrapper는 남기지 않는다.

## 최종 산출물

필수 산출물은 다음과 같다.

- 이름과 책임을 정리한 `seed-create-component`
- 신규 `seed-api-parity`
- 이름과 책임을 정리한 `seed-write-lynx-component-docs`
- 이름과 책임을 정리한 `seed-changeset`
- 신규 `seed-change-plan`
- 신규 `seed-submit-change`
- 현재 기준 구현으로 유지·보완된 `seed-component-map`
- `seed-*`로 이름을 바꾼 나머지 저장소 스킬

`seed-token-analysis`, `seed-package-map`, `seed-figma-target-map`은 반복 수요가 확인될 때 추가한다. 만들지 않았다면 미완료가 아니라 의도적인 보류로 기록한다.

작업 완료 보고에는 수정한 스킬, 실행한 집중 테스트, 공통 검증 결과, 선택한 기준 브랜치와 PR base, 남은 환경 차단, Pi에서 후속 제거할 도구 목록만 남긴다.
