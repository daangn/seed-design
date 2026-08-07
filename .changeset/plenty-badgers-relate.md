---
"@seed-design/react-dismissible-layer": patch
---

Chrome 92 / iOS Safari 15.4 이전 버전에서 시트나 다이얼로그를 열 때 `Array.prototype.at` 부재로 `TypeError: layers.at is not a function` 크래시가 나던 문제를 수정합니다.
