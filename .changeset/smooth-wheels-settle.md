---
"@seed-design/lynx-react-loop-scroll": patch
"@seed-design/lynx-react": patch
---

Lynx `WheelPicker`를 튕기거나 놓았을 때 마지막 몇 px를 오래 기어가거나 느리게 놓으면 한 칸 이동에 수 초가 걸리던 문제를 수정합니다. 이제 놓은 속도에서 이어 감속해 항목에 바로 정착하고, 끝으로 빠르게 던지면 끝을 살짝 넘었다가 돌아옵니다.
