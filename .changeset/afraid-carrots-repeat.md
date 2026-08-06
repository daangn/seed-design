---
"@seed-design/stackflow": patch
---

게이트나 Suspense 뒤에서 뒤늦게 렌더링되는 AppScreen도 push 트랜지션을 재생하도록 수정합니다.

- 기존에는 push 직후 한 프레임 안에 AppScreen이 DOM에 없으면 트랜지션이 조용히 생략됐습니다. 권한 확인이나 데이터 로딩으로 AppScreen 자체를 감싼 화면에서 애니메이션이 아예 나오지 않던 문제입니다.
- 이제 트랜지션 시간(기본 350ms) 안에 AppScreen이 렌더링되면 렌더링된 시점부터 트랜지션이 재생됩니다. `@seed-design/css@1.1` 시절 CSS 기반 트랜지션과 같은 동작입니다.
- 그보다 늦게 렌더링되면 트랜지션은 재생되지 않으며, 개발 환경에서 콘솔 경고를 출력합니다. AppScreen을 게이트 바깥에 두는 구조를 권장합니다.
