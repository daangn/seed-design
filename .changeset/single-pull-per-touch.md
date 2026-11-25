---
"@seed-design/lynx-react-pull-to-refresh": patch
"@seed-design/lynx-react": patch
---

Lynx `PullToRefresh`를 iOS에서 한 번 당겼는데 `onPtrPullStart`·`onPtrPullEnd`가 여러 번 호출되던 문제를 수정합니다. 터치 도중 native 제스처가 끝났다가 다시 시작돼도 같은 터치 안에서는 당김을 새로 시작하지 않고, 첫 판정을 이어갑니다.
