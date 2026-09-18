---
"@seed-design/lynx-react": minor
"@seed-design/lynx-css": minor
---

Lynx Avatar와 AvatarStack을 추가합니다.

- 이미지 로딩 상태와 fallback, 배지 및 10가지 크기를 제공합니다.
- React와 같은 compound API와 여러 프로필을 겹치는 Stack을 제공합니다.
- 네이티브에서 배지가 표시되도록 쌓임 순서를 조정하고 예제 배지는 WebP로 제공합니다.
- 이미지 상태·fallback을 headless Image에 위임합니다.
- `badgeMask`로 원·꽃·방패 모양의 투명한 배지 여백을 제공합니다. SVG 합성 대신 크기별 PNG alpha 마스크를 적용합니다.
- headless 패키지를 외부 의존성으로 유지해 스타일드 컴포넌트와 공개 headless API가 같은 Context를 공유합니다.
