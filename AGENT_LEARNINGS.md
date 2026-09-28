# Agent Learnings

에이전트가 실수에서 얻은 교훈을 쌓는 외부 메모리다. 읽기·갱신·커밋 규칙과 항목 형식은 루트 `AGENTS.md`의 학습 기록 섹션에 있다.

## 변경 안내는 소비자가 사용하는 공개 컴포넌트와 prop 경로로 쓴다

### Mistake Made
- Description: nested prop 제거 안내에서 Drawer와 BottomSheet만 언급한 뒤, 누락된 소비자를 확인하는 대신 "Drawer 기반 컴포넌트"라는 내부 구현 용어로 범위를 넓혔다.
- Impact: 소비자가 ResponsiveDialog와 ResponsiveSidePanel의 bottomSheetRootProps.nested도 정리해야 한다는 사실을 알 수 없었다.

### Patterns to Avoid
- Pattern: 내부 의존 패키지 이름이나 대표 컴포넌트만으로 영향 범위를 설명하는 것.
- Risk: 중첩 옵션으로 노출된 prop을 누락하거나, Pick으로 해당 prop을 제외한 컴포넌트까지 영향 대상으로 오해하게 한다.

### Better Approaches
- Recommendation: 소비 패키지의 공개 타입에서 직접 prop과 중첩 옵션의 노출 여부를 확인하고 실제 컴포넌트명과 prop 경로를 나열한다.
- Solutions: BottomSheet.Root의 nested, ResponsiveDialog.Root와 ResponsiveSidePanel.Root의 bottomSheetRootProps.nested처럼 적는다. 패키지마다 사용하는 API가 다르면 changeset을 분리하고 각 패키지의 공개 API만 설명한다. 각 CHANGELOG에서는 패키지명이나 "해당 패키지" 같은 문맥 전환이 필요 없어야 한다.

## 패키지와 설정 경로는 파일 목록으로 확인한다

### Mistake Made
- Description: React의 primitives 재수출을 별도 workspace로 가정하고 존재하지 않는 package.json을 읽었다. Drawer tsconfig의 상대 extends 경로도 기준 디렉터리를 잘못 계산했다.
- Impact: 불필요한 파일 조회가 실패했고 영향 패키지와 검증 설정 확인이 늦어졌다.

### Patterns to Avoid
- Pattern: export 이름으로 패키지 디렉터리를 추측하거나 상대 경로를 저장소 루트 기준으로 해석하는 것.
- Risk: 실제 배포 단위와 의존 관계를 잘못 판단하거나 유효한 TypeScript 설정을 놓친다.

### Better Approaches
- Recommendation: 파일 목록과 manifest에서 경로를 확인하고 상대 경로는 선언한 파일의 디렉터리에서 해석한다.
- Solutions: `git ls-files '*package.json' '*tsconfig*'`로 파일을 찾고 `git grep -l '"@seed-design/react-drawer"' -- '*/package.json'`으로 직접 소비 패키지를 확인한다.

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
  - 기존 테스트 때문에 전체 타입 검사가 실패하면 기준 브랜치의 원본을 compiler host에 공급해 진단을 비교한다. Drawer의 `useDrawer.test.tsx`에 있는 TS2683처럼 원래 있던 오류와 이번 변경의 오류를 구분하고, 배포된 선언의 공개 타입도 별도로 확인한다.

## 검증·추출 전에 설치 상태부터 맞춘다

### Mistake Made
- Description: 새 worktree에서 `bun install`이 끝나지 않은 상태(루트 `node_modules/.bin` 없음)를 확인하지 않고 테스트·빌드를 여러 작업자에게 배정했다. 루트 `bun install`도 `tools/extract-api-surface`의 `prepare`(`skills-npm`)가 bin 링크 전에 실행돼 exit 127로 중단됐다.
- Impact: `vitest: command not found`, `ERR_MODULE_NOT_FOUND vitest`, toggle·image 빌드의 TS7006이 코드 문제처럼 보였고, 작업자가 원인 조사와 재실행에 시간을 썼다.
- Description: 기존 checkout에서도 `dev`를 받은 뒤 설치를 갱신하지 않고 `extract-api-surface`를 실행했다. 새로 추가된 의존성(`@radix-ui/react-focus-scope`)이 `node_modules`에 없었다.
- Impact: 추출이 `unresolved import(s)`로 멈췄다. `bun install --frozen-lockfile --ignore-scripts` 후 재실행해 해결했다.

