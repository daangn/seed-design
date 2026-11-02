---
"@seed-design/react-tabs": patch
---

`TabsList`를 portal로 `TabsRoot` 밖에 렌더링해도 인디케이터가 선택한 탭을 따라가도록 수정합니다. 인디케이터 위치를 담는 `--indicator-left`와 `--indicator-width`를 `TabsRoot` 대신 `TabsIndicator` 요소에 지정합니다.
