---
"@seed-design/tailwind3-plugin": major
"@seed-design/tailwind4-theme": major
---

(BREAKING CHANGE: `sm:`·`md:`·`lg:`·`xl:` 클래스를 Tailwind 기본 breakpoint 기준으로 작성했다면 SEED breakpoint 기준으로 다시 확인하거나 SEED breakpoint를 끄세요. `2xl:`이 필요하면 Tailwind 설정에서 직접 정의해야 합니다.) Tailwind 반응형 변형에 SEED breakpoint를 기본으로 적용합니다.

- Tailwind 기본 breakpoint를 `@seed-design/css/breakpoints`와 같은 SEED breakpoint로 대체합니다. SEED를 업그레이드하면 Tailwind 변형의 전환점도 SEED 컴포넌트와 함께 바뀝니다.
- `2xl:` 변형을 제공하지 않습니다. Tailwind CSS 3에서는 `theme.extend.screens`로, Tailwind CSS 4에서는 `@theme`의 `--breakpoint-2xl`로 직접 정의하세요.
- Tailwind 기본 breakpoint를 계속 쓰려면 Tailwind CSS 3에서는 `seedPlugin({ breakpoints: false })`를 쓰세요. Tailwind CSS 4에서는 `@seed-design/tailwind4-theme` 뒤의 `@theme`에서 `--breakpoint-*`를 다시 선언하세요.
- `@seed-design/tailwind4-theme/breakpoints.css`는 빈 파일로 남습니다. 불러오고 있다면 지워도 되며, 다음 major 버전에서 제거됩니다.
- Tailwind 설정에 SEED breakpoint 값을 복제해 두었다면 지우세요.
