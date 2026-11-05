# packages/figma

Figma 노드를 내부 타입으로 정규화하고 React·Figma pseudo JSX 코드를 만드는 라이브러리(`@seed-design/figma`)다. `packages/mcp`, `tools/figma-codegen`, `tools/figma-mcp`가 `lib/` 빌드를 import한다. 도메인 배경은 `CONTEXT.md`에 있다.

## 검증

- 타입 → `packages/figma`에서 `bunx tsc --noEmit`(CI `sync-figma-entities.yml`과 같은 명령)
- 소비자(`packages/mcp`, `tools/figma-codegen`)로 확인하기 전 → `bun --filter @seed-design/figma build`

## 규칙

### 실행 환경 경계

코드가 Figma Plugin 안에서 실행되는지에 따라 쓸 수 있는 API가 다르다.

- `src/normalizer/from-rest.ts`(`createRestNormalizer`) → REST 응답(`@figma/rest-api-spec` 타입)만 다룬다. Plugin 밖에서도 실행되므로 Plugin API를 호출하지 않는다. 소비자: `packages/mcp`.
- `src/normalizer/from-plugin.ts`(`createPluginNormalizer`) → Plugin API 노드(`SceneNode` 등)를 다룬다. Plugin 환경이 보장되므로 `figma.*`를 쓸 수 있다. 소비자: `tools/figma-codegen`.
- `src/codegen/` → `packages/mcp`의 `get_node_react_code`처럼 Plugin 밖에서도 실행된다. `figma.*`, `node.getMainComponentAsync()` 같은 Plugin API를 호출하지 않고 `src/normalizer/types.ts`의 normalized 타입에만 의존한다 → 필요한 값은 normalizer가 담아 넘긴다.

### codegen target

- `src/codegen/targets/react/` → 실제로 쓸 수 있는 컴포넌트 코드(`<HStack>`, `<TextField>` 등). `tools/figma-codegen`과 `packages/mcp`가 쓴다.
- `src/codegen/targets/figma/` → LLM 입력용 결정적 pseudo JSX(`<Frame>`, `<Text>` 등). 결정적인 수도코드로 LLM의 비결정적 결과를 유도하는 용도라 실행 가능한 코드로 바꾸지 않는다. `packages/mcp`가 쓴다.

### Entity와 인증

- `src/entities/`는 `{entity}.interface.ts`, `{entity}.repository.ts`, `{entity}.service.ts`로 나눈다.
- `src/entities/data/__generated__/`는 `.github/workflows/sync-figma-entities.yml`이 매일 `bun --filter @seed-design/figma sync-entities`로 갱신한다. 이 명령은 `archive/`만 남기고 나머지를 지운 뒤 추출한다. 손으로 고치지 않는다 → 로컬 재생성에는 Figma secret(`FIGMA_PERSONAL_ACCESS_TOKEN`, `FIGMA_FOUNDATIONS_FILE_KEY`, `FIGMA_COMPONENTS_FILE_KEY`, `FIGMA_TEMPLATES_FILE_KEY`)이 필요하므로 사용자에게 먼저 확인한다.
- 라이브러리 코드(`src/`)는 환경변수를 읽지 않는다. Figma 인증(`FIGMA_PERSONAL_ACCESS_TOKEN`)은 REST를 호출하는 쪽(`packages/mcp`, `ecosystem/figma-extractor`)이 읽는다.
