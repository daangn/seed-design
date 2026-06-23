---
"@seed-design/cli": minor
---

`add`, `add-all` 명령어에 `--seed-react-version` 옵션을 추가합니다.

- 설치한 `@seed-design/react` 버전에 맞는 스니펫 레지스트리를 CLI가 자동으로 찾아줍니다. 정확한 `--baseUrl`을 직접 지정할 필요가 없습니다.
- `--baseUrl`, `--framework`보다 우선 적용됩니다.

```sh
npx @seed-design/cli@latest add --seed-react-version 1.2 ui:action-button
```
