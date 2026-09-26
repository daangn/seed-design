# docs/app/_llms

`app/source.tsx`의 remark 파이프라인이 만든 `processed` MDX를 MDX AST 룰로 정제해 llms.txt 텍스트를 만든다. 결과는 `llms-route.ts`가 서빙한다.

## 검증

- 변환 동작을 바꿨으면 `bun test docs/app/_llms`를 실행한다.

## 작업 절차

### 변환 동작을 바꿀 때

1. 새 컴포넌트 태그를 다루면 `rule-elements.ts`의 `RULE_ELEMENT_NAMES`에 먼저 추가한다. 목록에 없는 태그는 `processed`에서 접히고, 자식이 없으면 흔적도 남지 않는다. 룰이 정확해도 변환할 노드가 오지 않는다.
2. `rules/<컴포넌트명 kebab-case>-rule.ts`에 `rules/types.ts`의 `Rule`을 구현한다. `match`(대상 식별)와 `transform`(노드 변환)을 나눈다.
3. `rules/index.ts`의 `activeRules`에 넣는다. 룰 활성 순서는 이 배열 한 곳에서만 정한다.
4. 옆의 같은 이름 `.test.ts`에서 inline snapshot으로 룰을 검증한다.
5. 여러 룰의 상호작용이 바뀔 때만 `__fixtures__/pipeline/`에 fixture를 추가한다. 영향받은 단위·pipeline 테스트만 갱신한다.

## 규칙

### 룰 코드

- `normalizeLLMBody(content?: string): string` 시그니처를 바꾸지 않는다 → 다른 룰 목록으로 돌려야 하면 `normalizeLLMBodyWithRules`를 쓴다.
- 변환에 실패하면 예외를 전파하지 말고 원본 노드를 반환한다.
- 문자열 정규식 후처리 대신 AST를 변환한다.
- 여러 룰이 공유하는 헬퍼는 `-rule` 접미사 없이 역할 이름으로 둔다(`markdown-utils.ts`, `estree-utils.ts`).
- barrel은 `rules/index.ts` 하나뿐이다. 다른 모듈은 파일 경로로 직접 import한다.
- `rules/component-grid-manifest.ts`는 `docs/scripts/generate-component-grid-manifest.ts`의 생성물인데 `.gitattributes`에 없어 guard가 막지 않는다 → 직접 고치지 말고 `bun docs:generate`로 다시 만든다.

### fixture

- llms.txt 변환 품질의 기준은 fixture다. `__fixtures__/<룰 이름>/<케이스>.input.mdx`와 `.output.mdx`를 쌍으로 두고, 여러 룰이 함께 걸리는 케이스만 `__fixtures__/pipeline/`에 둔다.
- 생성물이나 외부 패키지 데이터에 묶이는 입력은 fixture로 만들지 않는다(`TECH.md`「테스트 작성」) → 합성 MDX 입력을 쓴다.
- fixture 파일을 읽어 비교할 때는 양쪽에 `test-utils.ts`의 `normalizeForAssert`(개행 정규화 + trim)를 적용한다. 기대값이 소스 안 문자열 리터럴이면 적용하지 않는다.
