# packages/react-headless

## 디렉토리 개요

**Headless UI 컴포넌트**를 제공하는 패키지. 스타일 없이 순수한 로직(상태 관리, 접근성, 이벤트 처리)만 담당한다. `packages/react`에서 이 패키지의 컴포넌트에 스타일을 적용한다.

## 파일 작성 컨벤션

- 컴포넌트 단위 디렉토리에서 훅, 프리미티브 구현, 멀티파트 바렐을 역할별 아티팩트로 분리한다.
- 파일은 역할이 겹치지 않도록 단일 책임으로 구성하고 공개 경로는 배럴을 통해 정리한다.

## 코드 작성 컨벤션

- **스타일 로직 금지**: CSS나 className 관련 코드 없어야 함. 단, `visuallyHidden` 등 접근성을 위한 인라인 스타일은 예외.
- `data-*` 속성으로 상태 표현 (data-checked, data-disabled 등)
- `useControllableState`로 controlled/uncontrolled 지원
- `forwardRef` 필수
- APG가 heading hierarchy나 landmark 구조를 요구하면 native heading을 hardcode하기 전에 `hardcode`, `asChild`, `aria-level override` 중 어떤 escape hatch를 줄지 먼저 정한다.
- 기존 primitive/hook 조합으로 해결할 수 있으면 재사용을 우선한다. 새 hook abstraction은 duplication이 분명할 때만 추가한다.
- public API는 내부 상태 구현의 단순함보다 consumer ergonomics와 외부 레퍼런스 일관성을 우선한다.
- 재사용 가능한 상태 전이, 키보드 인터랙션, DOM querying, 내부 id 생성 로직은 가능하면 `use*` 훅으로 내리고 컴포넌트는 hook이 만든 props와 refs를 연결하는 역할에 집중한다.
- `AccordionTrigger` 같은 leaf component에 이벤트 핸들러가 길어지기 시작하면 먼저 `useItem` 계열 훅으로 옮길 수 있는지 검토한다.
- root/item/trigger/content처럼 역할이 나뉘는 compound stateful 컴포넌트는 `useRootState`와 `useItemState`로 책임을 나누고, 컴포넌트 파일에는 render wiring만 남기는 방향을 기본값으로 본다.
- DOM query가 필요하면 ref `Set` 등록보다 내부 id + `data-ownedby` 같은 안정적인 query contract를 먼저 검토한다.
- hook이 반환하는 props는 ARIA, keyboard handler, ids, `data-*` state까지 포함한 "slot contract"를 목표로 하고, React 컴포넌트가 같은 로직을 다시 계산하지 않게 한다.
