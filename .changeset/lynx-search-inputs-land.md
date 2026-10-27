---
"@seed-design/lynx-css": minor
"@seed-design/lynx-react": minor
---

Lynx `SearchInput`을 추가합니다. 검색어를 입력하고 제출하는 입력 필드이며, 화면 상단에서는 `npx @seed-design/cli@latest add ui:search-bar`로 설치하는 `SearchBar`와 함께 사용합니다.

- `SearchInput.Input`은 `confirm-type="search"`로 렌더링하고, 키보드의 검색 키(`bindconfirm`)를 누르면 `SearchInput.Root`의 `onSubmit`을 현재 값과 함께 호출합니다. 제출 뒤에는 입력의 focus를 해제하며, `blurOnSubmit={false}`로 유지할 수 있습니다.
- `SearchInput.ClearButton`은 값이 있을 때만 렌더링되며, uncontrolled 상태에서도 값을 비웁니다. `ignore-focus`로 탭이 입력의 focus를 가져가지 않게 합니다.
- `SearchInput.Input`과 `SearchInput.ClearButton`에 `accessibility-label`이 없으면 경고합니다.
