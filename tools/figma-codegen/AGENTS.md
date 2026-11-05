# tools/figma-codegen

Figma Dev Mode codegen 플러그인이다. 선택한 Plugin API 노드(`SceneNode`)를 `createPluginNormalizer` → `react.createPipeline`으로 React 코드로 바꿔 `src/main.ts`의 `figma.codegen.on("generate")` 핸들러가 `CodegenResult[]`로 돌려준다.

## 검증

1. `packages/figma`를 고쳤으면 `bun --filter @seed-design/figma build`를 먼저 실행한다.
2. `bun --filter @seed-design/figma-codegen build`를 실행한다. `build-figma-plugin --typecheck`가 타입 검사도 한다.
3. Dev Mode 출력 확인은 Figma 데스크톱 앱이 필요하므로 사람에게 요청한다.

## 규칙

- Plugin 환경이 보장되므로 `createPluginNormalizer`와 `figma.*` 전역을 쓴다. `createRestNormalizer`는 쓰지 않는다.
- 생성 코드 모양을 바꿔야 함 → 이 플러그인이 아니라 `packages/figma/src/codegen/targets/react/`를 고친다. `packages/mcp`도 같은 codegen을 쓴다.
- manifest는 `package.json`의 `figma-plugin` 필드에서 고친다. `manifest.json`은 빌드가 만드는 gitignore 대상이다.
- 외부 요청은 `figma-plugin.networkAccess.allowedDomains`에 있는 도메인만 된다(현재 PostHog뿐). 새 도메인을 쓰려면 이 목록에 추가한다.
