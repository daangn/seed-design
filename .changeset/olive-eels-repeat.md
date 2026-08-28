---
"@seed-design/cli": patch
---

`docs` 명령어가 디자인 스펙·파운데이션·패턴·업데이트 문서를 찾을 수 있습니다.

문서 사이트 구조가 바뀌면서 `components`, `foundations`, `patterns`, `updates`가 최상위 섹션으로 분리됐는데, CLI가 읽는 문서 목록은 그 문서들을 여전히 `docs` 카테고리 아래에 모아 두고 있었습니다. 사이트에서 `/foundations/color`인 문서를 CLI로는 `docs/foundations/color`로 불러야 했고, 사이트에서 본 경로를 그대로 쓰면 실패했습니다. 이제 카테고리가 5개에서 10개로 나뉘어 사이트와 같은 구조를 따릅니다.

- `seed-design docs foundations/color`처럼 새 섹션 경로가 동작합니다.
- `get-started`가 카테고리로 잡힙니다. 이전에는 목록에 아예 없었습니다.
- 카테고리 개요 문서를 `seed-design docs react/overview`로 볼 수 있습니다. React·Lynx·Breeze·AI Integration·Get Started의 개요는 이전까지 문서 목록·llms-full.txt·CLI 어디에도 나오지 않았습니다.
- 같은 섹션에 제목이 겹치는 문서가 있으면 경로로 구분해 보여줍니다. 이전에는 파운데이션에 "Overview"가 셋 있어도 선택 목록에서 구분되지 않았습니다.
- `--raw`가 설정 파일의 `framework` 값과 무관하게 동작합니다. 이전에는 `framework`가 설정된 프로젝트에서 새 섹션을 조회하면 아무것도 출력하지 않고 종료했습니다.
- 이름이 정확히 일치하는 문서가 있으면 바로 보여줍니다. 이전에는 `action-button`을 조회해도 `floating-action-button`과 함께 선택 목록이 떴습니다.
- `spacing`처럼 `framework` 범위 밖에 있는 이름도 찾습니다.

**동작 변경**: `components/{name}`은 디자인 스펙 문서로 연결됩니다. React 구현 문서는 `react/components/{name}`으로 조회해주세요. 이름만 쓰는 `seed-design docs action-button`은 이전과 동일하게 설정된 `framework`의 문서를 찾습니다.

**동작 변경**: 출력에서 스니펫 링크 줄이 사라집니다. 이 줄은 문서 페이지 이름과 레지스트리 항목 이름이 우연히 같은지 보고 붙이던 것이라, 플랫폼 중립인 디자인 스펙 문서에 React 소스가 붙거나(`components/action-button`), 문서가 `text-field-input`과 `text-field-textarea`로 나뉜 `text-field`처럼 정작 그 스니펫을 설명하는 문서에는 안 붙었습니다. 스니펫 원본은 `seed-design add ui:action-button`으로 받아주세요. 레지스트리를 거치므로 의존성과 버전이 함께 맞춰집니다.

`ai-integration` 문서가 "컴포넌트"로 잘못 분류되던 문제와, Lynx 문서가 섹션 구분 없이 한 덩어리로 나오던 문제도 함께 고쳤습니다.
