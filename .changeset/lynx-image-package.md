---
"@seed-design/lynx-react-image": minor
---

Lynx 이미지의 로딩·성공·실패 상태를 추적하는 `useImage` 훅과 headless Image 컴포넌트를 제공합니다.

- `bindload`와 `binderror`로 상태를 갱신하고 fallback 표시 여부를 판단할 수 있습니다.
- 이미지 주소 변경 시 상태를 초기화하고 이전 요청의 콜백과 중복 상태 알림을 무시합니다.
- `Image.Root`, `Image.Content`, `Image.Fallback`으로 상태 공유·이벤트 연결·fallback 표시를 구성합니다.
