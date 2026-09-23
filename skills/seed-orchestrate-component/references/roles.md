# 역할 경계

조율자는 이번 작업에 필요한 역할만 고른다. 아래 경로는 기본 책임의 예시다. 실제 쓰기 범위는 현재 파일을 확인해 한 담당에게만 배정한다. 역할을 합쳐도 그 역할의 책임은 그대로 진다. 각 담당은 자기 역할 절과 위임받은 기술 reference만 읽는다.

## 조율자

- 사용자 요구, 원래 참조 화면·행동의 원천, 대상 플랫폼·소비 경로, 관찰 가능한 승인 조건을 유지한다.
- 변경 파일 소유자와 공동 계약의 생산자·소비자를 정한다. 런타임 상태, 생성·빌드 실행, 검증 종류별 실행자, 공유 자원 조작 소유자도 배정한다.
- 검증 실행자가 반환한 독립 판정·증거를 승인 조건과 대조해 최종 승인한다. 검증을 직접 직렬로 모두 실행하지 않고, 검증 종류마다 작업자를 따로 만들지도 않는다.
- 관련 담당이 근거를 교환한 뒤에도 남은 쟁점을 정리한다. 승인 범위를 바꾸는 선택만 사용자에게 묻는다.
- 결정, 변경 경로, 시나리오별 기대·실제 결과와 실행 증거를 회수한다. 증거가 부족하거나 충돌하면 원천과 결과를 직접 확인하거나 재검증을 배정한다.
- 새 요구사항이나 계약 변경이 생기면 영향받는 담당에게 전달하고, 다시 확인할 기존 검증 항목을 지정한다.

## Rootage 담당

