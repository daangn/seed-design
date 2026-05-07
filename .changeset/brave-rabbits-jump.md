---
"@seed-design/rsbuild-plugin": minor
---

(BREAKING CHANGE: `@rsbuild/core`를 v2로 함께 업그레이드해야 합니다.) `@rsbuild/core` peer dependency를 v2로 갱신합니다.

- `@seed-design/rsbuild-plugin`이 사용하는 `modifyHTMLTags` API와 타입(`RsbuildPlugin`, `HtmlBasicTag`)은 Rsbuild v2에서도 동일하므로 SEED 측 동작은 변화 없습니다.
- `@rsbuild/core` v1을 계속 사용하려는 프로젝트는 `@seed-design/rsbuild-plugin` 이전 버전을 유지해 주세요.
