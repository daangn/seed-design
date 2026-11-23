---
"@seed-design/css": patch
---

`--native-safe-area-inset-*`가 정의된 환경에서 `--seed-safe-area-*`가 `env(safe-area-inset-*)`보다 그 값을 우선해 사용합니다.

- `--native-safe-area-inset-*`가 정의되어 있지 않으면 이전처럼 `env(safe-area-inset-*)`를 사용합니다.
- `--seed-safe-area-*`를 직접 지정한 값은 이전처럼 가장 우선합니다.
