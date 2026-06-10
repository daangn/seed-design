# Skill Review Prompts

`create-component` 스킬 자체를 수정한 뒤에는 full eval/benchmark 대신 아래 프롬프트로 문서 리뷰를 한다. 답변이 실제 구현을 시작하지 않고 올바른 계획/질문/게이트로 흐르는지 확인한다.

## 1. React 신규 컴포넌트

> SEED Design에 새 React 컴포넌트 `InlineNotice`를 추가하고 싶어. Badge와 Callout 중간 정도이고 docs registry snippet도 필요할 것 같아.

확인할 것:
- target platform을 `react`로 판별한다.
- 기존 React Phase 흐름과 `packages/react`, `packages/react-headless`, `docs/registry/react/ui` 경로를 사용한다.
- Lynx-only 제약을 React 작업에 적용하지 않는다.

## 2. Lynx stateful 컴포넌트

> Lynx에 Toggle 계열 컴포넌트를 추가해야 해. `checked/defaultChecked/onCheckedChange`가 필요하고 press 상태는 UI에만 반영하고 싶어.

확인할 것:
- target platform을 `lynx`로 판별한다.
- stateful 로직은 `packages/lynx-react-headless/*`와 `packages/lynx-react` 책임 분리로 설계한다.
- 자동 state class를 headless에 넣지 않고, `lynx-react`가 recipe variant/className을 조합한다.

## 3. Cross-platform 컴포넌트

> 같은 API로 React와 Lynx 양쪽에 `SegmentedControl`을 맞추고 싶어. 토큰은 공유하고 문서는 각각 만들자.

확인할 것:
- target platform을 `cross-platform`으로 판별한다.
- shared Rootage/API 합의 후 React와 Lynx 구현/문서를 분리한다.
- Lynx 미지원 기능은 타입과 `docs/content/lynx`에 별도 문서화하도록 안내한다.
