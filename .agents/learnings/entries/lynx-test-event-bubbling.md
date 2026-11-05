---
id: lynx-test-event-bubbling
description: "Lynx 컴포넌트 테스트(`@lynx-js/react/testing-library`)에서 자식의 tap·touch가 부모 `bindtap`으로 전파되는지, 또는 `catchtap`이 전파를 막는지 검증하거나, `fireEvent.tap(el, { bubbles: true })`가 `Cannot set property bubbles` 오류를 낼 때 읽는다. 기본 비전파와 `bubbles` init 오류는 `@lynx-js/react` 0.121.0 미만(0.117.0에서 확인)에만 해당하고, bind·catch 분리 모델과 native 전파 차이를 기기에서 판정하는 기준은 0.123.3에서도 적용된다. 단일 요소의 handler 호출 검증에는 적용하지 않는다."
scope: ["packages/lynx-react/**", "packages/lynx-react-headless/**"]
status: active
related: ["lynx-headless-tree-parity"]
---

# Lynx 테스트 환경은 catch를 native처럼 모델링하지 않고, 0.121.0 미만에서는 tap도 전파하지 않는다

## 교훈과 다음 행동

- 먼저 테스트가 실제로 해석하는 `@lynx-js/react` 버전을 확인한다(예: `node -e "console.log(require.resolve('@lynx-js/react/testing-library'))"` 경로의 버전). 2026-09-29 기준 `packages/lynx-react`와 headless 패키지는 `^0.117.0`을 devDependency로 쓴다.
- 0.121.0 미만(0.117.0에서 확인): `fireEvent.tap(el)`·`fireEvent.touchstart(el, {})`는 `bubbles: false` 이벤트를 보낸다. 부모 `bindtap`이 호출되지 않는 결과를 native 전파 차단으로 해석하지 않는다. init 객체의 `bubbles`는 생성 뒤 대입되어 `TypeError`가 나므로 이벤트 객체를 직접 만든다.

  ```tsx
  fireEvent(closeButton, new Event("bindEvent:tap", { bubbles: true }));
  ```

- 0.121.0 이상: tap·touch 계열 `fireEvent`의 기본값이 `bubbles: true`이고 init 재대입 오류도 고쳐졌다([CHANGELOG #2532](https://github.com/lynx-family/lynx-stack/pull/2532)). 위 우회 없이 `fireEvent.tap(el)`이 부모로 전파된다. 버전을 올린 뒤 "전파되지 않음"을 기대하던 테스트는 결과가 바뀔 수 있다.

- 테스트 환경은 `bindEvent:tap`과 `catchEvent:tap`을 서로 다른 이벤트 타입으로 등록한다. catch listener는 같은 타입의 전파만 멈추므로, 자식 catch가 부모 bind를 막는지는 테스트로 판정할 수 없다. catch 격리 여부는 요소의 event key(`bindEvent:*`·`catchEvent:*`)를 확인하고, 실제 전파 차이는 PlayLynx 기기에서 부모·자식 호출 횟수를 표시하는 임시 장면으로 확인한다.

## 발생 근거와 적용 조건

- DES-2615 Callout 분리에서 Callout CloseButton의 tap이 탭할 수 있는 Root로 전파되는 계약을 보존해야 했다. 기본 `fireEvent.tap`으로는 Root `bindtap`이 호출되지 않았고, `{ bubbles: true }` init은 `TypeError: Cannot set property bubbles of #<Event> which has only a getter`로 실패했다.
- `new Event("bindEvent:tap", { bubbles: true })`로 보내자 호출 순서가 `close → dismiss → root`로 기록됐다. `@lynx-js/react` 0.117.0 testing-library의 `__AddEvent`는 `catchEvent`·`capture-catch` listener에서만 `stopPropagation()`을 호출한다. 저장소에 함께 설치된 0.123.3의 testing-library도 같은 분기를 유지하고, `tap`·`touchstart`의 `defaultInit`은 `{ bubbles: true }`다.
- iOS PlayLynx(iOS 26.6, PlayLynx SDK 1.4.0)에서 CloseButton을 탭하자 Callout은 Root `bindtap`이 1회 실행됐고, `catchtap`을 쓰는 PageBanner CloseButton은 Root `bindtap`이 실행되지 않았다.
- 피할 패턴: 기본 `fireEvent` 결과로 전파 여부를 판정하거나, 테스트 환경의 catch 결과를 native 격리 증거로 쓰는 것.
- 위험: 전파 계약이 바뀌어도 테스트가 통과하거나, 존재하지 않는 차이를 근거로 두 컴포넌트의 이벤트 계약을 통합한다.

## 변경 이력

- 2026-09-29: DES-2615 Callout headless 분리에서 확인한 테스트 환경 전파 모델과 기기 판정 결과를 기록했다.
- 2026-09-29: #2310 리뷰에 따라 기본 비전파와 `bubbles` init 오류를 0.121.0 미만으로 한정했다. 0.123.3 설치본의 CHANGELOG·`defaultInit`·catch 분기를 확인했고, 0.121.0 이상에서 테스트를 실행하지는 않았다.
