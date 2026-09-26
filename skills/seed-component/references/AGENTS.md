# skills/seed-component/references

`seed-component` Skill의 분기 절차와 여러 레이어가 재사용하는 판단 기준 모음이다. `SKILL.md`가 직접 가리키는 분기 절차 문서는 `component-map.md`, `api-parity.md`, `color-token-analysis.md`, `implementation-workflow.md`, `lynx-docs.md`이고, 나머지는 이 문서들이 필요할 때 연결한다.

## 규칙

- 규칙을 추가하기 전에 같은 규칙이 다른 reference에 있는지 찾는다 → 있으면 가장 직접적인 문서 한 곳에만 두고 다른 문서에는 링크만 남긴다.
- `scripts/`의 CLI 인자·JSON 필드 설명은 해당 분기 절차 문서 한 곳에만 둔다.
- 구현 명령서가 아니라 판단 기준을 쓴다: 언제 이 패턴을 쓰는가, 어떤 trade-off가 있는가. 새 규칙에는 rootage, recipe, react, snippet, docs 중 어느 레이어 판단에 영향을 주는지 드러낸다.
- 질문 축(아키텍처 결정, API 설계, React 패턴, recipe 패턴 등)이 다르면 파일을 나눈다. 파일명은 kebab-case다.
- 특정 컴포넌트 이름을 제목·파일명에 넣지 않는다 → 범용 원칙으로 쓰고, 예시가 필요하면 규칙을 설명하는 짧은 예시만 둔다.
