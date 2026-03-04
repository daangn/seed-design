---
"@seed-design/react-slider": patch
---

마우스/키보드 사용 환경에서 Slider의 사용성을 개선합니다.

- Slider `valueIndicatorTrigger`에 `"auto"` 옵션을 추가하여 마우스를 사용하는 환경에서 thumb에 hover할 때, 터치 환경에서 thumb을 누를 때 value indicator가 표시되도록 하고 `valueIndicatorTrigger` 기본값을 `"active"`에서 `"auto"`로 변경합니다.
- Slider thumb에 focus할 때 value indicator가 표시되도록 수정합니다.