### Patterns to Avoid
- Pattern: 설치 여부를 확인하지 않고 검증·추출 명령부터 실행하거나 배정하는 것. pull·rebase 뒤 lockfile이 바뀌었는데 설치를 건너뛰는 것. 설치 실패를 패키지 코드 오류로 해석하는 것.
- Risk: 환경 문제를 코드 결함으로 오판하고, 병렬 작업자가 같은 실패를 각자 조사한다.

### Better Approaches
- Recommendation: 작업을 배정하기 전에 조율자가 설치 상태를 한 번 확인하고 고친다. 새 workspace 패키지나 의존성을 추가한 뒤에도 조율자만 `bun install`을 실행한다.
- Solutions: 첫 검증 전에 `bun install --frozen-lockfile --ignore-scripts`를 한 번 실행한다(변경이 없으면 1초 안에 끝난다). `ls node_modules/.bin | wc -l`이 0이면 조율자가 `bun install`을 실행한다. `9c4356857`(`fix(extract-api-surface): declare skills-npm where prepare runs it`) 이전 기준에서 `prepare`가 `skills-npm: command not found`로 멈추면 `bun install --ignore-scripts && bun install`로 우회한다. 확인: `cd packages/lynx-react && bun run test -- src/components/Accordion/Accordion.test.tsx`.

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

## 전체 검증 실패는 기준 브랜치에서 재현되는지부터 가른다

### Mistake Made
- Description: `bun test:all`이 `tools/rootage-cdn/src/release-workflow.test.ts` 1건으로 실패했다. `#2255`가 workflow 입력을 `publish-script`로 바꾸면서 테스트의 `publish: bun release` 기대값이 낡은 상태였다. 처음에는 두 파일의 `git diff`가 비어 있다는 것만으로 기존 실패라고 판정했다.
- Impact: `test:unit`에서 멈춰 뒤따르는 Lynx 검증이 실행되지 않았다. diff 비교는 다른 변경 파일이나 설치 상태를 거친 간접 영향을 배제하지 못해 리뷰에서 지적받았고, `origin/dev` worktree에서 다시 재현해 확정했다.

### Patterns to Avoid
- Pattern: 전체 검증의 실패를 곧바로 현재 변경의 회귀로 보거나, 반대로 확인 없이 무관하다고 보고하는 것.
- Risk: 기준 브랜치의 기존 실패를 고치느라 범위를 넓히거나, 실제 회귀를 놓친다.

### Better Approaches
- Recommendation: diff 비교로 후보만 좁히고, 기준 브랜치에서 같은 실패가 재현될 때만 기존 실패로 보고한다. 재현되지 않으면 현재 변경의 간접 영향으로 보고 조사한다. 어느 경우든 변경 경로의 검증 명령은 따로 실행해 결과를 보고한다.
- Solutions: `git diff --stat origin/dev -- <테스트 파일> <대상 파일>`이 비어 있으면 후보다 → `git worktree add --detach <scratch 경로> origin/dev` → 그 안에서 `bun install --frozen-lockfile --ignore-scripts`와 같은 `bun test <테스트 파일>`을 실행한다 → 같은 단언으로 실패할 때만 기존 실패로 적고, 끝나면 `git worktree remove`한다.

## Lynx 1.0 분리 선례는 작업 브랜치가 아니라 대상 기준 브랜치에서 찾는다

### Mistake Made
- Description: DES-2612(ActionButton) 계획 중 `origin/dev` 기반 worktree에서 `packages/lynx-react-headless/`만 보고 Headless 선례를 찾았다. DES-2611 Accordion 분리(#2270, `@seed-design/lynx-react-accordion`)는 `origin/minor`에만 있어 목록에 없었다.
- Impact: `git log --all`로 커밋을 찾기 전까지 선례 없이 패키지 구조·changeset·vite external을 설계할 뻔했고, 작업 브랜치의 기준이 선례와 다르다는 사실도 늦게 알았다.

### Patterns to Avoid
- Pattern: 현재 checkout의 파일 목록만으로 "아직 분리된 선례가 없다"거나 기준 브랜치가 맞다고 판단하는 것.
- Risk: 형제 티켓(DES-2608 하위)마다 다른 패키지 구조를 만들거나, 선례가 없는 기준에서 구현해 rebase 충돌과 중복 작업이 생긴다.

### Better Approaches
- Recommendation: Lynx 1.0 분리 티켓을 시작할 때 선례 커밋이 어느 원격 브랜치에 있는지 먼저 확인하고, 작업 브랜치 기준을 그 브랜치와 대조한다.
- Solutions: `git log --all --oneline -i --grep='<선례 컴포넌트>'` → `git branch -a --contains <sha>` → `git ls-tree -d --name-only origin/minor packages/lynx-react-headless/`. 선례 파일은 `git show origin/minor:<경로>`로 읽는다.
