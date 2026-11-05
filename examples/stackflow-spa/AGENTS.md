# examples/stackflow-spa

SEED React 컴포넌트를 Stackflow SPA에서 검증하는 예제 앱이다. 컴포넌트·기능별 `src/activities/Activity<Name>.tsx`가 사용 시나리오를 보여주고, `src/seed-design/ui/`는 `docs/registry/react/ui/` snippet의 vendored copy다.

## 검증

- `bun --filter @seed-design/stackflow-spa build`. `vite-plugin-checker`가 타입 오류를 빌드 실패로 올리므로 타입 오류와 라우트 등록 누락이 여기서 잡힌다. snippet을 바꿨을 때도 실행해 소비 코드가 깨지지 않았는지 확인한다.
- E2E → `e2e/AGENTS.md`

## 작업 절차

### Activity를 추가할 때

1–3 중 하나라도 빠지면 타입 오류나 라우트 404가 난다.

1. `src/activities/Activity<Name>.tsx`를 만든다. params가 없으면 `declare module "@stackflow/config" { interface Register { Activity<Name>: {}; } }`로 선언하고, `const Activity<Name>: StaticActivityComponentType<"Activity<Name>">`를 `export default`한다. 파일 하나에 activity 하나다.
2. `src/stackflow/Stack.tsx`의 `components`에 `Activity<Name>: lazy(() => import("../activities/Activity<Name>")),`를 알파벳 순 위치에 넣는다.
3. `src/stackflow/stackflow.config.ts`의 `activities`에 `{ route: "/<kebab-case-name>", name: "Activity<Name>" },`를 알파벳 순 위치에 넣는다. 빠뜨리면 `push()`는 호출되지만 URL 라우팅이 안 된다.
4. 홈 화면에 노출할 때만 `src/activities/ActivityHome.tsx`의 `navigationSections` 중 알맞은 섹션 `items`에 `{ title: "<Display Name>", ...to("Activity<Name>", {}) },`를 넣는다. Box 기반 컴포넌트의 시각 검증용 activity는 노출한다.

### Snippet 동기화

`src/seed-design/ui/<file>.tsx`는 `docs/registry/react/ui/<file>.tsx`에서 첫 줄 `"use client";`와 뒤 빈 줄만 뺀 사본이다.

1. 원본 `docs/registry/react/ui/<file>.tsx`를 고친다. 앱 쪽 사본을 임시로 우회 수정하지 않는다 → public snippet contract를 먼저 바로잡고 여기로 내려보낸다.
2. 같은 변경을 `examples/stackflow-spa/src/seed-design/ui/<file>.tsx`에 적용한다.
3. 루트 `AGENTS.md`「생성」대로 `bun docs:generate`를 실행한다.
4. `diff docs/registry/react/ui/<file>.tsx examples/stackflow-spa/src/seed-design/ui/<file>.tsx`의 차이가 `"use client";`와 빈 줄뿐인지 확인한다.

## 규칙

- activity는 `AppScreen` + `AppBar` 구조를 기본으로 쓴다.
- snippet이 있는 컴포넌트는 `@seed-design/react` 직접 import 대신 `seed-design/ui/*`를 쓴다.
- 컴포넌트가 제공하는 권장 layout을 먼저 보여준다. `Footer`, `Body`처럼 recipe가 gap·stretch·layout을 가진 slot에는 검증 목적 없는 layout wrapper를 넣지 않는다.
