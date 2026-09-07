---
"@seed-design/lynx-react": minor
"@seed-design/lynx-css": minor
---

Lynx 컴포넌트에 Scale Feedback을 추가합니다.

- Action Button
- Chip
- Callout
- Tabs
- Accordion
- Checkbox
- Radio Group
- Switch
- Page Banner의 Button·Close Button
- Select Box
- Segmented Control

`ScaleFeedback` 유틸과 `useScaleFeedback` 훅으로 Self·Content Scale Feedback을 구성할 수 있습니다. Rootage의 pressed scale duration과 easing을 사용해 Main Thread의 `Element.animate()`로 반응합니다.

최소 지원 버전은 Lynx Engine 3.9입니다.

`mergeProps`를 추가하고 Lynx 컴포넌트의 props 합성에 적용합니다. 사용자 이벤트와 ref를 내부 동작과 함께 보존하며, Main Thread와 Background Thread의 실행 경계를 유지합니다.
