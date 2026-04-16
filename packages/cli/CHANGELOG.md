# @seed-design/cli

## 1.3.2

### Patch Changes

- 1e91bf6: `docs` 명령에 `--raw` 옵션을 추가합니다. llms.txt 내용을 순수 마크다운으로 출력하여 LLM 파이프나 스크립트에서 활용할 수 있습니다. `upgrade` 명령을 제거하고 `docs --raw` + 스킬 조합으로 대체합니다.

## 1.3.1

### Patch Changes

- 8f37e56: `docs` 명령어에서 경로를 잘못 입력했을 때 유사한 항목을 제안합니다.

  - 오타가 포함된 경로를 입력하면 가장 가까운 유효 경로를 알려줍니다. (예: `react/component/action-buton` → `react/components/action-button`)
  - 카테고리, 섹션, 아이템 각 단계에서 유사 후보를 자동 검색합니다.

- 0471a92: `upgrade` 명령어를 추가합니다.

  - 프로젝트에 설치된 `@seed-design/*` 패키지의 현재 버전과 최신 버전을 비교하고, 그 사이의 변경사항(changelog)을 확인할 수 있습니다.
  - `--raw` 플래그를 사용하면 UI 없이 순수 마크다운으로 출력되어 LLM 에이전트에 전달하기 적합합니다.
  - 패키지명은 shorthand(`react`) 또는 full name(`@seed-design/react`) 모두 지원합니다.

## 1.3.0

### Minor Changes

- d25a0d6: LLM 친화적 문서 링크를 위한 `docs` 명령어 추가

  - 컴포넌트 및 파운데이션에 대한 문서 URL, llms.txt URL, GitHub raw 스니펫 URL을 출력하는 `seed-design docs [query]` 명령어를 추가합니다.
  - 섹션/항목의 인터랙티브 선택과 쿼리를 통한 직접 검색을 모두 지원합니다.

## 1.2.2

### Patch Changes

- 50cd41e: - `seed-design compat` 명령어를 추가해 현재 프로젝트의 스니펫과 `@seed-design/react`, `@seed-design/css` 버전 호환성을 비대화형으로 점검할 수 있도록 개선합니다.
  - `add`, `add-all` 실행 시 스니펫의 요구 버전과 프로젝트 버전을 semver로 비교해, 호환되지 않는 항목을 경고하도록 개선합니다.
- 1af88d1: - CLI 실패 원인 표시를 개선하고 `--verbose` 상세 진단 출력을 추가합니다.
  - `seed-design.json`이 없을 때 외부 명령 실행 대신 내부 초기화 로직으로 설정 파일을 생성합니다.
  - 또한 `@clack/prompts`를 v1으로 업데이트하고 `init --default`를 `--yes` 호환 alias로 유지합니다.

## 1.2.1

### Patch Changes

- f7a6217: `--on-diff` flag를 추가하고 `--overwrite` flag를 `--on-diff=overwrite`로 대체합니다. `--on-diff=backup`을 사용하여 변경사항이 있는 모든 snippet에 대해 이전 파일을 유지할 수 있습니다.

## 1.2.0

### Minor Changes

- 21c6ca8: CLI add/add-all 명령 실행 시, 파일 변경사항을 보여주고 덮어쓰기/백업/그대로 두기 선택지를 제공합니다. `--overwrite` flag를 통해 이 과정을 건너뛰고 덮어쓰기를 선택할 수 있습니다.

## 1.1.0

### Minor Changes

- a6ae76f: telemetry 옵션을 추가합니다

## 1.0.0

### Major Changes

- 950c9e1: **`add` 명령어 사용 방식을 변경합니다.**

  - 항목 추가

  ```sh
  seed-design add ui:action-button breeze:animate-number # ui 이외 레지스트리의 항목도 추가할 수 있게 되었습니다.
  ```

  - 특정 레지스트리에 있는 모든 항목 추가

  ```sh
  seed-design add-all ui lib breeze
  ```

  - 모든 레지스트리의 모든 항목 추가

  ```sh
  seed-design add-all --all
  ```

  패키지 의존성 및 스니펫 의존성 설치 방식을 최적화합니다.

## 0.0.3

### Patch Changes

- 9b271d6: snippet의 deprecated 여부를 기록합니다. cli add 명령 실행 시 snippet 목록에서 deprecate 여부를 표시하고, `--all`로 모든 스니펫 추가 시 기본적으로 deprecated snippet을 제외합니다.

  ```sh
  seed-design add --all # deprecated snippet 제외
  ```

  ```sh
  seed-design add --all --include-deprecated # deprecated snippet 포함
  ```

## 0.0.2

### Patch Changes

- e368c69: 패키지 의존성을 최신화합니다.

## 0.0.1

### Patch Changes

- b64023c: Initial release of the next version of Seed Design.

## 0.0.0-alpha-20241204134404

### Patch Changes

- 에러메세지 보완 및 사용성 강화

## 0.0.0-alpha-20241113031935

### Patch Changes

- registry 기준으로 hook, util, ui 파일을 구분하여 설치해요.

## 0.0.0-alpha-20241101153412

### Patch Changes

- default resolve path를 `seed-design/ui`로 변경해요.

## 0.0.0-alpha-20241101030717

### Patch Changes

- url을 변경해요

## 0.0.0-alpha-20241031064135

### Patch Changes

- implement cli command `check-deprecated-icon-files`

## 0.0.0-alpha-20241031063855

### Patch Changes

- change BASE_URL

## 0.0.0-alpha-20241016030836

### Patch Changes

- add icon-shift command

## 0.0.0-alpha-20241014145845

### Patch Changes

- sync style chipTabs, Tabs to figma

## 0.0.0-alpha-20241014090620

### Patch Changes

- change baseURL, add prepack script

## 0.0.0-alpha-20241014090450

### Patch Changes

- change registry schema

## 0.0.0-alpha-20241014082802

### Patch Changes

- change registry path

## 0.0.0-alpha-20241014082441

### Patch Changes

- change baseURL

## 0.0.0-alpha-20241004093556

### Patch Changes

- prerelease

## 0.0.0-alpha-20241004093313

### Patch Changes

- bump
