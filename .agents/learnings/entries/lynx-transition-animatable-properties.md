---
id: lynx-transition-animatable-properties
description: Lynx Recipe·styled 컴포넌트에서 variant 전환 때 `transition` 목록에 넣은 속성이 애니메이션되지 않고 전환 첫 프레임에 튀거나, 확장·축소 같은 레이아웃 전환에서 자식 간격이 순간 이동할 때 읽는다. Lynx engine이 transition으로 보간하는 속성 목록을 확인하는 위치와, 보간되지 않는 `gap`을 전환 중 고정하거나 보간되는 속성으로 바꾸는 판단을 다룬다. 웹 Recipe(qvism-preset)의 transition에는 적용하지 않는다.
scope: ["packages/lynx-qvism-preset/**", "packages/lynx-css/**", "packages/lynx-react/**"]
status: active
related: ["lynx-device-cdp-geometry"]
verified_at: "2026-09-29"
---

# Lynx transition은 engine의 animatable 목록에 있는 속성만 보간한다

## 교훈과 다음 행동

- variant 사이에서 값이 바뀌는 속성을 `transition`에 넣기 전에 Lynx engine의 `AnimationPropertyType`(`core/renderer/starlight/style/css_type.h`)에 있는지 확인한다. `gap`은 목록에 없어 `transition: gap ...`을 적어도 새 값으로 즉시 바뀐다.
- 전환 중 간격이 유지돼야 하면 `gap`을 variant 사이에서 바꾸지 않고 base에 고정한다. 간격 자체를 움직여야 하면 목록에 있는 `margin-*`·`padding-*`·`width`로 표현한다.
- `@lynx-js/css-defines`의 `transition-property` 호환 데이터는 속성별 보간 여부를 알려 주지 않는다. engine 원천이나 기기 결과로 판단한다.

## 발생 근거와 적용 조건

- 상황(DES-2618): FloatingActionButton Recipe가 축소 때 root `gap`을 4px에서 0으로 바꾸고 `transition`에 `gap`을 넣어 두었다. label을 fade로 남기자, 사용자 화면 기록에서 누르는 순간(+0.134초→+0.150초 프레임) label이 아이콘 쪽으로 붙은 뒤 폭이 줄어들었다.
- 영향: `gap`을 base에 고정하고 transition 목록에서 뺐다. iOS PlayLynx에서 전환을 3초로 늦춘 임시 예제로 확인했을 때 축소 중에도 아이콘과 label 사이 간격이 유지됐고, 축소 뒤 DOM에서도 간격이 4px였다.
- 근거 revision: 로컬 Lynx engine 원천 `f364ace`의 `AnimationPropertyType`에는 `opacity`, `width`, `height`, `padding-*`, `margin-*`, `transform` 등이 있고 `gap`은 없다.

## 변경 이력

- 2026-09-29: DES-2618 FloatingActionButton label fade 작업에서 기록했다.
