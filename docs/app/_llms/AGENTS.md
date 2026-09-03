---
description: llms.txt 섹션 레지스트리와 라우트 가이드
alwaysApply: true
---

# AGENTS.md

## 디렉토리 개요

`docs/app/_llms`는 llms.txt로 내보낼 **섹션의 정의와 문서 조립**을 담는다. MDX를 LLM 친화 텍스트로 바꾸는 일 자체는 컴파일 타임에 `lib/llms`의 핸들러가 하고(`lib/llms/AGENTS.md` 참조), 이 폴더는 그 결과에 제목·출처·플랫폼 상태를 얹어 한 문서로 만든다. 입력인 `processed` 익스포트는 상위 `app/source.tsx`가 만들고, 완성된 문서는 `app/llms/[...slug]/route.ts` 하나가 서빙한다.

## 파일 작성 컨벤션

- `config.ts`가 섹션 레지스트리의 단일 진입점이다. 섹션의 콘텐츠 디렉토리·URL·라벨·설명을 한곳에 적는다.
- `config.ts`는 번들러 전용 모듈을 import하지 않는다. `scripts/generate-docs-index.ts`가 Next 밖에서 읽어야 한다. fumadocs 소스와 짝짓는 일은 `sources.ts`가 맡는다.
- barrel file을 두지 않는다. 모듈은 파일 경로로 직접 import한다.

## 코드 작성 컨벤션

- 섹션을 추가하면 `config.ts`의 `sectionConfigs`에 넣는다. `sources.ts`의 `Record<Section, ...>`가 소스를 안 붙인 섹션을 컴파일 에러로 잡는다.
- 라벨·설명·URL을 손으로 적지 않는다. 전부 레지스트리에서 읽는다. 손으로 적은 링크가 IA 개편 때 통째로 썩었다.
- 섹션 소스는 비동기 getter다(`getReactSource()`). 호출 결과가 아니라 getter를 넘긴다.
- 페이지 프론트매터는 `page.data.frontmatter.*`로 읽는다. `title`·`description`만 `page.data`에 직접 있다.

## 필수 작업 절차

1. 섹션을 추가·변경하면 `config.ts`와 `sources.ts`를 함께 고친다.
2. 새 MDX 컴포넌트를 문서에 도입하면 `lib/llms`에 핸들러를 만들고 `rule-elements.ts`의 `RULE_ELEMENT_NAMES`에 이름을 추가한다.
3. 아래 검증을 통과시킨다.
   - `bun test docs/app/_llms docs/lib/llms` (저장소 루트에서 — DOM preload가 `bunfig.toml`에 있다)
   - `cd docs && bun run generate:all`

## 변경되지 않는 중요 규칙

- `RULE_ELEMENT_NAMES`에 없는 컴포넌트는 구조 필터가 태그를 접어, 핸들러에 노드가 아예 오지 않는다. 출력에서 조용히 사라질 뿐 오류는 나지 않으므로 `rule-elements.test.ts`가 이 목록과 핸들러 레지스트리를 맞물려 둔다.
- 그 목록의 예외가 둘 있다. `CatalogGrid`는 핸들러 없이 태그째 남기고(`ELEMENTS_WITHOUT_RULE`), `TypeTable`은 반대로 목록에 넣지 않는다. 후자는 `lib/satteri/remark-type-table-llms.ts`가 표를 마크다운으로 직접 써 넣으므로 보존할 노드가 필요 없다.
- llms 주소는 문서 URL 앞에 `/llms`, 뒤에 `.txt`를 붙인 것이다. 이 규칙이 전부이므로 주소를 따로 적어 두지 않는다.
- 링크로 내보내는 주소는 페이지 URL이 아니라 `/llms/{...}.txt`다. 이 사이트는 정적 익스포트라 `Accept` 협상이 없어, 페이지 URL은 HTML로 응답한다.
- placeholder 마커는 페이지를 읽는 시점에 `renderLLMPlaceholders`로 채운다. 채우지 않은 마커는 NUL로 감싼 JSON 덩어리째 독자에게 나간다.
