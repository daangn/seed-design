# 역할 경계

조율자는 아래 역할 중 이번 작업에 필요한 것만 고른다. 경로는 기본 책임의 예시이며, 실제 쓰기 범위는 현재 파일을 확인해 한 담당에게만 배정한다. 역할을 합쳐도 책임을 생략하지 않는다. 각 담당은 자기 역할의 항목과 위임받은 기술 reference만 읽는다.

## 조율자

- 사용자 요구, 원래 참조 화면·행동의 원천, 대상 플랫폼·소비 경로와 관찰 가능한 승인 조건을 유지한다.
- 변경 파일의 소유자와 공동 계약의 생산자·소비자를 정한다. 런타임 상태와 생성·빌드 실행 책임도 배정한다.
- 관련 담당이 근거를 교환한 뒤에도 결정하지 못한 쟁점을 정리한다. 승인 범위를 바꾸는 선택만 사용자에게 묻는다.
- 결정, 변경 경로, 시나리오별 기대·실제 결과와 실행 증거를 회수한다. 중복 구현은 피하지만, 증거가 부족하거나 충돌하면 필요한 원천과 결과를 직접 확인한다.
- 새 요구사항이나 계약 변경이 생기면 영향받는 담당에게 전달하고 기존 검증 중 재확인이 필요한 항목을 지정한다.

## Rootage 담당

