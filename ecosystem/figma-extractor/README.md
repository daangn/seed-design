# @seed-design/figma-extractor

## Installation

```shell
bun add -D @seed-design/figma-extractor
```

## 사용

### 모든 파이프라인 실행 결과를 `src/data`에 추출

```shell
bun figma-extractor src/data
```

### 특정 파이프라인만 실행하여 결과를 `src/data`에 추출

```shell
bun figma-extractor src/data icons buttons
```

## 설정

설정 파일이 필요합니다. `figma-extractor.config.ts` 파일을 프로젝트 루트에 작성합니다.

```ts
import {
  createConfig,
  createPipeline,
  sources,
} from "@seed-design/figma-extractor";

const config = createConfig({
  pipelines: {
    // 아이콘 추출 파이프라인
    icons: createPipeline()
      // 모든 component set 선택
      .source(sources.componentSets)
      // icon_으로 시작하는 컴포넌트만 필터링
      .filter((componentSet) => componentSet.name.startsWith("icon_"))
      // 아이콘의 ID와 이름만 추출
      .transform(({ id, name }) => ({ id, name: name.replace(/^icon_/, "") }))
      // 단일 파일로 저장
      .write(async (items, { utils, write }) => {
        const record = Object.fromEntries(items.map((item) => [item.id, item]));

        const json = utils.toJson(record, true);

        await write("icons.json", json);
      }),

    // 텍스트 스타일 추출 파이프라인
    buttons: createPipeline()
      // 모든 스타일 선택
      .source(sources.styles)
      // 버튼 스타일만 필터링
      .filter((style) => style.type === "TEXT")
      // 각각을 `.mjs`, `.d.ts` 파일로 저장
      .write(writers.default),
  },
});

export default config;
```

### `fileKey` (optional)

- 가져올 정보가 있는 Figma 파일의 Key (Figma에서 제공)
- 등록하지 않는 경우 `FIGMA_FILE_KEY` 환경 변수를 사용합니다. (둘 중 하나는 필수)
- File Key 찾기
  1. Figma 클라이언트에서 파일을 엽니다
  1. 개발자 도구 - Console 탭을 엽니다
  1. `figma.fileKey` 실행

### `personalAccessToken` (optional)

- Figma API 사용을 위한 토큰 (Figma에서 제공)
- 등록하지 않는 경우 `FIGMA_PERSONAL_ACCESS_TOKEN` 환경 변수를 사용합니다. (둘 중 하나는 필수)
- [Personal Access Token 받는 방법에 관한 Figma 문서](https://www.figma.com/developers/api#access-tokens)
- 문서 페이지에서 테스트 용도로 생성된 Access Token은 24시간이 지나면 만료됩니다. Figma 설정 페이지에서 생성하면 더 긴 유효 기간을 설정할 수 있습니다.

### `pipelines` (필수)

파이프라인 방식으로 Figma 데이터를 추출하고 변환합니다. 자세한 내용은 다음 내용을 참고하세요.

## 파이프라인 작성하기

1. **source**: 데이터 소스 선택 (`components`, `componentSets`, `styles`, `variables`)
2. **filter** (선택): 필요한 항목만 필터링
3. **sort** (선택): 항목 정렬
4. **transform** (선택): 데이터 변환
5. **write**: 파일로 저장

### `source`

데이터 소스를 선택합니다.

- `sources.components`
- `sources.componentSets`
- `sources.styles`
- `sources.variables`
- 직접 작성할 수도 있습니다.

### `write`

직전 단계에서 결과로 생성한 데이터를 가공하여 파일로 저장합니다.

- `writers.default`: item 각각에 대해 `.mjs`, `.d.ts` 파일을 생성하고 index 파일을 생성합니다. 모든 파일은 pipeline 이름을 상위 디렉토리로 사용합니다.
- 직접 작성할 수도 있습니다.

#### `write` 직접 작성하기

`WriterContext`에서 제공하는 메서드를 활용하여 원하는 형태로 파일을 저장할 수 있습니다. (모든 항목을 합쳐서 하나의 파일로 저장 등)

- `context.write(path, content)`: 파일 쓰기
- `context.utils`: JSON 등으로 변환

## 설정 파일 경로 지정하기

설정 파일의 경로를 직접 설정할 수 있습니다. 여러 개의 Figma 파일을 다루는 경우에 유용합니다.

```shell
bun figma-extractor --config=.config/figma-extractor-design-system-a.config.ts src/data/icons
```

```ts
// .config/figma-extractor-design-system-a.config.ts

import { createConfig, createPipeline, sources, writers } from "@seed-design/figma-extractor";

const config = createConfig({
  fileKey: process.env.FIGMA_DESIGN_SYSTEM_A_FILE_KEY // a 파일의 Figma File Key
  pipelines: {
    components: createPipeline()
      .source(sources.components)
      .write(writers.default),
  },
});
```

```ts
// .config/figma-extractor-design-system-b.config.ts
import {
  createConfig,
  createPipeline,
  sources,
  writers,
} from "@seed-design/figma-extractor";

const config = createConfig({
  fileKey: process.env.FIGMA_DESIGN_SYSTEM_B_FILE_KEY, // b 파일의 Figma File Key
  pipelines: {
    components: createPipeline()
      .source(sources.components)
      .write(writers.default),
  },
});
```
