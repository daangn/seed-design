---
"@seed-design/react": minor
---

검색어를 입력하고 제출하는 `SearchInput`을 추가합니다. Stackflow 화면에서는 `npx @seed-design/cli@latest add ui:search-bar`로 설치하는 `SearchBar`와 함께 사용합니다.

- `SearchInput.Root`의 `onSubmit`은 Enter를 누르면 현재 값과 함께 호출됩니다. IME 조합을 확정하는 Enter는 무시하고, 제출 뒤에는 입력의 focus를 해제합니다. `blurOnSubmit={false}`로 focus를 유지할 수 있습니다.
- `SearchInput.Root`는 `role="search"`를, `SearchInput.Input`은 `type="search"`와 `enterKeyHint="search"`를 가집니다. `SearchInput.Input`과 `SearchInput.ClearButton`에 `aria-label`이나 `aria-labelledby`가 없으면 경고합니다.
- `SearchInput.ClearButton`은 값이 있을 때만 렌더링되며, uncontrolled 상태에서도 값을 비웁니다.
