# 컴포넌트 작업 완료 체크리스트

## Phase 0 Pre: 요구사항 Brainstorming

- [ ] Purpose(왜/누가/사용 사례) 사용자와 합의?
- [ ] 기존과의 관계(신규/확장/대체) + 유사 컴포넌트 매트릭스 합의?
- [ ] 엣지케이스 시나리오(상태/제어/키보드/스크린리더/모바일/폼/RTL/스케일) 합의?
- [ ] 토큰 의존성(신규/기존) 합의?
- [ ] 외부 레퍼런스 우선순위 합의?
- [ ] 합의 요약 메모 또는 PR description 초안 작성?
- [ ] **사용자가 "이대로 진행" 명시 컨펌? (게이트 0Pre→0)**

## Phase 0: 아키텍처 결정

- [ ] Target platform 확정? (react / lynx / cross-platform)
- [ ] 컴포넌트 카테고리 확정? (A/B/C/D/E)
- [ ] 패턴 참조 컴포넌트 지정?
- [ ] 의존성 API 안정성 확인? (불안정 시 구현 중단)
- [ ] 외부 라이브러리 인터페이스 조사? (카테고리 C/D 필수, A/B/E 최소 prop naming)
- [ ] ARIA APG 패턴 확인? (카테고리 C/D)
- [ ] Lynx 작업이면 `lynx-react-headless` / `lynx-react` / `lynx-css` 책임 분리 결정?
- [ ] 새 `packages/lynx-react-headless/<component>` 패키지가 필요하면 사용자 확인?
- [ ] **사용자에게 Phase 0 결과 요약 보고 + 컨펌? (게이트 0→1)**

## Phase 1: 구현 확인

- [ ] Rootage 정의가 완전한가?
- [ ] `bun generate:all` 실행했는가?
- [ ] Recipe가 target preset entry에 export 되었는가?
- [ ] Styled UI 컴포넌트가 빌드되는가? (`bun packages:build`)
- [ ] 문서가 실제 API와 일치하는가?
- [ ] 예제가 동작하는가?
- [ ] React 작업이면 Storybook 스토리가 `references/storybook.md`의 CSF Next 패턴을 따르고 테마별로 정상인가?
- [ ] Lynx 작업이면 `examples/lynx-spa` page/catalog가 정상인가?
- [ ] generated registry output이 최신인가? (`docs/public/__registry__/` 확인)
- [ ] vendored snippet consumer가 있으면 함께 동기화했는가? (React: `examples/stackflow-spa/src/seed-design/ui/`, Lynx: `examples/lynx-spa/src/seed-design/ui/`)
- [ ] 패키지별 `typecheck` 스크립트가 있으면 선택적으로 실행했는가?
- [ ] **자동 검증 게이트 통과? (게이트 1→2)**
  - `bun generate:all` ✅
  - `bun test:all` ✅
  - `bun packages:build` ✅
  - `bun docs:test` ✅

이 명령 목록이 일반 컴포넌트 작업의 최종 자동 검증 기준이다. 단계별 문서에 같은 목록을 복사하지 않는다. 수정한 패키지의 `AGENTS.md`가 더 좁은 집중 명령을 지정하면 이 목록 전에 실행한다.

## Phase 2: 검증 (모든 카테고리 필수)

- [ ] React: Storybook 4종 테마/스케일 확인? (Light, Dark, FontScaling ExtraSmall, ExtraExtraExtraLarge)
- [ ] React: custom render가 meta component를 사용한다면 render context의 `component`를 전달했는가? wrapper/동적 component 예외는 보존했는가?
- [ ] React: `withChromaticParameters` 적용 범위가 기존 시각 테스트 정책을 넓히거나 줄이지 않는가?
- [ ] React: docs typecheck와 `bun storybook:build`가 통과하는가?
- [ ] Lynx: `seed-verify-lynx-example`로 entry, manifest, WebLynx/native bundle과 실제 세션 근거 확인?
- [ ] docs 사이트의 컴포넌트 페이지 렌더링 확인?
- [ ] React: **`examples/stackflow-spa`의 유사 Activity 확인 (없으면 신설 검토)** — snippet 레이어 유무와 무관하게 실 사용 환경 검증
- [ ] Lynx: **`examples/lynx-spa`의 유사 page와 catalog 등록 확인 (없으면 신설 검토)**. vendored source를 쓰는 경우 동기화 상태도 확인
- [ ] Visual Test 결과 사용자에게 보고 + 컨펌? (게이트 2→완료)
- [ ] `seed-changeset` 스킬로 changeset 생성?

## 패턴 준수 확인

