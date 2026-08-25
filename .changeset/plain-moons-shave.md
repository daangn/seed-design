---
"@seed-design/css": minor
"@seed-design/react": minor
"@seed-design/rootage-artifacts": minor
---

눌렀을 때 요소가 줄어드는 Scale Feedback을 일부 컴포넌트에 적용합니다.

- Action Button에만 있던 축소 피드백이 Callout, Page Banner, Chip, Tab, Checkmark, Radiomark, Switchmark, Toggle Button, Reaction Button, Quantity Picker, Attachment Input 등 눌리는 요소 전반으로 확대됩니다.
- Callout Close Button과 Page Banner Close Button에 축소 피드백과 함께 색상 피드백을 추가합니다.
- 축소 배율을 요소의 렌더된 크기로부터 계산하여 작은 아이콘 버튼과 화면 양끝을 채우는 버튼이 시각적으로 동일한 정도로 눌린 느낌이 들도록 합니다.
- CSS `transform` 및 `scale` 속성이나 motion 등 외부 라이브러리로 비슷한 스타일을 적용하고 있던 경우 제거를 권장합니다.

직접 만든 React 컴포넌트에 동일한 효과를 적용할 수 있도록 `ScaleFeedback` 유틸리티 컴포넌트를 제공합니다. 자세한 내용은 [Scale Feedback](https://seed-design.io/react/components/concepts/scale-feedback) 문서를 참고합니다.
