# 스킬 리뷰 프롬프트

`seed-create-component`를 수정한 뒤 아래 프롬프트로 라우팅을 검토한다. 각 답변이 `seed-component-map`으로 현재 상태를 확인하고, 필요한 스킬과 reference만 선택하는지 본다.

## 1. React 신규 컴포넌트

> SEED Design에 새 React 컴포넌트 `InlineNotice`를 추가하고 싶어. Badge와 Callout 중간 정도이고 docs registry snippet도 필요할 것 같아.

확인할 것:
- target platform을 `react`로 판별한다.
- `seed-component-map`의 `not-found`와 가까운 기존 컴포넌트를 근거로 삼는다.
- 공개 방식과 wrapper 가치를 확인한 뒤에만 `docs/registry/react/ui`를 계획한다.
- Lynx-only 제약을 React 작업에 적용하지 않는다.

## 2. Lynx stateful 컴포넌트

> Lynx에 Toggle 계열 컴포넌트를 추가해야 해. `checked/defaultChecked/onCheckedChange`가 필요하고 press 상태는 UI에만 반영하고 싶어.

확인할 것:
- target platform을 `lynx`로 판별한다.
- `seed-component-map`으로 기존 Toggle 계열과 공개 경로를 확인한다.
- stateful 로직은 기존 `packages/lynx-react` hook/context 또는 외부 primitive와 Styled UI의 책임을 나눠 설계한다.
- 자동 state class를 headless에 넣지 않고, `lynx-react`가 recipe variant/className을 조합한다.
- 현재 없는 Lynx headless 패키지를 기본으로 가정하지 않고, 새 패키지가 실제로 필요하면 구현 전에 사용자 확인을 요청한다.

## 3. Cross-platform 컴포넌트

> 같은 API로 React와 Lynx 양쪽에 `SegmentedControl`을 맞추고 싶어. 토큰은 공유하고 문서는 각각 만들자.

확인할 것:
- target platform을 `cross-platform`으로 판별한다.
- `seed-component-map` 다음에 `seed-api-parity`를 사용한다.
- shared Rootage/API 합의 후 React와 Lynx 구현/문서를 분리한다.
- 플랫폼 제약으로 의도한 차이와 보완할 누락을 나눠 기록한다.
- Lynx 문서는 `seed-write-lynx-component-docs`로 연결한다.

## 4. Storybook-only 리팩터링

> 기존 React 컴포넌트 story의 공통 variant mapping을 CSF Next로 정리하고 custom parameters 타입도 맞춰줘. 컴포넌트 구현은 바꾸지 마.

확인할 것:
- Storybook 짧은 경로로 진입하고 구조 결정 질문을 요구하지 않는다.
- [storybook.md](storybook.md)를 읽고 `preview.meta`, `meta.story`, `<Story>.extend`를 사용한다.
- meta component가 필요한 custom render는 두 번째 context의 `component`를 사용한다.
- wrapper·동적 component 예외와 기존 Chromatic 적용 범위를 보존한다.
- docs typecheck, Storybook Vite build, 저장소 검증을 안내한다.

## 5. 배포 준비

> 구현과 검증은 끝났어. changeset을 확인하고 적절한 base로 rebase한 뒤 PR을 올리고 싶어.

확인할 것:
- 공개 패키지가 바뀌면 `seed-changeset`으로 먼저 버전과 메시지를 확정한다.
- `seed-change-plan`으로 `origin/dev`, `origin/minor`, `origin/major` 중 base를 정한다.
- `seed-submit-change`가 같은 base를 rebase와 PR에 사용한다.
- 제출 권한과 원격 상태를 확인하기 전에는 push나 PR 생성을 시작하지 않는다.
