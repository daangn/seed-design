# @seed-design/codemod

코드 마이그레이션 도구

```shell
npx @seed-design/codemod --list
```

```shell
npx @seed-design/codemod <transform> <...경로> <옵션>
```

## 옵션

- `--list`
  - 사용 가능한 transform 목록을 보여줘요.
- `--log`
  - 로그를 파일로 저장해요.
  - `./`에 `combined.log`와 `error.log` 파일이 생성돼요.
- `--parser`
  - jscodeshift가 사용할 파서를 지정해요
  - `babel` | `babylon` | `flow` | `ts` | `tsx`
  - 기본값: `tsx`
  - 예시: `--parser=babel`
- [`--extensions`](https://jscodeshift.com/run/cli/#--extensionsext)
  - 변환할 파일 확장자를 지정해요.
  - 지정하지 않으면 `<경로>` 안의 `js,jsx,ts,tsx` 파일을 변환해요.
    - `d.ts`는 제외돼요.
  - 예시: `--extensions="ts,tsx"`
- [`--ignore-config`](https://jscodeshift.com/run/cli/#--ignore-configfile)
  - 변환하지 않을 파일 패턴이 정의된 파일을 지정해요.
  - 예시: `--ignore-config=".gitignore"`

## 지원하는 Transforms

### migrate-icons

```shell
npx @seed-design/codemod migrate-icons <...경로> <옵션>
```

```shell
npx @seed-design/codemod migrate-icons src/ui --extensions=ts,tsx
```

- 기존 아이콘 React 패키지를 참조하는 코드를 [새 패키지](https://github.com/daangn/seed-icon-v3/blob/main/packages/react/README.md)를 참조하도록 변환해요.
  - `@seed-design/icon` 또는 `@seed-design/react-icon` import source를 @daangn/react-icon으로 변환해요
- 아이콘 이름 변경에 따른 코드 수정을 수행해요
  - 예시: `IconStoryRegular` → `IconTriangleRightChatbubbleLeftLine`,

> [!IMPORTANT]
>
> - `@daangn/react-icon` 패키지 설치/업데이트와 이전 패키지 제거는 직접 해 주세요.

> [!CAUTION]
>
> - [import assertion](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-3.html#import-attributes) 등 deprecated된 문법이 있으면 파서에 따라 파싱 오류가 표시될 수 있어요.
> - 코드 변환 이후 몇 가지 사항을 직접 확인해야 해요. 자세한 내용은 [Notion 페이지](https://www.notion.so/daangn/12128c3a9f8f8063b569c897116c8f40)를 참고해주세요.
>   - 기존 아이콘 198개 중 5개 아이콘은, 신규 아이콘팩에 대응되는 아이콘이 있지만, 대응되는 아이콘이 적절한지 확인해야 해요.
>   - `--log` flag를 사용하면, 5개 아이콘이 사용된 경우 `error.log`에 기록돼요.

## 테스트

```shell
cd packages/codemod && yarn test
```
