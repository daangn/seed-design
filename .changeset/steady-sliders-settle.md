---
"@seed-design/lynx-react-slider": patch
"@seed-design/lynx-react": patch
---

Lynx `Slider`의 controlled 값을 최솟값으로 바꾸면 Value Indicator 위치 계산이 반복되어 `CallLepusMethod called too frequently` 경고가 발생하던 문제를 수정합니다.
