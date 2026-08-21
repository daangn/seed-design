# @seed-design/mcp

## 3.0.0

### Major Changes

- 56f57da: MCP TypeScript SDK를 v1(`@modelcontextprotocol/sdk`)에서 v2(`@modelcontextprotocol/server`)로 마이그레이션합니다.

  - 두 패키지를 MCP 서버로만 사용하는 경우(`bunx @seed-design/mcp`, `npx @seed-design/docs-mcp` 등) 달라지는 것은 없습니다.
  - 패키지를 직접 import해서 커스텀 MCP 서버에 통합하는 경우 아래 영향이 있습니다.
    - `registerTools`(`@seed-design/mcp`)와 `initializeTools`, `server`(`@seed-design/docs-mcp`)가 다루는 `McpServer`의 출처가 `@modelcontextprotocol/sdk`에서 `@modelcontextprotocol/server`로 변경됩니다. v1으로 만든 `McpServer`는 더 이상 넘길 수 없으므로, 함께 v2로 옮겨야 합니다.
    - `@modelcontextprotocol/server`를 직접 설치해야 합니다. 마이그레이션은 [공식 가이드](https://github.com/modelcontextprotocol/typescript-sdk/blob/main/docs/migration/upgrade-to-v2.md)의 codemod로 대부분 자동 처리됩니다.

### Minor Changes

- 894e2b7: 특정 레이어의 SVG 마크업을 받아오는 `export_node_as_svg` 툴을 추가합니다. `export_node_as_image`의 format `SVG` 파라미터를 대체합니다.

  - REST 및 WebSocket 모드 모두에서 사용할 수 있습니다.
  - `outlineText` 파라미터를 사용하여 텍스트 레이어를 vector path로 변환할지 정합니다. Figma API 기본값은 `true`지만 이 도구의 기본값은 응답 크기 최적화를 위해 `false`입니다.

  `figma-api` 의존성을 업데이트합니다.

- ba859f2: `export_node_as_image`가 Figma 앱과 웹소켓 서버 없이 REST 모드에서도 작동하도록 업데이트합니다.

  - `format` 파라미터에서 주요 LLM 도구가 이미지로 판단하지 않는 `PDF`를 제거합니다.
  - `format` 파라미터에서 `SVG`를 제거합니다.
  - `scale` 파라미터의 스키마를 Figma REST API 제약에 맞춰 0.01 이상 4 이하로 제한합니다.

- 94929d6: `get_annotations`가 Figma 앱과 웹소켓 서버 없이 REST 모드에서도 작동하도록 업데이트하고, 반환 결과를 개선합니다.

  - 조회 대상 레이어 자신에 붙은 Annotation이 결과에서 빠지던 문제를 수정합니다.
  - Text, Rectangle처럼 하위 레이어를 가질 수 없는 레이어를 조회하면 오류가 나던 문제를 수정합니다.
  - Annotation 카테고리를 `category: { id, label, color, isPreset }`으로 반환합니다.
  - Annotation이 붙은 레이어의 `name`, `type`, 그리고 조회 대상부터 해당 레이어까지의 상위 레이어 정보를 `path`로 반환합니다.

### Patch Changes

- a4f0fe9: WebSocket 모드에서 소켓이 준비되기 전에 툴을 호출하면 생기던 문제를 수정합니다.

  - 서버 기동 직후 소켓이 열리기 전에 툴을 호출하면 MCP 서버 프로세스가 종료되어 이후 모든 요청이 응답 없이 멈추던 문제를 수정합니다. 이제 해당 호출은 에러를 반환하고 서버는 계속 동작합니다.
  - 재연결 직후 채널 참여가 끝나기 전에 툴을 호출하면 30초 타임아웃이 날 때까지 기다리는 대신, 즉시 에러를 반환합니다.

- 3ad8406: 툴 호출이 실패했을 때 반환되는 응답에 `isError` 플래그가 포함되도록 업데이트합니다.

## 2.1.0

### Minor Changes

- 86f74d7: 라이선스를 MIT에서 Apache-2.0으로 변경합니다. 저장소 루트의 Apache License 2.0과 표기가 달랐던 것을 일치시킵니다.

  - 배포물에 `LICENSE`와 `NOTICE`를 포함해, 설치한 패키지에서 바로 이용 조건을 확인할 수 있습니다.
  - MIT와 달리 재배포할 때 라이선스 사본과 `NOTICE`의 귀속 고지를 함께 전달해야 하고, 수정한 파일에는 변경 사실을 표시해야 합니다.
  - 당근 로고를 비롯한 브랜드 리소스는 별도 가이드라인을 따르며, 당근을 사칭하거나 당근 서비스와 관련이 있는 것처럼 오인하게 하는 사용은 허용되지 않습니다. 자세한 내용은 `NOTICE` 파일을 참고해주세요.

### Patch Changes

- Updated dependencies [86f74d7]
  - @seed-design/figma@2.1.0

## 2.0.0

이 패키지의 코드 변경은 없으며, SEED React 2 릴리즈에 맞춰 앞으로의 semver 정합성을 위해 버전을 올립니다.

## 1.3.18

### Patch Changes

- @seed-design/figma@1.3.18

## 1.3.17

### Patch Changes

- @seed-design/figma@1.3.17

## 1.3.16

### Patch Changes

- @seed-design/figma@1.3.16

## 1.3.15

### Patch Changes

- 91f2e12: CLI 기반 도구의 `cac` 의존성을 v7로 업데이트합니다.

  - `@seed-design/cli`와 `@seed-design/codemod`의 Node.js 요구사항을 `>=20.19.0`으로 맞춥니다.
  - `@seed-design/mcp`와 `@seed-design/figma-extractor`에서도 최신 `cac` 런타임을 사용합니다.
  - @seed-design/figma@1.3.15

## 1.3.14

### Patch Changes

- Updated dependencies [546f1fc]
  - @seed-design/figma@1.3.14

## 1.3.13

### Patch Changes

- 95d0aa2: `uuid` 의존성을 v14로 업데이트합니다.
- Updated dependencies [87f6f45]
  - @seed-design/figma@1.3.13

## 1.3.12

### Patch Changes

- @seed-design/figma@1.3.12

## 1.3.11

### Patch Changes

- 7ca8e6c: axios 의존성을 업데이트합니다.
- Updated dependencies [41cd943]
  - @seed-design/figma@1.3.11

## 1.3.10

### Patch Changes

- @seed-design/figma@1.3.10

## 1.3.9

### Patch Changes

- Updated dependencies [72dfd8f]
  - @seed-design/figma@1.3.9

## 1.3.8

### Patch Changes

- 9f11b31: SEED Figma MCP에 `find_nodes` 도구를 추가합니다. 하위 레이어를 이름(정규식)으로 검색하여 목록을 반환합니다.
- Updated dependencies [7cbe9f3]
  - @seed-design/figma@1.3.8

## 1.3.7

### Patch Changes

- 9f039c5: Figma MCP 플러그인이 MCP 웹소켓 서버에 연결할 수 없던 문제를 해결합니다.
- Updated dependencies [534eb1c]
  - @seed-design/figma@1.3.7

## 1.3.6

### Patch Changes

- @seed-design/figma@1.3.6

## 1.3.5

### Patch Changes

- Updated dependencies [d6df976]
  - @seed-design/figma@1.3.5

## 1.3.4

### Patch Changes

- Updated dependencies [934a877]
  - @seed-design/figma@1.3.4

## 1.3.3

### Patch Changes

- @seed-design/figma@1.3.3

## 1.3.2

### Patch Changes

- Updated dependencies [934bea0]
  - @seed-design/figma@1.3.2

## 1.3.1

### Patch Changes

- 2f9690a: MCP를 Node.js 프로젝트에서 직접 구성할 수 있도록 `registerTools`를 비롯한 export를 추가합니다.

## 1.3.0

### Minor Changes

- 423d604: Figma Personal Access Token을 활용하여 WebSocket 서버와 Figma 플러그인 없이 MCP 일부 기능을 활용할 수 있도록 합니다. `--mode` 옵션을 통해 필요한 도구만 등록할 수 있습니다.

## 1.2.1

### Patch Changes

- Updated dependencies [15d9587]
  - @seed-design/figma@1.2.1

## 1.2.0

### Patch Changes

- 41c4e31: MCP `get_node(s)_info` 및 `get_node_react_code` 툴 호출이 실패하는 경우 Figma 라이브러리 업데이트 안내를 추가합니다.
- Updated dependencies [a58022d]
- Updated dependencies [a0e40ca]
- Updated dependencies [358a1e4]
  - @seed-design/figma@1.2.0

## 1.1.19

### Patch Changes

- @seed-design/figma@1.1.19

## 1.1.18

### Patch Changes

- Updated dependencies [e92892a]
  - @seed-design/figma@1.1.18

## 1.1.17

### Patch Changes

- @seed-design/figma@1.1.17

## 1.1.16

### Patch Changes

- @seed-design/figma@1.1.16

## 1.1.15

### Patch Changes

- @seed-design/figma@1.1.15

## 1.1.14

### Patch Changes

- Updated dependencies [c1f818f]
  - @seed-design/figma@1.1.14

## 1.1.13

### Patch Changes

- @seed-design/figma@1.1.13

## 1.1.12

### Patch Changes

- Updated dependencies [6d680ba]
  - @seed-design/figma@1.1.12

## 1.1.11

### Patch Changes

- b58ac46: Figma MCP가 `export_node_as_image` 툴과 `clone_node` 툴 호출 후 반환 결과를 정상적으로 파싱하지 못하는 문제를 수정합니다.

## 1.1.10

### Patch Changes

- Updated dependencies [23e9246]
  - @seed-design/figma@1.1.10

## 1.1.9

### Patch Changes

- @seed-design/figma@1.1.9

## 1.1.8

### Patch Changes

- @seed-design/figma@1.1.8

## 1.1.7

### Patch Changes

- @seed-design/figma@1.1.7

## 1.1.6

### Patch Changes

- @seed-design/figma@1.1.6

## 1.1.5

### Patch Changes

- @seed-design/figma@1.1.5

## 1.1.4

### Patch Changes

- @seed-design/figma@1.1.4

## 1.1.3

### Patch Changes

- Updated dependencies [d986fd5]
  - @seed-design/figma@1.1.3

## 1.1.2

### Patch Changes

- Updated dependencies [4c5d7c4]
  - @seed-design/figma@1.1.2

## 1.1.0

### Patch Changes

- Updated dependencies [191005f]
  - @seed-design/figma@1.1.0

## 1.0.7

### Patch Changes

- @seed-design/figma@1.0.7

## 1.0.6

### Patch Changes

- Updated dependencies [6aafce0]
  - @seed-design/figma@1.0.6

## 1.0.5

### Patch Changes

- @seed-design/figma@1.0.5

## 1.0.3

### Patch Changes

- Updated dependencies [ac1fd00]
- Updated dependencies [8b07555]
  - @seed-design/figma@1.0.3

## 1.0.2

### Patch Changes

- @seed-design/figma@1.0.2

## 1.0.1

### Patch Changes

- @seed-design/figma@1.0.1

## 1.0.0

### Major Changes

- 34f92f2: 🌱 SEED Design 패키지의 첫 메이저 버전을 출시합니다.

### Patch Changes

- Updated dependencies [34f92f2]
  - @seed-design/figma@1.0.0

## 0.2.5

### Patch Changes

- Updated dependencies [bef65a6]
  - @seed-design/figma@0.2.5

## 0.2.4

### Patch Changes

- Updated dependencies [afdd1ee]
  - @seed-design/figma@0.2.4

## 0.2.3

### Patch Changes

- @seed-design/figma@0.2.3

## 0.2.1

### Patch Changes

- @seed-design/figma@0.2.1

## 0.2.0

### Patch Changes

- @seed-design/figma@0.2.0

## 0.1.15

### Patch Changes

- @seed-design/figma@0.1.15

## 0.1.14

### Patch Changes

- Updated dependencies [f806356]
- Updated dependencies [1982494]
  - @seed-design/figma@0.1.14

## 0.1.13

### Patch Changes

- @seed-design/figma@0.1.13

## 0.1.12

### Patch Changes

- @seed-design/figma@0.1.12

## 0.1.11

### Patch Changes

- Updated dependencies [9993e0e]
  - @seed-design/figma@0.1.11

## 0.1.10

### Patch Changes

- Updated dependencies [aa40f66]
  - @seed-design/figma@0.1.10

## 0.1.9

### Patch Changes

- Updated dependencies [5a025b7]
- Updated dependencies [f9379e0]
  - @seed-design/figma@0.1.9

## 0.1.8

### Patch Changes

- Updated dependencies [2e2cc53]
  - @seed-design/figma@0.1.8

## 0.1.7

### Patch Changes

- @seed-design/figma@0.1.7

## 0.1.6

### Patch Changes

- @seed-design/figma@0.1.6

## 0.1.5

### Patch Changes

- @seed-design/figma@0.1.5

## 0.1.4

### Patch Changes

- @seed-design/figma@0.1.4

## 0.1.3

### Patch Changes

- @seed-design/figma@0.1.3

## 0.1.2

### Patch Changes

- 7b2c0f3: Updated dependencies
  - @seed-design/react@0.1.1
- Updated dependencies [7b2c0f3]
  - @seed-design/figma@0.1.2

## 0.1.1

### Patch Changes

- @seed-design/figma@0.1.1

## 0.1.0

### Patch Changes

- @seed-design/figma@0.1.0

## 0.0.41

### Patch Changes

- @seed-design/figma@0.0.41

## 0.0.40

### Patch Changes

- 5a55fb3: Instance Swap의 대상 노드가 visible: false일 때 REST API에서 원본 컴포넌트 정보를 제공하지 않아 발생하는 참조 오류를 수정합니다.
- Updated dependencies [5a55fb3]
  - @seed-design/figma@0.0.40

## 0.0.39

### Patch Changes

- @seed-design/figma@0.0.39

## 0.0.38

### Patch Changes

- @seed-design/figma@0.0.38

## 0.0.35

### Patch Changes

- @seed-design/figma@0.0.35

## 0.0.34

### Patch Changes

- @seed-design/figma@0.0.34

## 0.0.33

### Patch Changes

- @seed-design/figma@0.0.33

## 0.0.31

### Patch Changes

- @seed-design/figma@0.0.31

## 0.0.30

### Patch Changes

- @seed-design/figma@0.0.30

## 0.0.29

### Patch Changes

- @seed-design/figma@0.0.29

## 0.0.28

### Patch Changes

- Updated dependencies [b3da758]
  - @seed-design/figma@0.0.28

## 0.0.27

### Patch Changes

- Updated dependencies [4133c5e]
  - @seed-design/figma@0.0.27

## 0.0.25

### Patch Changes

- c8a6d41: codegen 결과물이 import 문을 함께 반환하는 기능을 추가합니다.
- Updated dependencies [c8a6d41]
  - @seed-design/figma@0.0.25

## 0.0.24

### Patch Changes

- @seed-design/figma@0.0.24

## 0.0.23

### Patch Changes

- bf38ec2: 기본적으로 local-default 채널을 사용하도록 변경합니다. join_channel을 매 세션마다 요청할 필요를 없앱니다.
  - @seed-design/figma@0.0.23

## 0.0.22

### Patch Changes

- 6c0133a: 커스텀 컴포넌트를 등록할 수 있도록 extend.componentHandlers 설정을 제공합니다.
- Updated dependencies [6c0133a]
  - @seed-design/figma@0.0.22

## 0.0.21

### Patch Changes

- e368c69: 패키지 의존성을 최신화합니다.
- Updated dependencies [b167e95]
- Updated dependencies [2f2f9b3]
- Updated dependencies [4d34760]
- Updated dependencies [e368c69]
  - @seed-design/figma@0.0.21

## 0.0.20

### Patch Changes

- Updated dependencies [38ece6a]
  - @seed-design/figma@0.0.20

## 0.0.19

### Patch Changes

- @seed-design/figma@0.0.19

## 0.0.18

### Patch Changes

- 4619fde: 번들에 의도치 않은 외부 의존성이 포함되는 문제를 수정합니다.
- Updated dependencies [b28303c]
  - @seed-design/figma@0.0.18

## 0.0.17

### Patch Changes

- @seed-design/figma@0.0.17

## 0.0.16

### Patch Changes

- 7671445: npx, bunx로 사용하기 쉽도록 bin 진입점을 통합합니다.
  experimental 기능을 플래그로 분리합니다.

## 0.0.15

### Patch Changes

- Updated dependencies [4511814]
  - @seed-design/figma@0.0.15

## 0.0.6

### Patch Changes

- @seed-design/figma@0.0.6

## 0.0.5

### Patch Changes

- @seed-design/figma@0.0.5

## 0.0.4

### Patch Changes

- @seed-design/figma@0.0.4

## 0.0.3

### Patch Changes

- Updated dependencies [9ff6487]
  - @seed-design/figma@0.0.3

## 0.0.2

### Patch Changes

- 1d9e06a: SEED Design의 MCP 서버를 제공합니다.
- Updated dependencies [1d9e06a]
  - @seed-design/figma@0.0.2
