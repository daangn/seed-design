---
description: llms.txt 컴파일 타임 핸들러 개발 가이드
alwaysApply: true
---

# AGENTS.md

## 디렉토리 개요

`docs/lib/llms`는 MDX의 JSX 태그를 llms.txt용 마크다운으로 바꾸는 **컴파일 타임 핸들러**를 담는다. `app/source.tsx`가 `remarkLlms`에 여기의 옵션을 넘겨 문서를 컴파일할 때 한 번 실행되고, 결과는 페이지의 `processed` 익스포트로 굳는다. 그 결과를 어떤 주소로 내보낼지는 `app/_llms`가 정한다.

## 파일 작성 컨벤션

- 핸들러는 태그 하나당 한 파일씩 `handlers/<태그명 kebab-case>.ts`로 둔다. 테스트는 옆에 같은 이름의 `.test.ts`.
- 읽는 시점까지 미뤄야 하는 태그는 `placeholders/`에 둔다. 여러 placeholder를 함께 보는 테스트만 `placeholders/placeholders.test.ts`에 모은다.
- 여러 핸들러가 쓰는 헬퍼는 역할 이름으로 최상단에 둔다(`markdown-table.ts`, `estree.ts`).
- 핸들러로 부를 수 없는 마크다운 렌더러도 최상단에 둔다(`type-table.ts`). `handlers/`는 `LLMHandler`만 담는다.
- `registry.ts`가 유일한 barrel file이다. 나머지는 파일 경로로 직접 import한다.
- 생성물이나 외부 패키지 데이터에 묶이는 입력은 fixture로 만들지 않는다(TECH.md 「테스트 작성」). 데이터가 바뀌면 핸들러가 멀쩡해도 테스트가 깨진다.

## 코드 작성 컨벤션

- 핸들러는 `LLMHandler`를, placeholder는 `LLMPlaceholder`를 구현한다. 둘 다 `registry.ts`에 등록해야 동작한다.
- 외부 데이터(토큰 아티팩트·아이콘 데이터)를 읽는 핸들러는 데이터를 인자로 받는 `create...Handler(data)`와, 실제 데이터를 물린 기본 인스턴스를 함께 내보낸다. 테스트는 합성 데이터로 만든다.
- 데이터는 정적 import나 빌드 시점 매니페스트에서 읽는다. 런타임에 파일 시스템을 뒤지면 Turbopack이 의존성을 추적하지 못하고, 번들된 빌드에는 그 경로가 없다.
- `render`가 `undefined`를 돌려주면 원본 JSX가 남는다. 데이터를 못 구했을 때는 태그를 남기는 쪽이 감싼 내용을 통째로 잃는 것보다 낫다.
- 핸들러 테스트는 `render`를 직접 부르지 말고 `render-test-utils.ts`를 지난다. 실수는 대부분 이음매에서 난다.

## 필수 작업 절차

1. 태그를 추가하면 `handlers/`(또는 `placeholders/`)에 모듈을 만들고 `registry.ts`에 등록한다.
2. `app/_llms/rule-elements.ts`의 `RULE_ELEMENT_NAMES`에 태그 이름을 추가한다.
3. 아래 검증을 통과시킨다.
   - `bun test docs/lib/llms docs/app/_llms` (저장소 루트에서)

## 변경되지 않는 중요 규칙

- `RULE_ELEMENT_NAMES`에 없는 태그는 구조 필터가 접어 핸들러에 노드가 오지 않는다. 조용히 사라지므로 `app/_llms/rule-elements.test.ts`가 두 목록을 맞물려 둔다.
- 노드 삭제는 `render`가 `""`를 돌려주는 것으로 표현할 수 없다. `defaultStringifier`가 반환값의 truthiness를 보고 기본 처리로 되돌아간다. `remove`로 선언하면 호스트가 `_stringify` 힌트로 미리 표시한다.
- `mdxAsPlaceholder`에 기대지 않는다. Satteri의 `remarkLlms`는 그 옵션을 흘려보내므로 앱에서는 조용히 무시된다. placeholder 디스패치는 `options.ts`의 `stringify`가 `placeholder()`를 직접 불러 처리한다.
- `remarkApplyLlmsFilter`는 태그를 만들어내는 플러그인들보다 뒤, `remarkLlms` 바로 앞에 있어야 한다. 앞에 두면 나중에 생성되는 태그에 `remove`가 걸리지 않는다.
- `<TypeTable>`은 이 레이어 밖에서 처리된다. `remarkAutoTypeTable`이 `type` 속성에 Shiki가 색칠한 JSX를 담아 핸들러가 읽을 표 데이터가 없으므로, `lib/satteri/remark-type-table-llms.ts`가 붙잡아 둔 props로 표를 다시 만들어 `_stringify`에 마크다운째 써 넣는다. 목록을 그리는 함수만 여기(`type-table.ts`)에 있다.
