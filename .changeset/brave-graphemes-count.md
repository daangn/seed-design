---
"@seed-design/lynx-react-text-field": patch
"@seed-design/lynx-react": patch
---

Text Field의 `maxGraphemeCount` 글자 수 계산에 쓰는 `unicode-segmenter`를 0.17로 업데이트합니다. 계산 속도가 빨라지고, 일부 이모지·인도계 문자 조합의 글자 경계가 `Intl.Segmenter`와 다르게 계산되던 문제가 수정됩니다.
