# packages/qvism-preset

## 디렉토리 개요

**CSS Recipe를 정의**하는 패키지. `rootage`에서 생성된 토큰(`src/vars/`)을 사용하여 컴포넌트별 스타일을 정의한다. `bun qvism:generate`로 `css/recipes`에 CSS를 생성한다.

## 파일 작성 컨벤션

- `src/recipes/*.ts`: Recipe 정의 (**소스**)
- `src/vars/*.ts`: 토큰 상수 (**생성** - 직접 수정 금지)
- `src/utils/*.ts`: 유틸리티 함수

## 코드 작성 컨벤션

- Recipe 이름: kebab-case (예: `action-button`)
- Pseudo 선택자: `active` (hover 대신, 모바일 우선), `disabled`, `focus`, `checked` 등
- 토큰 참조: `vars.{variant}.{state}.{slot}.{property}`
