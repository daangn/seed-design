---
id: lynx-view-default-overflow-clip
description: Lynx Recipe·styled 컴포넌트에서 `position: absolute`와 음수 offset으로 부모 밖에 걸친 요소(삭제 버튼·badge·indicator 등)가 iOS 기기에서 잘릴 때, 특히 목록의 마지막 항목에서만 잘리고 다른 항목은 다음 형제와 겹쳐 멀쩡해 보일 때 읽는다. 잘라내는 조상을 CDP computed `overflow`로 찾는 방법, `overflow: visible`을 둘 위치, 다크 모드에서 잘림이 보이지 않을 때의 A/B 확인 방법을 다룬다. z-index가 stacking context 때문에 무시되는 문제는 lynx-z-index-stacking-context를 본다.
scope: ["packages/lynx-qvism-preset/**", "packages/lynx-css/**", "packages/lynx-react/**", "docs/examples/lynx/**"]
status: active
related: ["lynx-z-index-stacking-context", "lynx-device-cdp-geometry"]
verified_at: "2026-10-07"
---

# Lynx view는 overflow를 지정하지 않으면 자식을 자기 경계에서 자른다

## 교훈과 다음 행동

- 자식이 부모 밖으로 걸치는 구조는 걸친 자식의 부모만이 아니라 잘림이 생기는 모든 조상 view에 `overflow: visible`을 둔다. Recipe에서 항목 root에만 `overflow: visible`을 주면 항목들을 감싼 group view가 다시 자른다.
- 잘라내는 조상은 `agent-lynx cdp --method DOM.getDocument`로 tree를 얻고, 후보 node마다 `CSS.getComputedStyleForNode`의 `overflow`와 `DOM.getBoxModel`의 `border` quad를 비교해 찾는다. 걸친 요소의 border가 조상 border 밖으로 나가고 그 조상의 computed `overflow`가 `hidden`이면 원인이다.
- computed `overflow-x`·`overflow-y`는 `overflow: visible`을 준 뒤에도 `hidden`으로 나온다. 이 두 값으로 미적용을 판정하지 않고 `overflow` 값과 화면으로 판정한다.
- 기기가 다크 모드이면 배경과 같은 색의 버튼은 잘려도 구분하기 어렵다. 임시 예제에서 조상 view에 `--seed-color-bg-layer-default` 같은 색 변수를 눈에 띄는 색으로 덮고, 같은 구조의 group에 inline `overflow: hidden`을 준 행과 Recipe 기본 행을 나란히 렌더해 비교한다. 판정 뒤 임시 예제를 지운다.

## 발생 근거와 적용 조건

- Attachment Display Field·Attachment Field(`attachment-input` Recipe)에서 마지막 이미지 항목의 삭제 버튼 오른쪽이 잘렸다. 삭제 버튼은 항목 root 오른쪽 위로 4px 걸치며 항목 root는 `overflow: visible`이었다.
- iPhone PlayLynx(iOS 26.7, Lynx SDK 1.4.0), agent-lynx 0.14.2에서 `seed-attachment-input__itemGroup`의 computed `overflow`가 `hidden`이었고, border 오른쪽 272px 밖으로 삭제 버튼 border가 276px까지 나갔다. 첫 항목의 버튼은 group 안쪽에 있어 잘리지 않았다.
- `itemGroup` slot에 `overflow: "visible"`을 추가하고 `bun qvism:generate`, dev 서버 재시작 뒤 같은 node의 computed `overflow`가 `visible`이 됐다. 색을 덮은 임시 예제에서 inline `overflow: hidden` 행은 버튼 위·오른쪽이 잘렸고 Recipe 기본 행과 두 실제 Field 예제는 원형 버튼 전체가 보였다.
- 피할 패턴: 웹 Recipe처럼 부모 기본값이 `visible`이라고 가정하고 걸친 요소의 직접 부모에만 `overflow: visible`을 두는 것.

## 변경 이력

- 2026-10-07: Attachment 삭제 버튼 잘림 수정 중 iPhone PlayLynx에서 원인과 수정 결과를 확인해 기록했다.
