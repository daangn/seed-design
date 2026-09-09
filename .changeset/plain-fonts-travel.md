---
"@seed-design/css": minor
---

권장 폰트 스택을 `--seed-font-family` CSS 변수로 제공합니다.

- `base.css`를 불러온 뒤 `font-family: var(--seed-font-family)`로 참조할 수 있습니다.
- SEED가 이 값을 자동으로 적용하지는 않으므로, 적용할 지점은 직접 선택해야 합니다.
- Apple 외 플랫폼에서, Pretendard 웹폰트를 로드하는 경우 Pretendard를 사용할 수 있도록 `Apple SD Gothic Neo` 다음 순서에 `Pretendard Variable`과 `Pretendard`를 포함합니다.
