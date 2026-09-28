---
"@seed-design/react": minor
---

`Box`의 `pl`, `pr`과 `bleed` 계열 속성(`bleed`, `bleedX`, `bleedY`, `bleedTop`, `bleedRight`, `bleedBottom`, `bleedLeft`)에 `"safeArea"` 값을 지정할 수 있습니다.

- 각 방향의 safe area inset을 padding이나 bleed 값으로 사용합니다. `pt`, `pb`는 기존처럼 `"safeArea"`를 받습니다.
- `p`, `px`, `py`는 양쪽에 같은 값을 적용하므로 `"safeArea"`를 받지 않습니다. 양쪽 모두 필요하면 `pl`, `pr`처럼 방향별 속성을 함께 지정합니다.
