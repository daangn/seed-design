---
id: astro-mdx-jsx-prop-vnode
description: docs MDX 본문에 `[object Object]`가 보이거나, MDX 안 JSX prop(`TypeTable`의 description·type, `Card`의 `icon`)을 받는 컴포넌트를 `.astro`나 React로 새로 만들 때, 또는 같은 JSX prop을 두 번 렌더링했더니 두 번째에서 React 자식이 사라질 때 읽는다. `@fumadocs/astro` Astro MDX 모드에서 JSX prop 값의 모양과 그리는 방법, `.astro`로 써야 하는 MDX 컴포넌트의 조건을 다룬다.
scope: ["docs/src/mdx/**", "docs/lib/content/**"]
status: active
---

# MDX JSX prop은 MDX renderer로만 그린다

## 교훈과 다음 행동

- Astro MDX 모드에서 MDX 안 JSX prop은 `{ "astro:jsx": true, type, props }` 모양의 Astro vnode다. React prop으로도, `.astro` 표현식(`{node.description}`)으로도 그릴 수 없다 → `<RenderNode node={…} />`(`src/mdx/RenderNode.mdx`, 본문 `{props.node}` 한 줄)로 넘겨 MDX의 JSX renderer가 그리게 한다.
- JSX prop을 받는 MDX 컴포넌트는 `src/mdx/<Name>.astro`로 쓴다. 다른 컴포넌트의 JSX prop 안에 들어갈 수 있는 컴포넌트(`code` 등)도 `.astro`로 쓴다. 같은 vnode가 두 번 렌더링되면 React 컴포넌트 자식이 두 번째에서 사라진다.
- 등록 규칙의 원천은 `src/mdx/components.ts` 머리 주석이다.

## 발생 근거와 적용 조건

- 상황(2026-11-13, Astro 재이전 Phase 0 스파이크): `TypeTable.astro`의 `{node.description}`과 `Card.astro`의 `{icon}`이 `[object Object]`로 나왔다. `@astrojs/runtime` `renderChild`는 이 vnode를 처리하지 않는다. `RenderNode.mdx`로 바꾼 뒤 5쪽에서 `[object Object]` 0, type table 행 12/42/9가 렌더링됐다.
- 두 번 렌더링: TypeTable은 `type`을 요약 행과 펼침 영역에 두 번 그린다. `code`를 React `InlineCode`로 등록하면 두 번째가 `undefined`였고 `InlineCode.astro`(같은 class)로 바꾸자 사라졌다. 다른 React static 컴포넌트에서도 생기는지는 전수 확인하지 않았다.
- 적용 조건: `@fumadocs/astro@0.3.0`을 `components` 옵션 없이 쓰는 Astro MDX 모드, `astro@7.4.11`.

## 변경 이력

- 2026-11-18: Astro 재이전 스파이크 S2 근거로 기록했다.
