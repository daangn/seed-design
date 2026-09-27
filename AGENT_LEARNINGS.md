# Agent Learnings

에이전트가 실수에서 얻은 교훈을 쌓는 외부 메모리다. 읽기·갱신·커밋 규칙과 항목 형식은 루트 `AGENTS.md`의 학습 기록 섹션에 있다.

## Testing Library bound query의 제네릭 지원을 가정하지 않는다

### Mistake Made
- Description: `render()`가 반환한 `getByTestId`에도 `getByTestId<HTMLDivElement>()`를 쓸 수 있다고 가정했다. 이 저장소의 bound query 타입은 타입 인자를 받지 않는다.
- Impact: 원래 matcher 타입 오류를 해결하지 못하고 TS2558을 추가했다. 런타임 테스트는 통과해 직접 타입 검사에서 발견했다.

### Patterns to Avoid
- Pattern: 라이브러리의 일반적인 사용법이나 런타임 테스트 통과만으로 타입 수정의 유효성을 판단하는 것.
- Risk: 원본 query와 `render()`에 바인딩된 query의 타입 차이를 놓쳐 빌드 오류가 남는다.

### Better Approaches
- Recommendation: 설치된 버전에서 실제 호출 지점의 타입을 확인하고 타입 수정은 직접 컴파일러로 검증한다.
- Solutions: `bun node_modules/typescript/bin/tsc --project packages/react/tsconfig.json --noEmit`을 실행한다. query의 타입 인자가 지원되지 않으면 반환 타입을 단언하지 말고 matcher의 비교 타입을 조정하거나 런타임 guard로 좁힌다.

## 새 worktree는 설치 상태부터 확인한다

### Mistake Made
- Description: 새 worktree에서 `bun install`이 끝나지 않은 상태(루트 `node_modules/.bin` 없음)를 확인하지 않고 테스트·빌드를 여러 작업자에게 배정했다. 루트 `bun install`도 `tools/extract-api-surface`의 `prepare`(`skills-npm`)가 bin 링크 전에 실행돼 exit 127로 중단됐다.
- Impact: `vitest: command not found`, `ERR_MODULE_NOT_FOUND vitest`, toggle·image 빌드의 TS7006이 코드 문제처럼 보였고, 작업자가 원인 조사와 재실행에 시간을 썼다.

### Patterns to Avoid
- Pattern: 설치 여부를 확인하지 않고 검증 명령부터 실행하거나 배정하는 것. 설치 실패를 패키지 코드 오류로 해석하는 것.
- Risk: 환경 문제를 코드 결함으로 오판하고, 병렬 작업자가 같은 실패를 각자 조사한다.

### Better Approaches
- Recommendation: 작업을 배정하기 전에 조율자가 설치 상태를 한 번 확인하고 고친다. 새 workspace 패키지나 의존성을 추가한 뒤에도 조율자만 `bun install`을 실행한다.
- Solutions: `ls node_modules/.bin | wc -l`이 0이면 조율자가 `bun install`을 실행한다. `9c4356857`(`fix(extract-api-surface): declare skills-npm where prepare runs it`) 이전 기준에서 `prepare`가 `skills-npm: command not found`로 멈추면 `bun install --ignore-scripts && bun install`로 우회한다. 확인: `cd packages/lynx-react && bun run test -- src/components/Accordion/Accordion.test.tsx`.

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

## 새 worktree의 테스트·타입 검사는 선행 lib 빌드가 필요하다

### Mistake Made
- Description: 새 worktree에서 `bun docs:test`와 `bun docs:build`를 바로 실행했다. headless 패키지의 `bun test`와 `tsc`도 `bun install` 직후 바로 실행했다. `bun ecosystem:build`·`bun headless:build`·`@seed-design/react` 빌드까지 마친 새 worktree에서 `examples/stackflow-spa`의 vite dev 서버를 띄웠다.
- Impact: `@seed-design/react`, `@seed-design/rootage-core`, `@seed-design/stackflow`, `@seed-design/react-primitive`, `@seed-design/react-dismissible-layer` 같은 workspace 모듈을 찾지 못해 실패했다. stackflow-spa dev 서버는 `Failed to resolve entry for package "@seed-design/vite-plugin"`으로 시작하지 못했다. 변경과 무관한 실패였지만 재실행이 필요했다.

### Patterns to Avoid
- Pattern: 누락된 workspace `lib` 때문에 난 TS2307·module-resolution 실패를 변경의 실패로 판정하는 것.
- Risk: 잘못된 실패 판정을 내리거나, 검증을 건너뛰고 미검증으로 남긴다.

### Better Approaches
- Recommendation: 새 worktree에서는 검증 전에 필요한 lib를 빌드하고, 판정은 선행 빌드 후 재실행 결과로만 내린다.
- Solutions: headless 테스트·`tsc` 전 `bun utils:build && bun headless:build`. `bun docs:test` 전 `bun utils:build && bun headless:build && bun --filter @seed-design/react build`. `bun docs:build` 전 `bun ecosystem:build && bun packages:build`. `examples/stackflow-spa` dev 서버·e2e 전 `bun --filter @seed-design/vite-plugin build && bun --filter @seed-design/stackflow build`를 추가로 실행한다. 둘 다 `ecosystem:build`·`headless:build`에 포함되지 않고, stackflow가 없으면 `AppScreen` 타입 오류 오버레이가 화면을 덮는다.

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


## 스크립트로 블록을 지울 때는 경계 토큰의 매칭 범위를 먼저 확인한다

