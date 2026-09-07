---
"@seed-design/lynx-react": minor
"@seed-design/lynx-css": minor
---

Lynx 컴포넌트에 누르는 동안 요소가 축소되는 Scale Feedback을 추가합니다.

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

`ScaleFeedback` 컴포넌트와 `useScaleFeedback` 훅을 제공합니다.
요소 전체를 축소하는 Self Scale과 내부 콘텐츠만 축소하는 Content Scale을 구성할 수 있습니다.

`mergeProps` 유틸을 추가하고 컴포넌트의 props 합성에 적용합니다.
사용자 이벤트와 ref를 내부 동작과 함께 보존하며, Main Thread와 Background Thread의 실행 경계를 유지합니다.

최소 지원 버전은 Lynx Engine 3.9입니다.