- `packages/rootage/components/*.yaml` 등 디자인 정의, 토큰 어휘와 상태·크기별 값을 소유한다. 기존 토큰만 재사용하면 별도 담당을 생략한다.
- Recipe 담당과 정의 이름, 변수 경로, 값의 의미를 합의한다. React·Lynx가 같은 값을 사용하는지와 의도적인 차이를 구분한다.
- 생성 변수나 CSS를 직접 수정하지 않는다. 런타임 context, 이벤트, 아이콘 렌더링 소유권을 Rootage의 책임으로 가져오지 않는다.
- 인계할 것은 원천 변경, 사용할 정의·변수, 필요한 생성 단계와 영향받는 Recipe다.
- 기술 지침은 [`seed-create-component`의 Rootage 단계](../../seed-create-component/references/implementation-steps.md#step-2-definition-rootage)와 대상 패키지의 규칙을 따른다.

## Recipe 담당

- `packages/qvism-preset/src/recipes/`와 `packages/lynx-qvism-preset/src/recipes/` 중 변경하는 플랫폼의 원천만 소유한다. 작업량이 충분하면 플랫폼별로 나눈다.
- Rootage 값을 스타일로 연결하고 slot·variant·크기·색상·전환 스타일을 구현한다. 등록 entry의 소유자도 통합 담당과 정한다.
- 플랫폼·통합 담당에게 실제로 필요한 요소와 className 적용 위치를 확인한다. CSS가 생성됐다는 사실만으로 해당 slot이 렌더링된다고 보지 않는다.
- 모션은 플랫폼 담당과 준비·표시·닫힘·제거 시점 및 스타일 전환 방식을 합의한다. CSS만으로 mount 수명을 해결하지 않는다.
- 인계할 것은 slot·variant와 적용 요소의 대응, 사용한 토큰, 생성 대상, 확인해야 할 시각 결과다.
- [`Recipe 패턴`](../../seed-create-component/references/recipe-patterns.md)을 사용한다. Lynx 스타일은 [`Lynx 패턴`](../../seed-create-component/references/lynx-patterns.md)과 필요한 Lynx CSS 지원 스킬을 함께 확인한다.

## 플랫폼 구현 담당

- 변경하는 플랫폼의 상태·이벤트·접근성·hook/context·실제 요소를 소유한다. React는 `packages/react-headless/`와 `packages/react/`, Lynx는 `packages/lynx-react/`의 기존 책임 경계를 따른다.
- 동일한 prop 이름이 동일한 렌더링 책임을 뜻한다고 가정하지 않는다. prop과 명시적 slot의 관계, 필수 provider 범위, controlled 상태와 표시 수명을 소비자에게 전달한다.
- Recipe 담당과 slot·상태·모션 계약을, 통합 담당과 실제 공개 조합을 확인한다. 같은 파일의 hook과 UI를 여러 작성자가 동시에 수정하지 않는다.
- [참조 동작 추적과 기본 장면](../../seed-create-component/references/implementation-steps.md#참조-동작-추적과-기본-장면)에 따라 실제 행동을 만드는 hook·측정·스타일 적용 경로를 확인하고 대상 플랫폼의 책임을 연결한다. 공개 JSX나 수식의 존재만으로 포팅 완료를 선언하지 않는다.
- 동작 변경에 필요한 기존 테스트와 회귀 방어는 원천 담당이 수정한다. 별도 테스트 체계를 추가하거나 검증자의 기대 결과를 변경하지 않는다.
- 인계할 것은 행동별 원천·대상 책임, 공개 API·상태 전이·slot 구조, 의도적인 플랫폼 차이와 영향받는 소비처다.
- 플랫폼에 맞는 [`React 패턴`](../../seed-create-component/references/react-patterns.md) 또는 [`Lynx 패턴`](../../seed-create-component/references/lynx-patterns.md)을 읽는다. Lynx 작업에서는 변경 내용에 맞는 API·TypeScript·ReactLynx 스킬만 추가한다.

## 소비 경로 통합 담당

- package entry·Registry 등록·wrapper·vendored 소비처의 연결을 소유한다. 플랫폼 담당과 export 파일의 쓰기 범위를 먼저 나눈다.
- Registry를 문구가 아니라 실행 코드로 다룬다. 필수 slot 누락, prop과 slot의 중복 렌더링, provider 밖 consumer, 실제 import 경로를 확인한다.
- 기본 장면과 최종 통합의 안정된 변경본에서 필요한 생성·package build·Registry·예제 bundle을 의존 순서대로 갱신한다. 명령은 현재 package script와 기존 검증 지침에서 고른다.
- 예제 빌드가 package source를 다시 빌드하는지, 기존 `lib`만 소비하는지 확인한다. 오래된 package 출력으로 최신 소스를 검증하지 않는다.
- 인계할 것은 변경본 식별 정보, 수행한 생성·빌드, 시나리오 entry와 manifest·bundle 경로다. 서버·기기 실행은 지정된 검증 담당에게 넘긴다.
- [`Registry·소비처 구현 단계`](../../seed-create-component/references/implementation-steps.md#step-5-registry-ui-snippet-레이어)와 [`검증 체크리스트`](../../seed-create-component/references/verification-checklist.md)를 사용한다.

## 문서·예제 담당

- MDX와 실행 예제의 사용자 시나리오를 소유한다. Registry source는 통합 담당의 범위이며 필요하면 두 역할을 한 명에게 배정한다.
- 지원하는 기능은 React 대응의 asset·frame·초기 상태·입력·전이·최종 결과를 비교한다. 같은 제목이나 비슷한 JSX만으로 동등하다고 판단하지 않는다.
- 확정한 package 또는 Registry 경로를 소비한다. 문서용 provider·아이콘·slot 우회로 실제 API 결함을 감추지 않는다.
- 구현 전에는 필요한 조합과 기대 결과를 제시한다. 기본 장면의 검증 결과를 받은 뒤 의존하는 변형 예제를 확장하고, 전체 검증 결과로 설명과 제한을 확정한다.
- 인계할 것은 시나리오별 참조·기대 결과, 문서 URL·예제 ID, 실제 소비 경로와 미지원 설명이다.
- Lynx는 [`seed-write-lynx-component-docs`](../../seed-write-lynx-component-docs/SKILL.md), React는 [`문서 구현 단계`](../../seed-create-component/references/implementation-steps.md#step-8-documentation)를 따른다.

## 검증 담당

- 구현자의 요약 대신 원래 요구사항·참조 화면·시나리오·승인 조건과 실제 소비 결과를 대조한다. 여러 레이어의 동작 변경에서는 작성자와 별도로 배정하고 기본 장면부터 검증한다.
- 구현 전에 필수 환경과 검증 수단을 확인한다. 실행 파일 하나의 미발견을 전체 런타임 부재로 단정하지 않고 해당 도구의 사용법과 연결 경로를 확인한다.
- 통합된 변경본의 생성물 연결, 실제 요소·스타일, 입력·중간·최종 상태, 오류를 확인한다. 모션은 정지 끝점만으로 통과시키지 않는다.
- 검증용 서버와 기기 session을 단독으로 조작하고 실행 대상·증거를 유지한다. 공유 원천을 수정 중일 때 최종 검증을 병행하지 않는다.
- 실패는 재현 단계·기대/실제 결과·수정 범위와 함께 원천 담당에게 전달한다. 통과를 위해 소스·테스트·기대 결과를 고치지 않는다.
- 인계할 것은 시나리오·환경별 판정과 증거, 남은 제한이다. [`검증 체크리스트`](../../seed-create-component/references/verification-checklist.md)와 Lynx의 [`seed-verify-lynx-component`](../../seed-verify-lynx-component/SKILL.md)를 따른다.

## 조건부 전문 검토

성능, 복잡한 모션, 접근성처럼 이번 요청의 불확실성을 별도 조사로 줄일 수 있을 때만 전문가를 추가한다. 측정·비교·설계 검토를 맡기고 기존 파일 소유자의 수정 책임은 유지한다.

성능 담당은 목표 기기와 문제 시나리오를 측정하고 병목 근거를 반환한다. `scroll-view`에서 `list`로 바꾸는 등의 제안은 플랫폼 담당과 항목 등록·선택값 해석·가상화·레이아웃 계약을 확인한다. 정적 비용 감소나 다른 플랫폼의 기능 통과를 목표 기기의 성능 개선으로 보고하지 않는다.
