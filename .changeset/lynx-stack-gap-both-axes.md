---
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: `wrap`을 사용하는 `HStack`·`VStack`의 줄 사이 간격을 확인해야 합니다. 기존 간격을 유지하려면 `HStack`에 `style={{ rowGap: "0px" }}`, `VStack`에 `style={{ columnGap: "0px" }}`을 지정해야 합니다.)

`HStack`과 `VStack`의 `gap`을 한 축에서 가로·세로 두 축에 적용하도록 변경합니다.

- 이전에는 `HStack`의 열 간격과 `VStack`의 행 간격에만 적용했습니다. 이제 줄바꿈된 `HStack`의 행 사이와 `VStack`의 열 사이에도 간격이 생깁니다.
- `style`의 `rowGap`·`columnGap`은 해당 축에서 `gap`보다 우선합니다.
