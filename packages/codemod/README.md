# @seed-design/codemod

코드 마이그레이션 도구

## 사용

```shell
npx @seed-design/codemod <transform> <경로> <옵션>
```

## 지원하는 Transforms

### `migrate-icons`

- 기존 아이콘 React 패키지를 참조하는 코드를 [새 패키지](https://github.com/daangn/seed-icon-v3/blob/main/packages/react/README.md)를 참조하도록 변환해요.
  - `@seed-design/icon` 또는 `@seed-design/react-icon` import source를 @daangn/react-icon으로 변환해요
- 아이콘 이름 변경에 따른 코드 수정을 수행해요

> [!IMPORTANT] 중요
>
> - `@daangn/react-icon` 패키지 설치/업데이트와 이전 패키지 제거는 직접 수행해주세요.

> [!CAUTION] 주의
>
> - 코드 변환 이후 몇 가지 사항을 직접 확인해야 해요. 자세한 내용은 [Notion 페이지](https://www.notion.so/daangn/12128c3a9f8f8063b569c897116c8f40)를 참고해주세요.
> - 기존 아이콘 198개 중 6개 아이콘은, 신규 아이콘팩에 대응되는 아이콘이 **없어요**. 6개 아이콘이 사용된 경우 직접 대응해주세요.

#### 사용

```shell
npx @seed-design/codemod migrate-icons <경로> <옵션>
```

```shell
npx @seed-design/codemod migrate-icons src/ui --extensions=ts,tsx
```

- `src/ui` 디렉토리 내의 `ts, tsx` 파일을 변환해요.

#### 지원하는 옵션

- [`--extensions`](https://jscodeshift.com/run/cli/#--extensionsext)
  - 변환할 파일 확장자를 지정해요.
  - 지정하지 않으면 `<경로>` 안의 `js,jsx,ts,tsx` 파일을 변환해요.
  - e.g. `--extensions="ts,tsx"`
- [`--ignore-pattern`](https://jscodeshift.com/run/cli/#--ignore-patternglob)
  - 변환하지 않을 파일 패턴을 지정해요.
  - e.g. `--ignore-pattern="**/foo.*"`
- [`--ignore-config`](https://jscodeshift.com/run/cli/#--ignore-configfile)
  - 변환하지 않을 파일 패턴이 정의된 파일을 지정해요.
  - e.g. `--ignore-config=".gitignore"`

## 테스트

```shell
cd packages/codemod && yarn test
```
