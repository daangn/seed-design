# Lynx Headless 구현과 추출

CSS-free Headless를 구현·추출하거나 Styled 어댑터의 Headless 소비 계약을 바꿀 때 사용한다. 단순 Recipe·문구·아이콘 변경, React Web Headless, Vanilla Lynx에는 적용하지 않는다. 아래 단계 중 변경한 계약과 관련된 항목만 수행한다.

레이어 책임과 CSS-free 의존성 기준은 [Lynx 책임 분리](lynx-patterns.md#책임-분리)를 따른다. 공개 API와 신규 패키지 필요성은 [아키텍처 결정](architecture-decisions.md#2-headless-레이어-결정)에서 정한다. 추출 자체를 API 재설계나 새 패키지 승인의 근거로 삼지 않는다.

## 1. 계약과 기준 동작 고정

관련 slot별로 상태 소유자, 입력, 소비자 콜백 순서, ref 대상, 접근성 override, 측정·숨김 책임을 정리한다. 기존 구현을 추출한다면 변경 전 revision과 공개 사용법을 기준으로 삼는다. 새 구현이면 요청한 사용자 결과와 참조 구현을 기준으로 삼는다.

Accordion의 참조 계약은 single/multiple, controlled parent가 변환한 값의 반영, root/item disabled, 상태 변경과 소비자 tap의 순서, 닫힌 Content 측정이다. 다른 컴포넌트에 이 목록 전체를 강제하지 않는다.

완료 기준은 이번에 보존하거나 추가할 계약마다 기대 결과와 관찰 방법이 정해진 것이다.

## 2. CSS 없이 기능 완성

기능 geometry와 표현 geometry의 구분은 [책임 분리](lynx-patterns.md#책임-분리)를 따른다. style prop의 존재만으로 Headless 위반이라 판단하지 않고, 소비자가 SEED CSS 없이 기능을 사용할 수 있는지 확인한다.

Accordion Content를 추출하는 경우에는 다음을 확인한다.

- 닫힌 상태에서도 내부를 측정하고, 외부 높이와 clipping으로 접힘을 유지한다.
- 열린 뒤 측정 높이를 반영하고 내용 변경에도 갱신한다.
- 공개 API가 string/object style을 모두 허용한다면 양쪽에서 필수 geometry와 소비자 style의 우선순위가 같다.
- 닫힌 내용의 접근성 숨김을 Headless에서 처리한다.

소비자가 측정·숨김을 다시 구현해야 하면 추출이 끝난 것이 아니다. 내부 className 연결점은 실제 어댑터가 필요한 slot에만 제공한다.

완료 기준은 Styled와 SEED CSS를 가져오지 않는 공개 패키지 consumer에서 해당 기능이 동작하는 것이다.

## 3. 스레드별 이벤트 합성

Background 핸들러만 있는 경로와 소비자 Main Thread 핸들러가 있는 경로를 나눠 확인한다. 같은 native 이벤트에 두 핸들러를 지정했다고 모두 실행된다고 가정하지 않는다. 설치 버전의 이벤트 우선순위와 실제 합성 경로를 확인한다.

Accordion Trigger처럼 소비자 MT touch 핸들러를 실행한 뒤 내부 press/reset만 인자 없이 `runOnBackground`로 전달하는 구현에서는 native event를 MT에서 소비한다. MT 핸들러가 없는 경로에는 추가 MT wrapper를 만들지 않는다. 다른 동작에서 스레드 간 데이터가 필요하면 필요한 전달 가능 값만 고른다.

이 touch 순서를 모든 이벤트에 적용하지 않는다. tap의 상태 변경·소비자 콜백 순서는 1단계에서 정한 계약을 보존한다.

완료 기준은 공개 상태나 실제 UI로 관찰한 결과다. press 계약을 바꿨다면 다음을 확인한다.

- start에서 pressed가 켜지고 end와 cancel 각각에서 해제된다.
- disabled에서는 내부 press와 활성화 동작이 차단된다.
- 소비자 콜백이 계약한 순서로 한 번씩 실행된다.
- BG-only 경로와 양쪽 스레드를 켠 테스트 모두에서 결과가 맞는다.

## 4. native 구조·ref·접근성 보존

literal JSX, children 분리, null ref 처리는 [Native JSX 제약](lynx-patterns.md#native-jsx-제약)을 따른다. ref는 계약한 native 요소로 전달하고 소비자가 필요한 작업의 실제 결과로 검증한다. prop 전달이나 객체의 key 목록만으로 ref 동작을 판정하지 않는다.

RefProxy처럼 동적 메서드를 제공하는 객체는 `in` 연산과 메서드 접근 결과가 다를 수 있다. 대상 런타임에서 메서드 접근과 호출 결과를 확인하며, 특정 버전의 관찰을 모든 ref 구현의 규칙으로 일반화하지 않는다.

접근성 기본값과 소비자 override의 우선순위는 [접근성 책임](lynx-patterns.md#accessibility)을 따른다. Styled가 같은 상태·역할·ref를 다시 소유하지 않는지 확인한다.

완료 기준은 공개 소비 경로에서 ref 작업, 접근성 상태 전환, 허용한 override가 동작하는 것이다.

## 5. 배포 결과의 독립 소비

source뿐 아니라 runtime export와 declaration graph를 확인한다. 런타임에 CSS import가 없어도 공개 타입이 Styled 패키지에 의존하면 독립 소비 계약을 충족하지 못한다.

대상 package의 `package.json` exports와 build 설정, 공개 `src/index.ts`, 상속 `tsconfig.json`, 현재 ReactLynx packaging 지침을 읽는다. 명령과 버전은 현재 설정에서 찾는다.

완료 결과를 package type/build, 공개 export를 쓰는 독립 consumer type/build, native 동작으로 나눠 기록한다. Headless 소스를 직접 import하는 검증으로 배포 entry 검증을 대신하지 않는다.

## 6. Styled 연결 뒤 계산량 비교

기존 Recipe/context 결과를 재사용하고, wrapper마다 전체 slot recipe를 다시 계산하거나 pressed를 따로 관리하지 않는다. 상태에 따라 갱신해야 하는 계산은 유지한다. 예를 들어 정적 Trigger 클래스는 Item의 class map을 재사용하되 pressed-aware 자식 계산은 별도로 필요할 수 있다.

기존 구현을 추출했다면 기준 revision과 수정본에 같은 Item 수, 초기 상태, thread mode, 부모 갱신, 입력을 적용한다. 마운트뿐 아니라 무관한 부모 갱신과 press/release에서 계산이 늘어나는 위치를 확인한다. 새 구현에는 존재하지 않는 이전 성능 결과를 만들지 않는다.

완료 기준은 동작을 유지하면서 발견한 중복 계산을 제거하고 비교 조건과 결과를 남긴 것이다. 호출 수는 native 프레임 시간과 별도 지표다. 호출 수만으로 FPS나 일반적인 성능 무회귀를 주장하지 않으며, 절대 횟수를 영구 회귀 테스트에 고정하지 않는다.

## 7. 검증과 정리

공개 소비 예제와 native 검증은 [Lynx 검증 런북](../../seed-verify-lynx-component/references/verification.md)을 따른다. 특정 결함을 격리하는 임시 probe는 보조 증거이며 실제 소비 예제 검증을 대신하지 않는다. 소비자 동작의 회귀를 잡는 테스트만 남기고 일회성 성능 probe는 제거한다.

기기 입력 도구가 cancel 등을 지원하지 않으면 시도한 입력과 미검증 범위를 적는다. unit/dual-thread 결과를 실기기 결과로 합치지 않는다. 온라인 조작과 정리는 [session 소유권과 Card 수명](../../seed-verify-lynx-component/references/concurrency/session-ownership.md)을 따른다.

커밋을 요청받으면 [`seed-change` 제출 절차](../../seed-change/references/submit.md)에 따라 승인된 레이어만 선별한다. Headless-only 요청에서는 공유 lockfile·changeset에도 Styled 변경이 섞이지 않았는지 확인한다.

완료 기준은 관련 계약의 검증 결과와 미확인 범위가 구분되어 있고, 임시 파일과 소유 실행 자원의 정리가 끝난 것이다.
