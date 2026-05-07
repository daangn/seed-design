# packages/react/src/components

## 디렉토리 개요

`packages/react`의 실제 컴포넌트 구현이 모여 있는 핵심 디렉토리다. 상위 `packages/react/AGENTS.md`의 공통 규칙 위에서, 컴포넌트별 public surface와 내부 구현 경계를 더 구체적으로 다룬다.

## 파일 작성 컨벤션

- 컴포넌트별 디렉토리는 `PascalCase`를 사용하고, 기본 파일은 `{ComponentName}.tsx`, `{ComponentName}.namespace.ts`, `index.ts` 조합을 따른다.
- 실제 구현은 `{ComponentName}.tsx`에 두고, namespace 단축 이름은 `{ComponentName}.namespace.ts`, 공개 re-export는 `index.ts`에 둔다.
- helper slot이 내부 구현에만 필요하면 별도 파일 분리보다 같은 구현 파일 안에 두고 export surface에서 숨기는 쪽을 우선 검토한다.

## 코드 작성 컨벤션

- public export는 사용자에게 의미가 분명한 slot만 기본 노출한다.
- namespace export도 같은 기준을 따른다. 짧은 이름이 필요하더라도 animation/layout helper slot은 기본적으로 숨긴다.
- helper slot을 공개하려면 direct composition이나 styling escape hatch 같은 명확한 사용자 시나리오가 있어야 한다.
- compound component를 설계할 때는 React API만 닫지 말고 `docs/registry/ui` snippet surface가 어떤 convenience layer를 제공할지도 함께 생각한다.
- headless context가 제공하는 `stateProps`/slot props는 styled layer에서 다시 계산하지 않는다. `createWithStateProps([useHeadlessContext])`처럼 기존 context를 직접 재사용하고, 동일한 `data-*` props를 위한 중복 helper export는 만들지 않는다.
- headless primitive wrapper의 props는 hook props를 재사용한다. `ComponentItemProps extends UseComponentItemProps`처럼 한 source를 확장하고, 같은 prop을 컴포넌트 props에 다시 선언하지 않는다.
- headless hook prop이 discriminated union이면 styled wrapper도 union contract를 보존한다. mode별로 hook props를 재조합해야 할 때는 branch를 나누어 특정 mode에서 무효한 prop이 섞이지 않게 한다.
