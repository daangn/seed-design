# packages/lynx-react-headless

`@seed-design/lynx-react`가 조합하는 Lynx headless 패키지 모음이다. 패키지마다 공개 hook·컴포넌트와 테스트를 따로 둔다.

## 규칙

- floating 레이어(Menu·Select·HelpBubble 등)를 렌더링하는 패키지는 raw `<overlay>`를 쓰지 않는다 → [`packages/lynx-react/AGENTS.md`의 floating 레이어 규칙](../lynx-react/AGENTS.md#floating-레이어)대로 `@lynx-js/lynx-ui-overlay`의 `OverlayView`를 직접 쓴다.
