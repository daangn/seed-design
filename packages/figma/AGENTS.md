# packages/figma

## 디렉토리 개요

**Figma 연동 라이브러리**. Figma에서 디자인 토큰과 컴포넌트 정보를 추출하고 코드를 생성한다. `bun figma:sync`로 Figma 변수를 `rootage` YAML로 동기화한다. `tools/figma-*` 플러그인과 달리 라이브러리로 import해서 사용한다.

## 파일 작성 컨벤션

- `src/normalizer/`: Figma 데이터 정규화 (아래 참고)
- `src/codegen/`: normalized 값 기반 코드 생성 로직 (아래 참고)
- `src/entities/`: 도메인 엔티티 (interface, repository, service 패턴)

### Normalizer (`src/normalizer/`)

Figma 노드 데이터를 통일된 내부 타입(`NormalizedNode`)으로 변환한다. 입력 소스에 따라 두 가지 normalizer가 있다.

| 파일             | 팩토리                   | 입력 소스                                   | Plugin API 사용                                |
| ---------------- | ------------------------ | ------------------------------------------- | ---------------------------------------------- |
| `from-rest.ts`   | `createRestNormalizer`   | REST API 응답 (`@figma/rest-api-spec` 타입) | **불가** — Plugin 환경 밖에서도 실행될 수 있음 |
| `from-plugin.ts` | `createPluginNormalizer` | Plugin API 노드 (`SceneNode` 등)            | **가능** — Plugin 환경 실행이 보장됨           |

사용처:

- `packages/mcp` → `createRestNormalizer` (REST API → normalized)
- `tools/figma-codegen` → `createPluginNormalizer` (Plugin API → normalized)

### Codegen (`src/codegen/`)

**normalized 값을 바탕으로 결정적인 코드를 생성**한다. Plugin 환경에서 돌지 않을 수 있으므로(`packages/mcp`의 `get_node_react_code` 등) Plugin API 사용 **불가**.

| 타겟             | 설명                                                               | 사용처                                |
| ---------------- | ------------------------------------------------------------------ | ------------------------------------- |
| `targets/react/` | React 코드 생성 (`<HStack>`, `<Box>`, `<TextField>` 등)            | `tools/figma-codegen`, `packages/mcp` |
| `targets/figma/` | Figma pseudo JSX 코드 생성 (`<Frame>`, `<Text>`, `<Rectangle>` 등) | `packages/mcp`                        |

- **react 코드**: 실제 컴포넌트 코드로 사용 가능
- **figma 코드**: JSX pseudo code에 가까우며 LLM 입력용 (결정적인 수도코드로 비결정적인 결과를 유도)

## 코드 작성 컨벤션

- `FIGMA_ACCESS_TOKEN` 환경변수 필요
- Entity 파일: `{entity}.interface.ts`, `{entity}.repository.ts`, `{entity}.service.ts`
- normalizer 출력 타입은 `src/normalizer/types.ts`에 정의 — codegen은 이 타입만 의존
- codegen에서 Plugin API(`figma.*`, `node.getMainComponentAsync()` 등)를 직접 호출하지 않는다
