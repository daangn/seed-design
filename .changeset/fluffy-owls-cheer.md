---
"@seed-design/stackflow": patch
"@seed-design/css": patch
---

Stackflow와 함께 AppScreen 사용 시 최상위 AppScreen이 push/pop될 때, 이외의 AppScreen이 고유한 `transitionStyle`을 재생하는 문제를 수정합니다. 같은 스택 내에 여러 `transitionStyle`이 공존할 때 자연스러운 트랜지션을 제공하기 위해 최상위 AppScreen의 `transitionStyle`을 재생합니다. ([데모](https://seed-design.io/react/stackflow/app-screen#transition-styles))

- 예를 들면, `transitionStyle="fadeFromBottomAndroid"`인 0번 AppScreen 위에 `transitionStyle="slideFromLeftIOS"`인 1번 AppScreen이 push되는 경우, 0번 AppScreen이 `slideFromLeftIOS` 트랜지션을 재생하도록 수정합니다.
  - 0번 AppScreen이 자연스럽게 좌측으로 조금 밀려나며 어두워지고(`slideFromLeftIOS`) 1번 AppScreen이 우측에서 슬라이드 인(`slideFromLeftIOS`)