- `packages/rootage/components/*.yaml` 등 디자인 정의, 토큰 어휘, 상태·크기별 값을 소유한다. 기존 토큰만 재사용하면 이 담당을 두지 않는다.
- Recipe 담당과 정의 이름, 변수 경로, 값의 의미를 합의한다. React·Lynx가 같은 값을 쓰는지와 의도적인 차이를 구분한다.
- 생성 변수·CSS를 직접 고치지 않는다 → YAML 원천을 고치고 루트 `AGENTS.md`「생성」의 명령을 실행한다.
- 런타임 context, 이벤트, 아이콘 렌더링 소유권은 Rootage 책임으로 가져오지 않는다 → 플랫폼 구현 담당에게 넘긴다.
- 인계: 원천 변경, 사용할 정의·변수, 필요한 생성 단계, 영향받는 Recipe.
- 기술 지침: [`seed-component`의 Rootage 단계](../../seed-component/references/implementation-steps.md#step-2-definition-rootage)와 대상 패키지 `AGENTS.md`.

## Recipe 담당

- `packages/qvism-preset/src/recipes/`와 `packages/lynx-qvism-preset/src/recipes/` 중 변경하는 플랫폼의 원천만 소유한다. 작업량이 충분하면 플랫폼별로 나눈다.
- Rootage 값을 스타일로 연결하고 slot·variant·크기·색상·전환 스타일을 구현한다. 등록 entry의 소유자는 통합 담당과 정한다.
- 플랫폼·통합 담당에게 실제로 필요한 요소와 className 적용 위치를 확인한다. CSS가 생성됐다고 해서 그 slot이 렌더링된다고 보지 않는다.
- 모션은 플랫폼 담당과 준비·표시·닫힘·제거 시점과 스타일 전환 방식을 합의한다. mount 수명은 CSS로 해결하지 않고 플랫폼 구현에 맡긴다.
- 인계: slot·variant와 적용 요소의 대응, 사용한 토큰, 생성 대상, 확인할 시각 결과.
- 기술 지침: [`Recipe 패턴`](../../seed-component/references/recipe-patterns.md). Lynx 스타일은 [`Lynx 패턴`](../../seed-component/references/lynx-patterns.md)과 Lynx CSS 지원 확인 Skill(`lynx-check-css-support`)을 함께 본다.

## 플랫폼 구현 담당

- 변경하는 플랫폼의 상태·이벤트·접근성·hook/context·실제 요소를 소유한다. React는 `packages/react-headless/`와 `packages/react/`, Lynx는 `packages/lynx-react-headless/`와 `packages/lynx-react/`의 기존 책임 경계를 따른다.
- 같은 prop 이름이 같은 렌더링 책임이라고 가정하지 않는다. prop과 명시적 slot의 관계, 필수 provider 범위, controlled 상태와 표시 수명을 소비자에게 전달한다.
- Recipe 담당과 slot·상태·모션 계약을, 통합 담당과 실제 공개 조합을 확인한다. 같은 파일의 hook과 UI를 여러 작성자가 동시에 고치지 않는다 → 한 담당에게 묶어 배정한다.
- [참조 동작 추적과 기본 장면](../../seed-component/references/implementation-steps.md#참조-동작-추적과-기본-장면)에 따라 실제 행동을 만드는 hook·측정·스타일 적용 경로를 찾아 대상 플랫폼 책임과 연결한다. 공개 JSX나 수식이 있다는 것만으로 포팅 완료를 선언하지 않는다.
- 동작 변경에 필요한 기존 테스트와 회귀 방어는 이 담당이 고친다. 새 테스트 체계를 만들거나 검증자의 기대 결과를 바꾸지 않는다.
- 인계: 행동별 원천·대상 책임, 공개 API·상태 전이·slot 구조, 의도적인 플랫폼 차이, 영향받는 소비처.
- 기술 지침: 플랫폼에 맞는 [`React 패턴`](../../seed-component/references/react-patterns.md) 또는 [`Lynx 패턴`](../../seed-component/references/lynx-patterns.md). Lynx는 변경 내용에 맞는 API·TypeScript·ReactLynx Skill만 추가한다.

## 소비 경로 통합 담당

- package entry·Registry 등록·wrapper·vendored 소비처 연결을 소유한다. export 파일의 쓰기 범위는 플랫폼 담당과 먼저 나눈다.
- Registry를 실행 코드로 검토한다: 필수 slot 누락, prop과 slot의 중복 렌더링, provider 밖 consumer, 실제 import 경로.
- 기본 장면과 최종 통합의 안정된 변경본에서 필요한 생성·package build·Registry·예제 bundle을 의존 순서대로 갱신한다. 명령은 현재 package script와 기존 검증 지침에서 고른다.
- 예제 빌드가 package source를 다시 빌드하는지, 기존 `lib`만 소비하는지 확인한다. 오래된 package 출력으로 최신 소스를 검증하지 않는다 → 필요한 package build를 먼저 실행한다.
- 인계: 변경본 식별 정보, 수행한 생성·빌드, 시나리오 entry와 manifest·bundle 경로. 서버·기기 실행은 지정된 검증 담당에게 넘긴다.
- 기술 지침: [`Registry·소비처 구현 단계`](../../seed-component/references/implementation-steps.md#step-5-registry-ui-snippet-레이어), [`검증 체크리스트`](../../seed-component/references/verification-checklist.md).

## 문서·예제 담당

- MDX와 실행 예제의 사용자 시나리오를 소유한다. Registry source는 통합 담당 범위이며, 필요하면 두 역할을 한 명에게 배정한다.
- 지원하는 기능은 React 대응과 asset·frame·초기 상태·입력·전이·최종 결과를 비교한다. 제목이나 JSX가 비슷하다는 것만으로 동등하다고 판단하지 않는다.
- 확정한 package 또는 Registry 경로를 소비한다. 문서용 provider·아이콘·slot 우회로 실제 API 결함을 감추지 않는다 → 결함은 원천 담당에게 돌려보낸다.
- 구현 전에는 필요한 조합과 기대 결과를 제시한다. 기본 장면 검증 결과를 받은 뒤 의존하는 변형 예제를 넓히고, 전체 검증 결과로 설명과 제한을 확정한다.
- 인계: 시나리오별 참조·기대 결과, 문서 URL·예제 ID, 실제 소비 경로, 미지원 설명. Lynx native는 SPA 예제 ID, query를 포함한 bundle URL, 변경본과 환경 근거를 더한다.
- 기술 지침: Lynx는 [`seed-component`의 Lynx 문서 분기](../../seed-component/SKILL.md), React는 [`문서 구현 단계`](../../seed-component/references/implementation-steps.md#step-8-documentation).

## 검증 실행 담당

- 구현자의 요약 대신 원래 요구사항·참조 화면·시나리오·승인 조건을 받아 실제 소비 결과와 대조한다. 여러 레이어의 동작 변경에서는 작성자와 다른 담당으로 배정하고 기본 장면부터 검증한다.
- 구현 전에 필수 환경과 검증 수단을 확인한다. 실행 파일 하나를 찾지 못했다고 런타임 전체가 없다고 단정하지 않고 해당 도구의 사용법과 연결 경로를 확인한다.
- 통합된 변경본에서 생성물 연결, 실제 요소·스타일, 입력·중간·최종 상태, 오류를 확인한다. 모션은 정지한 끝점만으로 통과시키지 않는다.
- 병렬 실행 조건, 선행 입력, Lynx native 기본 경로, 공유 자원 소유는 [검증 분담과 자원](collaboration.md#검증-분담과-자원)을 따른다.
- 실패는 재현 단계·기대/실제 결과·증거·실패 원천·영향 범위와 함께 원천 담당에게 돌려보낸다. 통과시키려고 소스·테스트·기대 결과를 고치지 않는다. 후속 수정 뒤에는 실패한 검사와 영향받는 검사만 다시 실행한다.
- 인계 형식은 [검증 분담과 자원](collaboration.md#검증-분담과-자원)의 한 줄 형식이다. 기술 지침: [`검증 체크리스트`](../../seed-component/references/verification-checklist.md), Lynx는 [`seed-verify-lynx-component`](../../seed-verify-lynx-component/SKILL.md).

## 조건부 전문 검토

성능, 복잡한 모션, 접근성처럼 별도 조사로 이번 요청의 불확실성을 줄일 수 있을 때만 전문가를 추가한다. 전문가는 측정·비교·설계 검토를 맡고, 파일 수정 책임은 기존 소유자에게 남는다.

- 성능 담당은 목표 기기와 문제 시나리오를 측정하고 병목 근거를 반환한다.
- `scroll-view`를 `list`로 바꾸는 식의 제안은 플랫폼 담당과 항목 등록·선택값 해석·가상화·레이아웃 계약을 확인한 뒤에 채택한다.
- 정적 비용 감소나 다른 플랫폼의 기능 통과를 목표 기기의 성능 개선으로 보고하지 않는다 → 목표 기기에서 측정한 값만 성능 결과로 보고한다.
