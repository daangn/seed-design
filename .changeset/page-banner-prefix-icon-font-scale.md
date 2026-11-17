---
"@seed-design/css": minor
"@seed-design/lynx-css": minor
"@seed-design/rootage-artifacts": minor
---

Page Banner의 `prefixIcon`이 폰트 스케일링에 맞춰 함께 커지고 작아져, 글자 크기를 키워도 텍스트 첫 줄과 세로 정렬을 유지합니다.

- 아이콘 크기와 위쪽 여백이 텍스트와 같은 배율 한계(`--seed-font-size-limit-min`·`--seed-font-size-limit-max`) 안에서 변합니다.
- 기본 글자 크기에서는 이전과 같은 크기(16px)와 위치로 렌더링됩니다.
- `suffixIcon`과 닫기 버튼 아이콘은 이전처럼 고정 크기입니다.
