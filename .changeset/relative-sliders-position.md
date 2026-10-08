---
"@seed-design/lynx-react": major
"@seed-design/lynx-css": major
---

(BREAKING CHANGE: thumb·tick·marker의 위치를 직접 지정했다면 `--slider-thumb-offset`·`--slider-tick-offset`·`--slider-marker-offset`을 각각 `--slider-thumb-offset-ratio`·`--slider-tick-offset-ratio`·`--slider-marker-offset-ratio`로 변경하고, 픽셀 값 대신 thumb 크기에 곱할 비율을 사용해야 합니다. `--slider-marker-color`를 사용했다면 marker의 `color` 스타일로 변경해야 합니다.) 슬라이더의 위치 보정을 크기 비율로 제공하여 첫 표시 뒤 thumb 위치가 움직이던 문제를 해결합니다.

직접 작성한 스타일에서는 `left: calc(var(--slider-thumb-left) + <thumb 크기> * var(--slider-thumb-offset-ratio))`처럼 thumb 크기와 비율을 곱합니다. tick·marker도 각각 `--slider-tick-offset-ratio`·`--slider-marker-offset-ratio`를 사용해 같은 방식으로 지정합니다. Value Indicator의 픽셀 위치 보정 변수는 유지합니다.

드래그 좌표는 `Slider.Track`이 아니라 `Slider.Root`의 가로 범위를 기준으로 계산합니다. Track을 Root보다 좁게 배치한 화면은 Root와 Track의 범위를 맞추거나 변경된 선택 범위를 확인해야 합니다.
