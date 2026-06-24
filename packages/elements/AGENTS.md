# AGENTS.md — packages/elements

## 디렉토리 개요

SEED Design 컴포넌트의 **Lit 기반 Web Components** 구현체(`@seed-design/elements`). `@seed-design/css`의 recipe/토큰을 스타일로 재사용하고, headless 로직은 Lit으로 재구현한다. 클래스 기반 글로벌 CSS 모델에 맞춰 **Light DOM**으로 렌더한다. 상위 파이프라인은 루트 `TECH.md`, 설계 배경은 저장소 루트의 계획 문서를 참고.

## 파일 작성 컨벤션

- 컴포넌트 클래스(`Seed<Name>`)는 `src/components/<Name>/`에 정의하고, `customElements.define`은 `src/define/<name>.ts`로 분리한다(pure class export + 등록 분리).
- `package.json` `sideEffects`에 `**/*.css`와 `define/**`만 등록 → 클래스만 import하면 tree-shake되고, `@seed-design/elements/define/<name>`을 import해야 태그가 등록된다.
- 태그명은 `seed-` prefix(`seed-action-button`). barrel(`index.ts`) import는 전체 CSS를 끌어오므로 소비자에게 권하지 않는다.

## 코드 작성 컨벤션

- **Light DOM**: `createRenderRoot() { return this; }`. shadow DOM·`<slot>`·`::part`·`static styles` 미사용.
- **스타일**: `@seed-design/css`의 recipe 함수(`(props) => className`)를 호출해 클래스를 부여한다. 토큰은 `var(--seed-*)`. 컴포넌트별 CSS는 recipe의 self-import로 따라오며 `all.css`는 쓰지 않는다.
- **Non-interactive(presentational)**: host에 recipe class만 부여하고 `render()`를 정의하지 않는다(author children 보존).
- **Interactive**: author children을 inner native 요소(`<button>`/`<a>`)로 wrap해 native focus·키보드·`:disabled`를 활용한다. host-as-button(수동 role/tabindex) 금지.
- **Form control**: `ElementInternals`(`static formAssociated = true`)로 폼에 참여한다. lion식 slotted-input 방식은 쓰지 않는다.
- **decorators 미사용**: reactive property는 `static properties = { ... }` + 생성자 초기화로 선언한다(Vite 트랜스파일 호환). variant 타입은 `@seed-design/css`의 recipe 타입에서 가져온다.
