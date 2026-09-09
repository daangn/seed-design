---
"@seed-design/dom-utils": patch
"@seed-design/lynx-react": patch
"@seed-design/react": patch
"@seed-design/stackflow": patch
---

클래스 이름 조합 동작을 유지하면서 내부 의존성을 `cn`으로 교체합니다. 배포 코드에서는 문자열 결합 전용 `cn/lite`를 사용해 번들 크기를 줄입니다.
