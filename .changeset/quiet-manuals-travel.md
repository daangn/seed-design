---
"@seed-design/react": patch
"@seed-design/stackflow": patch
---

컴포넌트 문서를 패키지에 내장합니다. 설치된 버전과 일치하는 문서 사본이 `docs/` 디렉토리로 함께 배포되어, AI 에이전트가 네트워크 없이 `node_modules`에서 예제 코드와 props 목록을 바로 읽을 수 있습니다. 진입점은 각 패키지의 `docs/index.md`입니다.
