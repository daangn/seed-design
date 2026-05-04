# examples/stackflow-spa

## 디렉토리 개요

SEED React 컴포넌트를 Stackflow SPA 환경에서 검증하기 위한 예제 앱. 각 컴포넌트 / feature 별로 `Activity*.tsx` 파일을 두고 실제 사용 시나리오를 보여준다. `src/seed-design/ui/`는 SEED CLI가 배포하는 snippet의 로컬 복사본 (`docs/registry/ui/`와 동기화).

## 파일 작성 컨벤션

- Activity 파일: `src/activities/Activity<Name>.tsx`, `PascalCase` 접두 `Activity`.
- Snippet 파일: `src/seed-design/ui/<kebab-case>.tsx`, `docs/registry/ui/<kebab-case>.tsx`의 복사본. `"use client"` 지시어만 제거하고 나머지는 완전히 동일해야 한다.
- 파일 하나당 하나의 activity를 `export default`로 내보낸다.

## 코드 작성 컨벤션

- Activity 컴포넌트는 `StaticActivityComponentType<"ActivityName">` 타입.
- 모든 activity는 `AppScreen` + `AppBar` 구조를 기본으로 쓴다 (기존 activity 참고).
- Stackflow params가 없는 activity는 `declare module "@stackflow/config"` 블록에서 `{}`로 선언.
- Box 기반 컴포넌트의 시각적 검증용 activity는 `ActivityHome`의 적절한 섹션에 링크를 추가한다.

## Activity 등록 체크리스트

새 activity를 만들 때 **네 군데** 모두 업데이트해야 한다. 한 군데라도 빠지면 타입 에러, 라우트 404, 또는 홈 화면에서 접근 불가.

1. **Activity 파일 생성**: `src/activities/Activity<Name>.tsx`
   - `declare module "@stackflow/config" { interface Register { Activity<Name>: {}; } }`
   - `const Activity<Name>: StaticActivityComponentType<"Activity<Name>"> = () => { ... }`
   - `export default Activity<Name>;`

2. **`src/stackflow/Stack.tsx`의 `components` 객체에 등록**:
   ```ts
   Activity<Name>: lazy(() => import("../activities/Activity<Name>")),
   ```
   알파벳 순서 유지.

3. **`src/stackflow/stackflow.config.ts`의 `activities` 배열에 라우트 등록**:
   ```ts
   { route: "/<kebab-case-name>", name: "Activity<Name>" },
   ```
   알파벳 순서 유지. 등록하지 않으면 `push()`는 호출되지만 URL 라우팅이 안 된다.

4. **`src/activities/ActivityHome.tsx`의 섹션에 링크 추가** (선택):
   ```ts
   { title: "<Display Name>", onClick: () => push("Activity<Name>", {}) }
   ```
   홈 화면에서 접근 가능하게 하려면 필수.

## Snippet 동기화

`src/seed-design/ui/*.tsx`는 `docs/registry/ui/*.tsx`와 같아야 한다 (첫 줄 `"use client";` 제거 제외). snippet을 수정할 때:

1. 원본 `docs/registry/ui/<file>.tsx` 수정
2. `examples/stackflow-spa/src/seed-design/ui/<file>.tsx`에 동일 변경을 적용 (첫 줄 `"use client";` + 빈 줄 제외)
3. `bun generate:all`로 `docs/public/__registry__/`의 생성 파일도 갱신
4. `diff` 로 `"use client"` 한 줄만 차이나는지 검증

## 검증

```sh
bun --filter @seed-design/stackflow-spa build
```

타입 에러나 라우트 불일치는 이 단계에서 잡힌다.
