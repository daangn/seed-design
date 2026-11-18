# tools

독립 실행 도구 workspace다. `figma-*`는 Figma 플러그인·위젯이고, `rootage-cdn/`은 Rootage CDN 운영 도구다. 재사용 라이브러리는 `packages/`에 둔다.

## 검증

- 변경한 도구의 `package.json`에 `test` script가 있으면 `bun --filter <패키지 이름> test`, 없으면 `bun --filter <패키지 이름> build`를 실행한다. `figma-*` 도구의 `test`는 `tsc`와 build를 함께 돌린다. `rootage-cdn/`은 자체 `AGENTS.md`를 따른다.
- `packages/figma`를 쓰는 도구(`figma-codegen`, `figma-mcp`) → `bun --filter @seed-design/figma build`를 먼저 실행한다. 도구는 `lib/` 빌드를 번들한다.
- Figma 안에서의 동작 → Figma 데스크톱 앱에서 플러그인을 다시 불러와야 하므로 사람에게 확인을 요청한다. 빌드 성공만으로 동작을 보장했다고 보고하지 않는다.

## 규칙

- 플러그인 manifest 위치는 도구마다 다르다. 대부분 추적되는 `manifest.json`(루트나 `src/`)이고, `figma-codegen`은 `package.json`의 `figma-plugin` 필드가 원천이다. widget(`figma-checklist-widget`, `figma-contrast-checker`, `figma-spec-widget`)의 소스는 `widget-src/`에 있다.
- Figma 노드 해석·정규화가 필요함 → 도구 안에 새로 쓰지 않고 `packages/figma`의 normalizer·codegen을 쓴다. 여러 도구에 같은 변환이 필요하면 `packages/figma` 같은 라이브러리로 옮기는 것을 검토한다.
- 입출력·부수효과(파일·네트워크·Figma API)는 진입점 파일에 두고, 변환은 export한 순수 함수로 분리해 테스트한다.
