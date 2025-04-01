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
  - `./`에 `migrate-icons-combined.log`와 `migrate-icons-warnings.log` 파일이 생성돼요.
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
