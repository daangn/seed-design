# Agent Learnings

에이전트가 실수에서 얻은 교훈을 쌓는 외부 메모리다. 읽기·갱신·커밋 규칙과 항목 형식은 루트 `AGENTS.md`의 학습 기록 섹션에 있다.

## 새 worktree는 설치 상태부터 확인한다

### Mistake Made
- Description: 새 worktree에서 `bun install`이 끝나지 않은 상태(루트 `node_modules/.bin` 없음)를 확인하지 않고 테스트·빌드를 여러 작업자에게 배정했다. 루트 `bun install`도 `tools/extract-api-surface`의 `prepare`(`skills-npm`)가 bin 링크 전에 실행돼 exit 127로 중단됐다.
- Impact: `vitest: command not found`, `ERR_MODULE_NOT_FOUND vitest`, toggle·image 빌드의 TS7006이 코드 문제처럼 보였고, 작업자가 원인 조사와 재실행에 시간을 썼다.

### Patterns to Avoid
- Pattern: 설치 여부를 확인하지 않고 검증 명령부터 실행하거나 배정하는 것. 설치 실패를 패키지 코드 오류로 해석하는 것.
- Risk: 환경 문제를 코드 결함으로 오판하고, 병렬 작업자가 같은 실패를 각자 조사한다.

### Better Approaches
- Recommendation: 작업을 배정하기 전에 조율자가 설치 상태를 한 번 확인하고 고친다. 새 workspace 패키지나 의존성을 추가한 뒤에도 조율자만 `bun install`을 실행한다.
- Solutions: `ls node_modules/.bin | wc -l`이 0이면 `bun install --ignore-scripts && bun install`을 실행한다(첫 실행이 `skills-npm` bin을 만들어 두 번째 실행의 `prepare`가 통과한다). 확인: `cd packages/lynx-react && bun run test -- src/components/Accordion/Accordion.test.tsx`.

## 기준 결과는 작업 트리와 분리해 고정한다

### Mistake Made
- Description: 변경 전 기기 기준을 작업 중인 worktree의 lynx-spa dev server로 수집하는 동안, 다른 작업자가 `docs/examples/lynx/accordion/headless.tsx`를 추가했다. SPA catalog가 새 예제를 즉시 포함했고, 아직 설치·빌드되지 않은 패키지 import 때문에 dev server가 `Can't resolve`로 깨졌다.
- Impact: 기준 장면이 `예제를 불러오지 못했습니다.`로 바뀌었다. 격리된 HEAD checkout을 만들어 production build로 다시 수집해야 했다.

### Patterns to Avoid
- Pattern: 기준 수집과 `docs/examples/lynx/**`·package 원천 수정을 같은 worktree에서 동시에 진행하는 것.
- Risk: catalog 자동 수집과 watch 빌드 때문에 기준 결과에 변경본이 섞이거나 기준 장면이 깨진다.

### Better Approaches
- Recommendation: 회귀 기준은 편집 작업과 분리된 입력으로 만든다. static 기준은 먼저 수집해 산출물로 고정하고, 기기 기준은 HEAD 격리본으로 만든다.
- Solutions: `git worktree add --detach <local 경로> <base-sha>` → 그 안에서 `bun install`과 필요한 build → production bundle을 `local://baseline/`에 복사한다. 끝나면 `git worktree remove`. 이후 비교는 현재 트리를 같은 명령·env로 빌드해 수행한다.

## iPhone 검증 bundle은 절대 LAN ASSET_PREFIX로 빌드한다

### Mistake Made
- Description: lynx-spa의 portless dev URL(`*.ette.test`)과 기본 production build(asset prefix `/`)를 iPhone PlayLynx에서 열었다.
- Impact: main bundle은 로드됐지만 lazy bundle 요청이 실패해 문서 예제 장면이 열리지 않았고, 서버 방식을 다시 정해야 했다.

### Patterns to Avoid
- Pattern: 실기기 lazy 예제 검증에 `.test` 도메인 dev server나 상대 asset prefix build를 쓰는 것.
- Risk: iOS 기기는 `.test` 호스트와 schema 없는 `/lazy-bundle/...` 경로를 불러오지 못한다. main bundle 로드 성공만 보고 환경이 정상이라고 오판한다.

