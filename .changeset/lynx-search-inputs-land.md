---
"@seed-design/lynx-css": minor
"@seed-design/lynx-react": minor
---

Lynx `SearchInput`을 추가합니다. 검색어를 입력하고 제출하는 입력 필드입니다. `npx @seed-design/cli@latest add ui:search-input`으로 설치하는 `SearchInput` snippet으로 사용하고, 화면 상단에서는 `ui:search-bar`로 설치하는 `SearchBar`를 사용합니다. `ui:search-bar`를 설치하면 `ui:search-input`도 함께 설치됩니다. 레이아웃을 직접 조합할 때는 `SearchInput.Root`·`SearchInput.Input`·`SearchInput.ClearButton`을 사용합니다.

- `SearchInput.Input`은 `confirm-type="search"`로 렌더링하고, 키보드의 검색 키(`bindconfirm`)를 누르면 `SearchInput.Root`의 `onSubmit`을 현재 값과 함께 호출합니다. 제출 뒤에는 입력의 focus를 해제하며, `blurOnSubmit={false}`로 유지할 수 있습니다(native `confirm-enter`).
- `SearchInput.ClearButton`은 값이 있을 때만 렌더링되며, uncontrolled 상태에서도 값을 비웁니다. 입력의 focus는 누르기 전 상태를 유지합니다.
- `SearchInput.Input`과 `SearchInput.ClearButton`에 `accessibility-label`이 없으면 경고합니다.
