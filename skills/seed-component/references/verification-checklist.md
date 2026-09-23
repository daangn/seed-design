# 컴포넌트 작업 검증 체크리스트

이번에 바꾼 경로와 사용자 결과만 검증한다. 해당하지 않는 플랫폼이나 레이어의 테스트를 새로 만들지 않는다.

1. [변경 범위](#변경-범위)를 확정한다.
2. 렌더링·상호작용을 바꾸면 구현 전에 [관찰 가능한 결과 판정](#관찰-가능한-결과-판정) 기준을 적는다.
3. 변경본이 안정되면 [자동 검증](#자동-검증)을 실행한다.
4. 화면이 바뀌면 [화면 확인](#화면-확인)을 한다.
5. [구현 확인](#구현-확인)과 [배포 준비](#배포-준비)에서 바꾼 레이어 항목만 확인한다.

- 문서·Skill·Storybook 설정처럼 실행 동작이 없는 변경 → 내용·링크·형식 검토로 끝낸다.
- Storybook 파일만 바꿨다 → [storybook.md](storybook.md#검증)의 검증만 실행한다.

## 변경 범위

- [경로 조회](component-map.md) 결과와 실제 파일을 읽는다.
- 대상 플랫폼을 `react`, `lynx`, `cross-platform` 중 하나로, 배포 방식을 `package-only`, `snippet-only`, `package+snippet`, `docs-only` 중 하나로 정한다.
- React와 Lynx를 함께 다룬다 → [API 비교](api-parity.md)의 차이를 의도한 플랫폼 차이와 보완할 누락으로 나눈다.
- 참조가 있는 동작 변경 → [행동별 원천 추적](implementation-steps.md#행동별-원천-추적)으로 공개 컴포넌트 아래 실제 구현까지 확인한다.

## 관찰 가능한 결과 판정

렌더링·상호작용을 바꾸면 구현 전에 시나리오별 조건·입력·기대 결과·필수 환경을 정한다. [기본 장면 우선 검증](implementation-steps.md#기본-장면-우선-검증)과 최종 검증에 같은 기준을 쓰고, 국소 변경은 영향받는 시나리오만 확인한다.

### 통과 조건 쓰기

- `placement 구현`, `클릭 확인`, `preview 정상`처럼 작업 이름을 통과 조건으로 쓰지 않는다 → 위치·크기·선택 상태·표시 수명처럼 사용자가 관찰할 관계를 적는다.
- 참조와 대상의 viewport, host·frame, 기준 요소 위치, 내용, 초기 상태를 맞춘다. 의도한 차이는 이유를 남긴다.
- 예제 frame 중앙 정렬을 내부 컴포넌트 배치의 정답으로 쓰지 않는다 → 기준 요소와의 관계로 판정한다.
- 예: Menu의 기본 아래 배치는 아래 공간이 충분할 때 `menu.top ≈ trigger.bottom + gutter`, 가로 중심 일치, 버튼과 메뉴 본문 비중첩으로 확인한다. 좌표계·단위·허용 오차는 해당 환경의 측정 기준으로 정한다. 공간이 부족할 때의 배치와 높이 제한은 참조의 충돌 정책으로 따로 판정한다.

### 증거 모으기

- 입력 전, 표시 중간, 정착 후의 대상 화면을 본다. 전환이 있으면 시간이나 프레임을 식별할 수 있는 증거를 남긴다.
- 위치가 의심된다 → 같은 좌표계의 기준 요소·콘텐츠 rect와 적용 스타일을 함께 확인한다.
- 코드의 수식·조건문이나 정착 후 한 장만으로 중간 상태를 통과시키지 않는다 → 중간 상태 증거를 따로 남긴다.

### 판정과 인계

- 판정은 `통과`, `실패`, `환경 차단`, `미확인`으로 나눈다. 필수 항목 실패는 전체 실패, 필수 항목 차단·미확인은 전체 미완료다.
- 생성·타입·API 리뷰 통과나 작업자 종료를 결과 승인으로 쓰지 않는다 → 위 증거로 판정한다.
- 인계 형식: `변경본 식별자 → 실행 명령/시나리오 → 판정과 기대·실제 결과 → 증거 → 실패 원천·영향 범위`. 변경본 식별자에 실제 worktree·entry·번들 같은 실행 대상을 연결하고, 수신자가 화면·측정 증거를 열 수 있는 경로를 남긴다.
- 실패 원천을 아직 모른다 → 추측으로 확정하지 않고 미확정으로 적는다.
- 참조와 다른 결과를 발견했다 → 해당 원천을 고친 뒤 영향받은 항목을 다시 확인한다. 기대 결과를 구현에 맞춰 낮추거나 실제 실패를 미지원으로 재분류하지 않는다 → 범위를 바꿔야 하면 사용자 결정을 받는다.

## 자동 검증

경로별 테스트 명령은 루트 `AGENTS.md`「검증」, 생성 명령은 「생성」이 원천이다. 수정 경로의 `AGENTS.md`에 더 좁은 명령이 있으면 그것을 쓴다. 여기에는 그 밖의 검사만 둔다.

1. 동작을 바꿨다 → 수정한 패키지의 기존 집중 테스트를 실행한다.
2. Rootage·Recipe 원천을 바꿨다 → 「생성」의 해당 명령을 실행하고 예상한 산출물만 바뀌었는지 `git diff`로 본다.
3. 공개 패키지 코드를 바꿨다 → `bun packages:build`
4. Registry·공개 예제를 바꿨다 → `bun --filter @seed-design/docs typecheck`와 `bun docs:test`를 모두 실행한다(`bun docs:test`는 docs web 타입 검사를 포함하지 않는다). Registry를 바꿨으면 「생성」의 `docs/registry/` 명령도 생략하지 않는다.
5. 코드나 생성물을 바꿨다 → 마지막에 `git diff --check`와 `git status --short`로 범위를 확인한다.

- `bun test:all` → 여러 패키지에 걸친 변경을 마칠 때(루트 「검증」), 릴리스·제출 요청이 있을 때, 넓은 회귀 위험이 있을 때만 실행한다. 커밋 전이라는 이유만으로 반복하지 않는다.
- 번호는 검사 목록이지 직렬 순서가 아니다. 같은 입력을 편집하는 중에는 최종 검증을 시작하지 않는다. 안정된 변경본에서 패키지 타입·회귀, Registry·문서·예제 연결, 화면·상호작용 검사를 입력·자원 의존성에 따라 병렬로 돌리고, 생성물을 소비하는 검사만 해당 생성 완료를 기다린다.
- 실행 분담·호스트 격리·CPU·메모리 경합 → [검증 분담과 자원](../../seed-orchestrate-component/references/collaboration.md#검증-분담과-자원). 기존 실행 자원을 배정하는 기준이다. 검사 종류별 워커나 새 검증 체계를 만들지 않는다.
- 전체 docs 빌드나 정적 bundle 서빙 → MDX 페이지·host·코드 탭·QR·Web preview·docs pipeline 자체를 바꿨을 때만 해당 문서 surface 검증으로 추가한다.

## 화면 확인

렌더링이나 상호작용이 바뀌었으면 [visual-testing.md](visual-testing.md)의 확인 경로 중 바뀐 표면만 연다. Lynx는 추가로 다음을 확인한다.

- [배포 경로 확인](lynx-docs.md#배포-경로-확인)에서 확정한 배포 경로가 Registry, 문서, SPA 예제에서 일치한다.
- 기기나 실행 세션이 없다 → 확인하지 못한 범위를 적는다. 문서용 우회 구현으로 native 결과를 흉내 내지 않는다.

## 구현 확인

바꾼 레이어 항목만 확인한다.

- Rootage·Recipe 원천을 바꿨다 → 생성 결과가 최신이다.
- Styled UI의 공개 export와 타입이 구현과 일치한다. Recipe import가 대상 플랫폼과 맞다(`@seed-design/css/recipes/*` ↔ `@seed-design/lynx-css/recipes/*`).
- Registry를 제공한다 → 등록 정보, 생성 결과, vendored 소비처(`examples/stackflow-spa/src/seed-design/ui/`)가 동기화됐다.
- 문서와 예제가 확정한 package 또는 Registry 배포 경로를 그대로 쓴다. React 문서, Lynx 문서, 예제가 같은 시나리오를 지원하면 제목·순서·사용자 결과가 일치한다.
- Headless와 Styled UI가 상태와 스타일 책임을 중복 소유하지 않는다. 지원하지 않는 플랫폼 기능은 타입과 문서에서 같은 방식으로 제외했다.

플랫폼 계약:

- React의 키보드·ARIA 계약과 Lynx의 native 접근성·터치 계약을 같은 것으로 가정하지 않는다.
- Lynx → native 태그 literal JSX, `children` 분리, null ref 차단을 지켰다. 규칙: `packages/lynx-react/AGENTS.md`「런타임 불변식」, [lynx-patterns.md](lynx-patterns.md#native-jsx-제약)
- 등록·레이아웃 측정값에 의존하는 transition이 있다 → 동적 자식 추가를 포함해 필요한 값이 모두 준비될 때까지 관련 slot의 Recipe className으로 transition을 끈다. Lynx 패턴은 [lynx-patterns.md](lynx-patterns.md)「초기 레이아웃 전환 방지」

## 배포 준비

- 공개 패키지를 바꿨다 → [`seed-change`](../../seed-change/SKILL.md)의 changeset 분기로 버전 후보와 한국어 changeset을 확인한다.
- `seed-change`의 계획 분기로 영향 범위, 검증 순서, `origin/dev`·`origin/minor`·`origin/major` 중 PR base를 정한다.
- 제출을 요청받았다 → `seed-change`의 제출 분기가 같은 base로 rebase·commit·push·PR을 준비한다.