- [ ] 패턴 참조 컴포넌트의 파일 구조를 따랐는가?
- [ ] Focus ring 적용? (인터랙티브 컴포넌트 → createFocusRingStyles)
- [ ] 키보드 인터랙션 구현? (카테고리 C/D)
- [ ] Mode API가 binary이면 boolean을 우선했고, enum이 필요하면 제3상태/대등한 값의 근거를 남겼는가?
- [ ] 특정 mode에서만 유효한 prop을 타입 union, 문서, 테스트로 차단했는가?
- [ ] 숨겨진 native input 패턴 적용? (form control인 경우)
- [ ] 애니메이션: contentInner 분리 패턴 사용? (expand/collapse인 경우)
- [ ] 폼 통합: TextField canonical 패턴 준수? (Field 통합인 경우)
- [ ] Snippet API: action 노출, state setter 숨김?
- [ ] Snippet naming: convenience wrapper는 `Component`, low-level composition wrapper만 `ComponentRoot`를 사용했는가?
- [ ] Hook props와 component props를 중복 선언하지 않고 `Use*Props`를 재사용했는가?
- [ ] Context `stateProps`를 중복 helper로 다시 만들지 않고 headless context를 재사용했는가?
- [ ] Namespace 파일: compound이면 있고, simple이면 없는지?
- [ ] Lynx: native `<view>` / `<text>`를 같은 컴포넌트 파일 안의 literal JSX로 작성했는가?
- [ ] Lynx: `children`을 native props와 분리하고 ref null guard를 적용했는가?
- [ ] Lynx: `@seed-design/lynx-css/recipes/*`를 import하고 Web `@seed-design/css`를 섞지 않았는가?
- [ ] Lynx: headless 패키지가 자동 state class나 recipe 책임을 갖지 않는가?
- [ ] Lynx: 웹 대비 미지원 기능을 타입/JSDoc/docs에 함께 반영했는가?
- [ ] Changeset 생성? (`seed-changeset` 스킬 참조)

## 흔한 실수

### 잘못된 순서

반드시 Platform Gate → Rootage → generate → Recipe → Styled UI → Docs/Examples → Test 순서를 따른다. Styled UI를 먼저 작성하면 CSS 변수나 recipe 타입이 없어서 스타일이 깨진다.

### Recipe export 누락

Recipe 작성 후 target preset entry에 export를 추가해야 한다. React는 `packages/qvism-preset/src/recipes/index.ts`, Lynx는 `packages/lynx-qvism-preset/src/recipes.ts` 또는 해당 entry를 확인한다. 누락하면 컴포넌트에서 import가 실패한다.

### 테스트 생략

React 구현은 Agent Browser로 Storybook과 문서 화면을 확인한다. Lynx 구현은 `seed-verify-lynx-example`을 사용한다. 실행 환경을 확인하지 않으면 다크 모드, 폰트 스케일 또는 native 런타임 차이를 놓칠 수 있다.

### Recipe-React 불일치

Recipe 타입을 변경하거나 슬롯을 추가한 후에는 반드시 `bun generate:all`을 먼저 실행한 뒤 Styled UI 코드를 수정한다. React는 `packages/qvism-preset/AGENTS.md`와 `packages/css/AGENTS.md`, Lynx는 `packages/lynx-qvism-preset/AGENTS.md`와 `packages/lynx-css/AGENTS.md`를 참조.

### React 컴포넌트 패턴 위반

variant props 수동 destructuring, 잘못된 import 경로, style prop 직접 사용 등의 금지 패턴은 `packages/react/AGENTS.md`에 명시되어 있다. 구현 전 반드시 확인한다.

### Lynx 컴포넌트 패턴 위반

native tag runtime 변수화, null ref 전달, `children`이 포함된 native props spread, Web CSS/DOM/form/focus API 사용 같은 금지 패턴은 `packages/lynx-react/AGENTS.md`와 `references/lynx-patterns.md`에 명시되어 있다. 구현 전 반드시 확인한다.

## 생성 파일 (수정 금지)

| 패턴 | 소스 |
|------|------|
| `packages/css/recipes/*` | rootage |
| `packages/css/vars/component/*` | rootage |
| `packages/qvism-preset/src/vars/component/*` | rootage |
| `packages/lynx-css/recipes/*` | rootage/lynx-qvism |
| `packages/lynx-css/vars/component/*` | rootage |
| `packages/lynx-qvism-preset/src/vars/component/*` | rootage |
| `packages/rootage/components/schema.json` | rootage |
| `docs/public/__registry__/**` | docs registry script |

**수정 방법**: 소스 파일 수정 후 `bun generate:all` 실행
