# docs/registry/ui

## 디렉토리 개요

문서와 CLI registry에서 함께 사용하는 **user-facing snippet** 모음이다. 사용자가 그대로 복사하거나 약간 수정해서 쓰는 public surface이므로, 단순한 내부 예시 코드보다 API 안정성과 사용성 판단이 더 중요하다.

## 파일 작성 컨벤션

- 파일명은 `kebab-case`를 사용하고, snippet 하나당 파일 하나를 기본으로 한다.
- snippet은 `"use client"` 여부, public prop type, 최상위 export를 한 파일 안에서 명확하게 드러낸다.
- low-level sub-component를 여러 개 그대로 re-export하기보다, 사용자가 가장 짧게 쓸 수 있는 wrapper를 먼저 만든다.

## 코드 작성 컨벤션

- convenience prop을 우선하는 경우:
  - 3개 이상 sub-component를 감춰야 한다
  - `title`, `description`, `suffixIcon`처럼 반복 구조가 명확하다
  - child 순서나 내부 마크업을 consumer가 자주 바꿀 필요가 없다
- low-level composition을 유지하는 경우:
  - rich content 자체가 핵심 사용 사례다
  - consumer가 child 순서와 구조를 자주 제어해야 한다
  - low-level wrapper라는 목적이 문서로 명확하다
- 자동 주입 icon이나 indicator가 있으면 override prop 또는 숨김 prop을 함께 제공한다.
- 하나의 시각적 affix 위치에 generic prop과 semantic prop을 동시에 열지 않는다. 예를 들어 broad content가 필요한 앞 슬롯은 `prefix` 하나를 우선하고, icon-only contract가 확정된 경우에만 `prefixIcon` prop을 둔다.
- recipe token 이름이 snippet prop 이름을 강제하지 않는다. `prefixIcon` token은 generic `prefix` 안의 `Icon` 스타일일 수 있으므로, API는 사용자가 이해하는 content contract 기준으로 정한다.
- `rootProps`, `headerProps` 같은 escape hatch는 실제 사용성이 분명할 때만 추가한다.
- `displayName`과 alias는 runtime API보다 우선순위가 낮다. 도입한다면 flat naming 또는 namespace style 중 하나를 정해 일관되게 유지한다.
- snippet을 바꾼 뒤에는 generated registry(`docs/public/__registry__/ui/*.json`)와 vendored snippet consumer를 함께 확인한다.
- 현재 vendored consumer의 대표 경로는 `examples/stackflow-spa/src/seed-design/ui/`이며, snippet API 변경 시 이 경로도 같이 동기화하는 것을 기본값으로 본다.
