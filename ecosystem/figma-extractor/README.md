# @seed-design/figma-extractor

## Installation

```shell
bun add -D @seed-design/figma-extractor
```

## 사용

### Component 정보를 src/data에 추출

```shell
bun figma-extractor src/data components
```

### Component Set 정보를 src/data에 추출

```shell
bun figma-extractor src/data component-sets
```

### Variable 정보를 src/data에 추출

```shell
bun figma-extractor src/data variables
```

### Style 정보를 src/data에 추출

```shell
bun figma-extractor src/data styles
```

### 사용 가능한 모든 정보를 src/data에 추출

```shell
bun figma-extractor src/data
```

## 설정 파일

설정 파일 없이도 실행 가능하지만, 필요에 따라 설정 파일(`figma-extractor.config.ts`)을 작성할 수 있습니다.

```ts
import type { Config } from "@seed-design/figma-extractor";

const config: Config = {
  data: {
    components: {
      filter: ({ componentSetId }) => componentSetId === undefined,
      transform: ({ name, key }) => ({ name, key }),
    },
    componentSets: {
      filter: ({ name }) => name.includes("Button"),
      transform: ({ name, key }) => ({ name, key }),
    },
  },
};

export default config;
```

### `fileKey`

- 가져올 정보가 있는 Figma 파일의 Key (Figma에서 제공)
- 등록하지 않는 경우 `FIGMA_FILE_KEY` 환경 변수를 사용합니다. (둘 중 하나는 필수)
- File Key 찾기
  1. Figma 클라이언트에서 파일을 엽니다
  1. 개발자 도구 - Console 탭을 엽니다
  1. `figma.fileKey` 실행

### `personalAccessToken`

- Figma API 사용을 위한 토큰 (Figma에서 제공)
- 등록하지 않는 경우 `FIGMA_PERSONAL_ACCESS_TOKEN` 환경 변수를 사용합니다. (둘 중 하나는 필수)
- [Personal Access Token 받기](https://www.figma.com/developers/api#access-tokens)
- 생성된 Access Token은 24시간이 지나면 만료됩니다.

### `data`

- 데이터 종류 별 설정

#### `filter`

- 기본값: `() => true`
- 특정 조건을 만족하는 항목만 추출합니다.
- 레이어에 대한 접근 가능한 모든 정보를 가져오기 때문에, 설정하는 것을 권장합니다.

#### `transform`

- 기본값: `(metadataItem) => metadataItem`
- 특정 필드만 추출하는 등 원하는 형태로 변환합니다.
- 파일 생성을 위해 `name` 필드가 있는 Record를 반환해야 합니다.

### 설정 파일 예시

```ts
import type {
  Config,
  GenerateComponentMetadataOptions,
  GenerateComponentSetMetadataOptions,
} from "@seed-design/figma-extractor";

// name, key, componentPropertyDefinitions 추출
// componentPropertyDefinitions에서는 defaultValue 필드 제거
const transform: GenerateComponentMetadataOptions["transform"] &
  GenerateComponentSetMetadataOptions["transform"] = ({
  name,
  key,
  componentPropertyDefinitions,
}) => ({
  name,
  key,
  ...(componentPropertyDefinitions && {
    componentPropertyDefinitions: Object.fromEntries(
      Object.entries(componentPropertyDefinitions).map(
        ([key, { defaultValue, ...rest }]) => [key, rest]
      )
    ),
  }),
});

const config: Config = {
  data: {
    components: {
      filter: ({ name, componentSetId }) =>
        (name.startsWith("🔵 ") || name.startsWith("🟢 ")) &&
        // Component Set에 속한 Component는 추출하지 않습니다.
        componentSetId === undefined,
      transform,
    },
    componentSets: {
      filter: ({ name }) => name.startsWith("🔵 ") || name.startsWith("🟢 "),
      transform,
    },
    styles: {
      // Text Style만 추출
      filter: ({ style_type }) => style_type === "TEXT",
      transform: ({ name, key }) => ({ name, key }),
    },
  },
};

export default config;
```
