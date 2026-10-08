---
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: `wrap`을 사용하는 `HStack`·`VStack`의 줄 사이 간격을 확인해야 합니다. 기존 간격을 유지하려면 `HStack`에 `rowGap: "0px"`, `VStack`에 `columnGap: "0px"`을 지정해야 합니다.) `HStack`과 `VStack`의 `gap`을 가로·세로 두 축에 적용해 줄바꿈된 줄 사이에도 간격을 표시합니다. `style`의 `rowGap`·`columnGap`은 해당 축에서 `gap`보다 우선합니다.
