---
"@seed-design/react-navigation-menu": minor
"@seed-design/react": minor
---

NavigationMenu 컴포넌트를 추가합니다.

hover / click / focus로 여는 site navigation용 flyout 컴포넌트입니다. `role="menu"`가 아니라 Disclosure 패턴(`button[aria-expanded]` + 링크 + `aria-current`)을 따르며, 기존 Menu 레시피를 재사용해 스타일링합니다. hover는 마우스 포인터에만 동작하고 터치에서는 click으로 폴백합니다.

Side Navigation이 접힌(rail) 상태에서 하위 메뉴를 보여주는 flyout으로 이 컴포넌트를 사용합니다.
