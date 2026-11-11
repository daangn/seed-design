---
id: fumadocs-typescript-node-runtime
description: "fumadocs-typescript 5.6 이상(TypeScript 7 sync API)을 쓰는 docs type table generator를 Bun에서 실행하거나 테스트할 때, 또는 `bun test`에서 `stdout._handle.fd` TypeError·`SyncRpcChannel` 오류를 조사할 때 읽는다. Next.js 빌드(Node)에서는 정상이고 Bun 런타임에서만 실패하는 조건과, 테스트에서 generator를 Node로 돌리는 방법, 선언 경로 대소문자 차이를 다룬다."
scope: ["docs/components/type-table/**", "docs/lib/source.tsx"]
status: active
---

# fumadocs-typescript 5.6+ generator는 Bun에서 돌지 않는다

## 교훈과 다음 행동

- `fumadocs-typescript` 5.6부터 generator가 ts-morph 대신 `typescript@7` sync API로 tsgo 자식 프로세스와 파이프 fd로 통신한다. Bun의 child_process는 `_handle.fd`를 주지 않아 `createProject`에서 `TypeError: undefined is not an object (evaluating 'stdout._handle.fd')`로 실패한다.
- 문서 빌드는 `next build`가 Node로 실행되므로 영향이 없다. `bun test`나 `bun <script>`에서 실제 타입 생성을 호출하는 코드만 실패한다.
- 테스트는 `bun test`를 유지하고 생성 부분만 Node로 넘긴다. `components/type-table/generator.test.ts`의 `runInNode`처럼 `Bun.build({ target: "node", packages: "external" })`로 generator를 번들한 뒤 `node --input-type=module --eval`로 실행하고 결과를 JSON으로 받는다. 번들은 `docs/` 아래에 둬야 외부 패키지가 `docs/node_modules`에서 해석된다.
- `transform`에서 받는 `symbol.declarations[n].path`는 정규화된 경로 키라 macOS에서는 소문자로 온다. 경로 정규식은 대소문자를 구분하지 않게 쓰거나 `declaration.getSourceFile().fileName`을 쓴다.
- TypeScript 7은 멤버를 선언 순서와 다르게 돌려줄 수 있다. prop 집합을 검증하는 테스트는 정렬해 비교한다.

## 발생 근거와 적용 조건

- 상황(2026-11-10): `@fumadocs/satteri` 0.7 업그레이드로 `fumadocs-typescript ^5.6.0`이 필요해져 docs도 5.6으로 올렸다.
- 확인: 같은 generator 호출이 `node`에서는 prop 목록을 돌려주고 `bun`에서는 위 TypeError로 끝났다. `bun test docs/components/type-table`의 생성 테스트 6개가 같은 오류로 실패했고, Node 실행으로 바꾼 뒤 통과했다.
- 확인: macOS에서 `declarations[0].path`는 `.../scratchpad/tsprobe/sub/base.ts`처럼 소문자였고 `getSourceFile().fileName`은 원래 대소문자를 유지했다. 12개 prop interface를 단독으로 생성해도 `style2`가 맨 앞에 왔다.
- 위험: Bun 실패를 generator 코드 버그로 오판하거나, 테스트를 빼서 실제 필터링 회귀를 놓친다.

## 변경 이력

- 2026-11-10: fumadocs 0.7 이관 작업에서 재현·해결을 확인하고 작성했다.
