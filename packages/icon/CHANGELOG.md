# @seed-design/icon

## 0.1.4

### Patch Changes

- 86ef6a4: update schema

## 0.1.2

### Patch Changes

- e73aa6f: version up karrot-ui-icon

## 0.1.1

### Patch Changes

- cff2c8a: # 한국어

  라이브러리 제공자가 `seed-icon`을 사용할 때 필요한 `provider`가 추가되었습니다.
  **라이브러리 제공자가 아닌 기존 프로젝트는 그대로 사용할 수 있습니다.**

  ### provider

  - `withContext`와 `contextPath` 옵션을 추가했습니다.
  - `withContext` 옵션은 `true`로 설정하면 `contextPath`에 설정된 경로로 `context`를 생성합니다.
  - 라이브러리 제공자는 유저가 어떤 sprite.svg 경로를 사용할 지 모릅니다. 어떤 loader를 쓰는지 라이브러리 제작자 입장에서는 알 수 없습니다.
  - 그래서 `seed-icon` 에서 제공되는 `provider`를 노출시켜 유저가 `spriteUrl`을 설정하도록 하였습니다.

  ### etc

  - 코드 리팩토링
  - Readme.md 내용 추가

  # English

  Added `provider`, which is required when a library provider uses `seed-icon`.
  **Existing projects that are not library providers can still be used as is**.

  ### provider

  - Added `withContext` and `contextPath` options.
  - The `withContext` option, when set to `true`, creates a `context` with the path set in `contextPath`.
  - The library provider doesn't know which sprite.svg path the user will use. The library provider doesn't know what loader user use.
  - So we expose the `provider` provided by `seed-icon` and let the user set the `spriteUrl`.

  ### etc

  - Code refactoring
  - Added `Readme.md` content

## 0.1.0

### Minor Changes

- 64d5540: ### Config

  - add `vite` config template
  - add `yaml schema` in config template

  ### Icon Component

  - change component span style to `inline-flex`
  - remove component props `width`, `height` and add `size` prop

  ### etc

  - logs more detail
  - update `readme`

## 0.0.8

### Patch Changes

- 4634f52: - change chalk to kleur
  - remove unnecessary options

## 0.0.7

### Patch Changes

- 7dcf86a: support monorepo

## 0.0.6

### Patch Changes

- 633ba69: remove assert

## 0.0.5

### Patch Changes

- 4ce85ad: version dataset, width, height
- 4ce85ad: assert json
- 4ce85ad: add size props
- 4ce85ad: update

## 0.0.4

### Patch Changes

- 53fde00: version dataset, width, height
- 53fde00: add size props
- 53fde00: update

## 0.0.3

### Patch Changes

- f1abcb5: add size props
- 89fb8bf: update

## 0.0.2

### Patch Changes

- a79399f: init project
- a79399f: fix svg relative url

## 0.0.1

### Patch Changes

- 8dbbbc8: init project
