# packages/react-headless

스타일 없는 상태·접근성·이벤트 로직을 컴포넌트별 독립 패키지(`packages/react-headless/<name>/`, `@seed-design/react-<name>`)로 제공한다. `packages/react`가 여기에 Recipe를 입힌다.

## 규칙

### 경계

- 스타일 로직을 넣지 않는다 → CSS·className 코드는 `packages/react`와 Recipe에 둔다. 접근성용 인라인 스타일(`visuallyHidden` 등)만 예외다.
- 상태는 `data-*` 속성(`data-checked`, `data-disabled` 등)으로 드러낸다.
- controlled·uncontrolled는 `@seed-design/react-use-controllable-state`의 `useControllableState`로 지원한다.
- 컴포넌트는 `forwardRef`로 감싼다.

### 훅과 컴포넌트 분담

컴포넌트 파일에는 훅이 만든 props·ref를 연결하는 render wiring만 남긴다.

- 재사용할 상태 전이, 키보드 인터랙션, DOM query, 내부 id 생성 → `use*` 훅으로 내린다.
- root/item/trigger/content로 나뉘는 compound stateful 컴포넌트 → root 상태는 `use<Name>`, item 상태는 `use<Name>Item`으로 나눈다. 예: `accordion/src/useAccordion.ts`, `useAccordionItem.ts`.
- leaf 컴포넌트(`AccordionTrigger` 등)의 이벤트 핸들러가 길어짐 → `use<Name>Item` 계열 훅으로 옮길 수 있는지 먼저 본다.
- 훅 반환 props → ARIA, keyboard handler, id, `data-*` state까지 담은 slot contract로 만들어 `packages/react`가 같은 로직을 다시 계산하지 않게 한다.
- DOM query가 필요함 → ref `Set` 등록보다 내부 id + `data-ownedby` 같은 안정적인 query contract를 먼저 검토한다. 예: `accordion/src/dom.ts`.

### 공개 API와 타입

- component props → 훅의 `Use*Props`를 확장하거나 재사용해 타입 contract가 한 곳에서 바뀌게 한다. 같은 prop을 손으로 다시 선언하지 않는다.
- 특정 mode에서만 유효한 prop → 런타임에서 무시하지 말고 discriminated union으로 막는다. 문서와 테스트도 같은 contract를 설명한다.
- 이진 옵션 → 단순하면 boolean prop, 구별되는 동작 상태가 있으면 discriminated union이나 enum을 쓴다. 실제 가능한 상태 수와 기존 API 호환성으로 고른다.
- APG가 heading hierarchy나 landmark 구조를 요구함 → native heading을 hardcode하기 전에 `hardcode`, `asChild`, `aria-level` override 중 어떤 escape hatch를 줄지 먼저 정한다.
- 새 훅 추상화 → 기존 primitive·훅 조합으로 안 되고 중복이 분명할 때만 만든다. 공개 API는 내부 구현의 단순함보다 consumer ergonomics와 기존 외부 API 일관성을 우선한다.
