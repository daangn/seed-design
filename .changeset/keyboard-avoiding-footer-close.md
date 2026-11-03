---
"@seed-design/lynx-react-keyboard-avoiding-scroll-view": patch
---

키보드가 닫힐 때 `KeyboardAvoidingScrollView`의 Footer와 Content가 한 번에 움직이던 문제를 수정합니다.

- 입력 밖을 누르거나 끌어서 키보드가 닫혀도 `KeyboardAvoidingScrollView.Footer`가 손을 뗄 때까지 제자리에 남지 않고 키보드와 함께 내려갑니다.
- 키보드가 닫힐 때 Footer와 Content가 iOS 키보드와 비슷한 곡선으로 부드럽게 내려갑니다.
