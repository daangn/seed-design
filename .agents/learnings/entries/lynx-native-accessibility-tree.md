---
id: lynx-native-accessibility-tree
description: Lynx styled·headless 컴포넌트의 `accessibility-*` 속성이 iOS XCUITest·Android UIAutomator(agent-device snapshot, Probelynx)에 어떻게 노출되는지 판정하거나, label이 비거나 항목이 트리에서 사라지거나 같은 label이 두 번 나오는 문제를 고칠 때 읽는다. iOS의 하위 text label 미합성과 중첩 요소 숨김, Android의 flatten·lazy 접근성 경로 차이, children에서 label을 파생할 때 ReactLynx snapshot 제약, PlayLynx에서 트리를 수집하는 방법을 다룬다. 실제 VoiceOver·TalkBack 낭독 판정이나 web React 접근성에는 적용하지 않는다.
scope: ["packages/lynx-react/**", "packages/lynx-react-headless/**", "docs/registry/lynx/**", "docs/examples/lynx/**"]
status: active
related: ["lynx-go-android-real-touch", "lynx-intrinsic-jsx-typecheck"]
verified_at: "2026-10-12"
---

# Lynx 접근성 요소는 label을 명시하고 중첩하지 않으며 flatten하지 않는다

## 교훈과 다음 행동

- iOS Lynx는 `accessibility-element` view의 label을 하위 `<text>`에서 만들지 않는다 → 접근성 요소 root에 `accessibility-label`을 명시한다. styled 컴포넌트는 `packages/lynx-react/src/utils/accessibility.tsx`의 `getAccessibleText(children)`로 파생한다.
- ReactLynx 컴파일러는 intrinsic JSX(`<text>사과 {x}</text>`)의 정적 텍스트를 snapshot에 넣고 런타임 props에는 동적 부분만 남긴다(`props.children`이 `"dyn"`뿐). children 재귀로 label을 만들면 intrinsic 요소를 만난 순간 부분 label이 된다 → `getAccessibleText`는 그때 `undefined`를 돌려 명시 label을 요구한다. 문자열 children·SEED 컴포넌트 children(`<Chip.Label>텍스트</Chip.Label>`)만 파생된다.
- 접근성 요소를 중첩하지 않는다. iOS는 VoiceOver가 꺼져 있으면 안쪽 요소를 숨기고(XCUITest·Probelynx가 못 찾음), 켜져 있으면 바깥을 dummy view로 바꾸면서 `accessibility-value`를 버린다(`LynxUIOwner+Accessibility.m:86-126`, `LynxUIOwner.m:997-1003`). 그룹 root는 `accessibility-element: false`, Trigger처럼 의미를 소유하는 요소는 `AccessibilityElementScope`로 안쪽 SEED 컨트롤을 비요소로 만든다.
- Android(TalkBack 꺼짐)는 flatten된 view에 native View가 없어 명시 label이 있어도 트리에서 사라진다 → 접근성 요소 root에 `flatten: false`를 둔다. 같은 명시 label의 Switch root(`flatten: false`)는 보였고 Checkbox root(지정 없음)는 사라졌다.
- PlayLynx Android는 접근성을 lazy init한다. TalkBack이 켜진 채 페이지를 만들면 body view에 virtual node provider·delegate가 붙어 트리가 달라진다(plain `<text>` 노출, role-description `button/switch/checkbox`가 widget class로 매핑). UiAutomation(agent-device)이 연결되면 TalkBack이 억제되므로, TalkBack 경로 트리는 "TalkBack on → 페이지 열기 → settings로 TalkBack off → agent-device snapshot" 순서로만 볼 수 있고, 이때 real View 요소가 빠지는 등 결과가 불안정했다. `adb shell input swipe`로는 TalkBack 포커스가 이동하지 않았다 → TalkBack 낭독은 사람이 직접 확인한다.
- agent-device Android snapshot은 `accessibility-elements-hidden`(NO_HIDE_DESCENDANTS)인 text View도 label과 함께 나열했다. 중복 판정은 DOM(`agent-lynx cdp DOM.getDocument`)의 속성과 함께 본다.
- Android checked·selected·RangeInfo는 어느 경로에서도 Lynx가 설정하지 않는다. `accessibility-value`는 View 경로 API 30+에서만 `stateDescription`이 된다. SEED 속성으로 해결하지 않는다.

## 발생 근거와 적용 조건

- DES-2735 보고서(Probelynx SEED suite)의 iOS·Android label 공백을 재현·수정했다. 환경: PlayLynx iOS 26.5 시뮬레이터(Lynx SDK 1.4.0), PlayLynx 0.4.6 Android API 36 에뮬레이터, agent-device 0.21.25, agent-lynx 0.14.2. 엔진 소스는 `lynx-family/lynx` develop `8688964a`.
- 수집: `bun --filter @seed-design/docs build:lynx-examples`로 만든 `docs/public/__lynx__`를 `/tmp`에 복사해 portless로 서빙하고, iOS는 소유 Card 하나를 `Page.reload`로 예제마다 바꾸며 `agent-device snapshot --json`을, Android는 `adb reverse` 뒤 `playlynx://xview?renderer=lynx&url=…` 딥링크와 BACK으로 열고 닫았다. `docs/public/__lynx__`는 수집 뒤 되돌렸다.
- 함정: docs Lynx 예제 빌드는 `packages/lynx-react/lib`를 다시 만들지 않을 때가 있었다(QuantityPicker 수정이 bundle에 없었다). styled 원천을 고친 뒤에는 `bun --filter @seed-design/lynx-react build`를 먼저 실행한다.
- 결과: 수정 전 iOS에서 label이 비던 ActionButton·Chip·Trigger, 항목이 없던 RadioGroup·SelectBox·QuantityPicker가 모두 label과 함께 노출됐고, Android View 경로에서 사라졌던 Checkbox·Accordion·RadioGroup·List·WheelPicker·LoopScroll 예제 버튼이 나타났다.

## 변경 이력

- 2026-10-12: DES-2735 보고서 대응 중 확인한 엔진 동작·수집 방법·한계를 기록했다.