### Mistake Made
- Description: `/\*\*\n((?: \*.*\n)*?) \*/\nconst X = ...` 형태의 Python 정규식으로 Menu·Select의 JSDoc과 정의를 한 번에 지웠다. 비탐욕 수량자도 매칭 시작점을 뒤로 당기지 못해, Select에서는 파일의 첫 `/**`부터 대상 JSDoc까지 사이에 있던 `SelectValue`·`SelectPlaceholder`·`SelectPositioner` 정의가 함께 지워졌다. 적용 전에 dry-run을 하지 않았다.
- Description: `AGENT_LEARNINGS.md`에서 항목 하나를 지우려고 Python `s.index('## ', start)`로 다음 항목의 시작을 찾았다. `## `가 `### Mistake Made` 안에서도 매칭되어 제목 두 줄만 지워지고 본문이 남았다.
- Impact: 정의 세 개가 사라지고 그 JSDoc들이 JSX 주석으로 옮겨졌다. `git diff`에서 발견해 파일을 되돌리고 Edit 도구로 다시 작업했다. Markdown 항목 삭제에서도 구조가 깨져 `git checkout`으로 되돌린 뒤 다시 작업했다.

### Patterns to Avoid
- Pattern: 여러 줄에 걸친 블록을 정규식으로 지우면서 파일에 바로 쓰는 것. 특히 `/**`처럼 파일에 여러 번 나오는 토큰을 시작점으로 잡거나, `## `처럼 더 긴 토큰(`### `)의 일부이기도 한 문자열을 경계로 잡는 것.
- Risk: 정규식 엔진은 가장 왼쪽 시작점에서 매칭을 확정하므로, 대상 블록 앞에 있는 무관한 코드까지 삼킨다. 파일마다 앞선 내용이 달라서 한 파일에서 맞았다고 다른 파일도 맞는 것은 아니다.

### Better Approaches
- Recommendation: 대상이 몇 개 안 되는 여러 줄 편집은 Edit 도구로 정확한 문자열을 치환한다. 스크립트가 꼭 필요하면 쓰기 전에 매칭 범위를 출력해 확인한다.
- Solutions: 시작점이 반복되는 토큰이면 `(?:(?!\*/).)*`처럼 블록 종료 토큰을 넘지 않게 제한한다. 적용 전에 `print(m.group(0))` 또는 `diff`로 매칭된 줄 수를 확인하고, 적용 후 `git diff --stat`으로 파일별 삭제 줄 수가 예상과 같은지 본다. Markdown 제목 경계는 `'\n## '`처럼 줄 시작을 포함하거나 다음 항목 제목 전체를 끝점으로 잡는다.

## 포커스 순서는 happy-dom 결과만으로 판정하지 않는다

### Mistake Made
- Description: Popover·HelpBubble이 바깥을 눌러 닫힐 때의 포커스 결과를 happy-dom과 `userEvent.click`으로 비교했다. 텍스트 필드를 누르면 포커스가 trigger에 남는다는 결과가 나왔지만, Chrome에서 실제 마우스 입력으로 확인하니 trigger를 약 10ms 거친 뒤 텍스트 필드로 이동했다.
- Description: `autoFocus={false}`인 HelpBubble에서 trigger 다음 Tab이 close button이 아니라 content에 멈추는 문제가 Chrome에서만 재현됐다. floating-ui가 open 첫 commit에서 content가 아직 `data-hidden`(`display: none`)일 때 tabbable을 검사해 container를 `tabindex="0"`으로 두었기 때문이다. happy-dom에서는 floating-ui의 tabbable `displayCheck`가 `'none'`이 되어 이 검사가 보이는 상태와 무관하게 통과한다.
- Description: 같은 조사에서 닫힌 content를 trigger의 `aria-controls`로 찾았다. 닫힌 trigger에는 `aria-controls`가 없어 content가 unmount됐다고 잘못 판단했다.
- Impact: 존재하지 않는 회귀를 보고할 뻔했고, 브라우저 재검증을 따로 해야 했다. 실제 버그는 단위 테스트로 재현되지 않아 원인 추적에 브라우저 계측이 필요했다.

### Patterns to Avoid
- Pattern: pointerdown에서 닫힘 → 포커스 복귀(microtask) → mousedown 기본 동작으로 포커스 이동처럼, 이벤트 사이 순서에 결과가 달린 시나리오를 happy-dom 테스트만으로 판정하는 것.
- Pattern: 요소가 보이는지(`display`, client rect)에 따라 tabbable·tabindex가 달라지는 동작을 happy-dom 통과만으로 정상이라고 판단하는 것.
- Risk: happy-dom의 `userEvent`는 mousedown 기본 포커스 이동과 포커스 불가 영역의 blur를 실제 브라우저와 다른 순서로 처리한다. 레이아웃이 없어서 floating-ui·tabbable의 가시성 검사도 꺼진다. 두 경우 모두 최종 포커스 위치가 브라우저와 다르게 나온다.

### Better Approaches
- Recommendation: 이벤트 순서와 가시성에 의존하지 않는 키보드·프로그래밍 방식 포커스(Tab, Escape, `focus()`)는 happy-dom으로 판정해도 된다. 포인터로 바깥을 누르는 시나리오와 열림 직후의 Tab 순서는 실제 브라우저에서 CDP 입력으로 확인한다.
- Solutions: stackflow-spa에 임시 activity를 만들고 `document`의 `focusin`을 시각과 함께 화면에 기록한다. chrome-devtools `click`·`press_key`(CDP 입력)로 조작한 뒤 `evaluate_script`로 `document.activeElement`와 기록을 읽는다. 속성이 바뀌는 순간의 DOM 상태가 필요하면 `navigate_page`의 `initScript`로 `Element.prototype.setAttribute`·`removeAttribute`를 감싸서 동기로 기록한다. content는 `aria-controls`가 아니라 class나 `data-*` 선택자로 찾는다. 자동 회귀 테스트가 필요하면 `examples/stackflow-spa/e2e/`의 Playwright로 작성한다.
