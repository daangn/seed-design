---
"@seed-design/css": minor
"@seed-design/react": major
"@seed-design/react-scale-feedback": minor
---

(BREAKING CHANGE: 아래 컴포넌트의 root 요소에서 직계 자식을 가리키는 선택자나 자식 노드를 직접 참조하는 코드가 있다면 `.seed-content-scale` 박스를 거치도록 수정해야 합니다.) 누르는 동안 배경은 그대로 두고 콘텐츠만 줄어드는 Content Scale을 적용합니다.

- `Accordion.Trigger`, `Menu.Item`, `NavigationMenu.Item`, `SwipeableMenuSheet.Item`, `MenuSheet.Item`, `PageBanner.Root`, `SegmentedControl.Item`, `CheckSelectBox.Root`, `RadioSelectBox.Item`, `Select.Trigger`, `Select.Item`의 root 요소 안에 콘텐츠를 감싸는 `<span class="seed-content-scale">`이 추가됩니다.
- `asChild`로 넘긴 자식 컴포넌트는 박스로 감싸진 children을 받습니다. children을 렌더하지 않는 자식 컴포넌트에서는 콘텐츠가 줄어들지 않습니다.
- `PageBanner.Root`는 root가 `button`일 때만 콘텐츠가 줄어듭니다.
- 커스텀 컴포넌트에 Content Scale을 적용할 수 있도록 `ContentScale` 컴포넌트를 추가합니다.
