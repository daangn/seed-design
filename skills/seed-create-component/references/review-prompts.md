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

## 6. 기존 React 컴포넌트의 Lynx 포팅

> React Menu의 공개 사용법과 화면 동작을 Lynx로 옮겨줘. 작업은 단독으로 진행해.

확인할 것:
- 대상 플랫폼에만 구현이 없는 경우 전체 맵의 `not-found`를 요구하지 않는다.
- 공개 JSX와 API parity 결과에서 멈추지 않고 위치·상태를 소유한 hook과 적용 경로까지 추적한다.
- 아래 공간이 충분한 기본 장면에서 기준 요소와 메뉴의 간격·정렬·비중첩을 실제 공개 소비 경로로 검증한다. 화면 중앙 정렬을 통과 기준으로 삼지 않는다.
- 기본 장면 통과 후 의존하는 변형 예제를 확장하고, 나머지 요청 시나리오와 필수 환경까지 확인한다.
- 단독 작업이라는 이유로 참조 추적·실행 증거를 생략하거나 협업을 강제하지 않는다.

## 7. 협업 중 기본 장면 실패

> Orca 작업자가 구현 완료를 보고했고 API 상호 리뷰와 빌드도 통과했어. 그런데 실제 화면에서 메뉴가 버튼을 덮어. 나머지 예제도 만들고 완료해.

확인할 것:
- `worker_done`·`REVIEW_PASS`·빌드 성공과 사용자 결과 승인을 분리한다.
- 기본 장면 실패를 원천 담당에게 돌려보내고, 의존하는 예제 확장은 수정·재검증 통과 후 진행한다.
- 검증자는 구현자의 요약이 아닌 원래 참조와 승인 조건으로 판정한다.
- 독립적인 원천 조사·시나리오 정리는 진행하며, 전원 `ACK`나 상호 완료 대기를 요구하지 않는다.
- 환경이 차단되면 관련 항목을 차단 상태로 반환하고 완료를 주장하지 않는다. 조율자는 증거를 재확인할 수 있다.

## 8. 동작을 바꾸지 않는 문서 수정

> Lynx Menu 문서의 설명 오탈자만 고쳐줘. 예제와 컴포넌트 동작은 그대로 둬.

확인할 것:
- 문서 짧은 경로에서 해당 문구·링크·형식만 검토한다.
- 기본 장면 재실행, 전체 포팅 분석, 에이전트 위임을 요구하지 않는다.
- 수정 과정에서 실제 동작 문제가 발견되면 별도 범위로 구분하고 무관한 변경을 추가하지 않는다.

## 9. 안정된 변경본의 검증 병렬화

> 기본 장면을 확인하려고 전체 문서 빌드와 타입 분석 테스트를 함께 돌렸더니 기존 테스트가 시간 초과했어. 검증을 더 빨리 끝내고 싶어.

확인할 것:
- 기본 장면은 필요한 package·생성물과 대상 bundle로 먼저 확인하고 전체 문서 빌드를 필수 선행으로 두지 않는다.
- 안정된 입력에서 패키지·소비 연결·런타임 검사를 나누되 검사 종류마다 새 워커를 만들지 않는다.
- 생성물 소비 검사만 해당 생성 완료를 기다리며, 무관한 검사까지 대기시키지 않는다.
- 무거운 빌드·타입 분석의 동시 실행 수를 제한한다. 경합으로 인한 시간 초과를 테스트 timeout 증가로 숨기지 않는다.
- 조율자가 모든 검사를 직접 실행하지 않고 결과를 통합·승인한다. 실패 원천과 수정 영향이 있는 검사만 다시 실행하며 관련 최종 문서 검증은 유지한다.

## 10. 같은 호스트의 여러 session

> PlayLynx session ID 두 개가 있으니까 두 메뉴 시나리오를 동시에 열고 화면을 캡처해줘.

확인할 것:
- session ID만으로 호스트 프로세스·창·전역 overlay·캡처 자원이 분리됐다고 판단하지 않는다.
- 공유 자원은 한 조작 소유자가 순서대로 사용한다. 다음 장면 전에 자신이 연 메뉴·overlay를 닫고 상태 정리와 종료를 확인한다.
- 별도 호스트 인스턴스의 격리를 확인하면 병렬 실행할 수 있다. 무관한 패키지·연결 검사는 같은 호스트를 기다리지 않는다.
- 서버 생명주기 소유권과 변경 없는 출력의 동시 읽기를 구분하고, 기존 사용자 세션은 임의 종료하지 않는다.
- 변경본·시나리오·기대/실제·증거·실패 범위를 짧게 인계하며 서로 다른 변경본의 결과를 합쳐 완료로 보고하지 않는다.

## 11. OMP에서의 하네스 선택

> OMP에서 SEED 컴포넌트 협업 스킬로 작업해줘. Orca 앱도 실행 중이지만 별도 실행 방식은 지정하지 않았어.

확인할 것:
- 현재 하네스의 OMP 위임·메시징 도구를 선택한다. Orca 런타임의 준비 상태만으로 Orca 작업을 만들지 않는다.
- 매직 키워드 공지가 있으면 실제 주입된 계약을 따르고, 없어도 OMP 도구와 스킬 절차를 사용한다.
- 스킬명에 키워드 문자열이 포함됐다는 이유로 공지 발동을 주장하지 않는다.
- 사용자가 실행 방식으로 Orca를 명시하거나 이미 승인한 Orca 작업을 이어가는 경우에는 Orca 절차를 따른다. 단순 언급이나 일반적인 병렬 검증 요청은 Orca 선택이 아니다.
