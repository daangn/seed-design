# packages/react/src/components

`@seed-design/react` 컴포넌트 구현 디렉터리다. 컴포넌트마다 `PascalCase` 폴더에 `{ComponentName}.tsx`와 `index.ts`를 둔다.

## 규칙

### Public surface

- 구현은 `{ComponentName}.tsx`나 역할별 구현 파일에 두고, 공개 re-export는 `index.ts`와 namespace 파일에서만 한다. `{ComponentName}.namespace.ts`는 compound 컴포넌트에 namespace 단축 이름이 필요할 때만 추가한다.
- export는 사용자에게 의미가 분명한 slot만 노출한다. animation·layout helper slot은 namespace에서도 숨기고, direct composition이나 styling escape hatch 같은 사용자 시나리오가 있을 때만 공개한다.
- compound 컴포넌트를 설계·변경함 → React API만 닫지 말고 `docs/registry/react/ui/` snippet이 어떤 convenience layer를 줄지 함께 정한다.

### Headless 재사용

- headless context의 `stateProps`·slot props → styled layer에서 다시 계산하지 않는다. `createWithStateProps([useHeadlessContext])`(`../../utils/createWithStateProps`)로 기존 context를 재사용하고, 같은 `data-*` props용 helper를 따로 export하지 않는다. 예: `NavigationMenu/NavigationMenu.tsx`.
- headless primitive wrapper의 props → `ComponentItemProps extends UseComponentItemProps`처럼 훅 props를 확장한다. 같은 prop을 다시 선언하지 않는다.
- headless 훅 prop이 discriminated union → styled wrapper도 union contract를 유지한다. mode별로 훅 props를 다시 조합해야 하면 branch를 나눠 특정 mode에서 무효한 prop이 섞이지 않게 한다.
