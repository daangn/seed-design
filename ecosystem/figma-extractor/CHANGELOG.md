# @seed-design/figma-extractor

## 2.0.0

### Major Changes

- 8a33b2f: 내부 의존성 `cosmiconfig`를 10으로 올려 TypeScript 7 환경에서 `figma-extractor.config.ts`를 불러오지 못하던 문제를 수정합니다. Node.js를 22.18 이상 또는 24 이상으로 업그레이드해야 합니다.

### Patch Changes

- 894e2b7: `figma-api` 의존성을 업데이트합니다.

## 1.1.3

### Patch Changes

- 270c93d: 라이선스를 Apache-2.0으로 명시했습니다. 기존에는 `license` 필드가 비어 있어 저장소 루트의 Apache License 2.0과 일치하지 않았고, 배포물에 `LICENSE`와 `NOTICE`가 포함되지 않아 이용 조건을 확인할 수 없었습니다.

  당근 로고를 비롯한 브랜드 리소스는 별도 가이드라인을 따르며, 당근을 사칭하거나 당근 서비스와 관련이 있는 것처럼 오인하게 하는 사용은 허용되지 않습니다. 자세한 내용은 `NOTICE` 파일을 참고해주세요.

## 1.1.2

### Patch Changes

- 91f2e12: CLI 기반 도구의 `cac` 의존성을 v7로 업데이트합니다.

  - `@seed-design/cli`와 `@seed-design/codemod`의 Node.js 요구사항을 `>=20.19.0`으로 맞춥니다.
  - `@seed-design/mcp`와 `@seed-design/figma-extractor`에서도 최신 `cac` 런타임을 사용합니다.

## 1.1.1

### Patch Changes

- 7ca8e6c: axios 의존성을 업데이트합니다.

## 1.1.0

### Minor Changes

- 15d9587: `@seed-design/figma-extractor` config 파이프라인에서 `fetchNodes`를 context의 일부로 제공합니다.

## 1.0.0

### Major Changes

- 34f92f2: 🌱 SEED Design 패키지의 첫 메이저 버전을 출시합니다.

## 0.0.5

### Patch Changes

- 99e7f2c: figma-extractor (Figma REST API 호출 결과를 파일로 저장하는 CLI 툴) 설정 파일 작성 방법을 개선합니다.

  - 사용자가 직접 API 호출부터 파일 저장까지의 파이프라인을 작성할 수 있습니다.

## 0.0.4

### Patch Changes

- e368c69: 패키지 의존성을 최신화합니다.

## 0.0.3

### Patch Changes

- Sort exports

## 0.0.2

### Patch Changes

- component 추출 추가, 로그 개선 등

## 0.0.1

### Patch Changes

- First release

## 0.0.1-alpha-20250124070042

### Patch Changes

- Alpha release

## 0.0.1-alpha-20250124065342

### Patch Changes

- Alpha release

## 0.0.1-alpha-20250124063758

### Patch Changes

- Alpha release

## 0.0.1-alpha-20250124061957

### Patch Changes

- Alpha release

## 0.0.1-alpha-20250124060425

### Patch Changes

- Alpha release