### Better Approaches
- Recommendation: 실기기 native 검증과 전후 비교는 같은 길이의 LAN origin을 절대 prefix로 넣은 production build로 한다.
- Solutions: `ASSET_PREFIX=http://<LAN IP>:<4자리 port>/ bun --filter lynx-spa build` → hub process로 `examples/lynx-spa/dist`를 같은 port에서 정적 서빙한다 → `http://<LAN IP>:<port>/main.lynx.bundle?example=lynx%2F<component>%2F<scenario>`. 기준과 변경본의 port 자릿수를 맞추면 bundle byte 비교에 prefix 차이가 섞이지 않는다.

## 새 worktree의 docs 검증은 선행 lib 빌드가 필요하다

### Mistake Made
- Description: 새 worktree에서 `bun docs:test`와 `bun docs:build`를 바로 실행했다.
- Impact: `@seed-design/react`, `@seed-design/rootage-core`, `@seed-design/stackflow` 모듈을 찾지 못해 실패했다. 변경과 무관한 실패였지만 재실행이 필요했다.

### Patterns to Avoid
- Pattern: 누락된 workspace `lib` 때문에 난 TS2307·module-resolution 실패를 docs 변경의 실패로 판정하는 것.
- Risk: 잘못된 실패 판정을 내리거나, 검증을 건너뛰고 미검증으로 남긴다.

### Better Approaches
- Recommendation: docs 검증 전에 필요한 lib를 빌드하고, 판정은 선행 빌드 후 재실행 결과로만 내린다.
- Solutions: `bun docs:test` 전 `bun utils:build && bun headless:build && bun --filter @seed-design/react build`. `bun docs:build` 전 `bun ecosystem:build && bun packages:build`.

## Headless 분리 리팩터링은 native tree 직렬화로 회귀를 막는다

### Mistake Made
- Description: Lynx Accordion을 headless hook으로 옮길 때 첫 구현에 네 가지 문제가 있었다.
  - hook이 매 렌더 새 객체를 반환했고, styled·headless 컴포넌트가 이를 `useMemo`로 다시 감쌌다.
  - styled Root에 variant 전용 Provider가 하나 늘었다.
  - `triggerProps`의 `bindtouch*`를 styled view에 펼치면 `useScaleFeedback`의 `main-thread:bindtouch*`와 이중으로 바인딩될 위험이 있었다.
  - headless Trigger가 disabled일 때 `main-thread:bindtap`을 막지 않았다.
- Impact: reactlynx-best-practices 리뷰가 잡기 전까지 성능 회귀(할당·Provider·context read 증가)와 disabled 동작 결함이 있었다. 두 차례 수정 작업이 필요했다.

### Patterns to Avoid
- Pattern: hook 결과를 소비처마다 `useMemo(() => api, [fields])`로 감싸는 것. 스타일 전용 값을 옮기려고 새 Provider를 추가하는 것. hook이 준 prop 객체 전체를 native view에 펼치는 것.
- Risk: 렌더마다 할당과 context 무효화가 늘고, 기존 native tree에 없던 이벤트 key가 추가된다. 테스트와 화면은 통과해도 성능이 회귀한다.

### Better Approaches
- Recommendation: hook이 memo된 객체를 반환하게 한다. styled 층은 기존 context 값을 `{ ...api, variantProps }`로 확장해 Provider 수를 유지한다. hook prop 중 기존에 native로 바인딩하지 않던 key는 분해해서 원래 경로로만 넘긴다. `main-thread:*` 핸들러의 disabled gate는 `packages/lynx-react-headless/toggle/src/Toggle.tsx`처럼 명시한다.
- Solutions:
  - 리팩터링 전 임시 테스트(`<Component>.parity.test.tsx`)로 공개 API만 import해 조합·상태별 element tree를 JSON으로 저장한다. 대상은 태그, 정렬된 className, inline style, 속성, 이벤트 핸들러 key 집합이다.
  - 변경 후 같은 테스트를 다시 실행해 `cmp`로 byte 동일성을 확인한다. 임시 파일은 typecheck를 깨뜨릴 수 있으므로 `bun test:lynx-react` 최종 실행 전에 삭제한다.
  - 기기 성능은 변경 전과 변경 후 bundle을 번갈아(B,A,B,A…) 5회 이상 Perfetto로 측정하고, 중앙값 차이를 변경 전 실행 간 편차와 비교한다.
