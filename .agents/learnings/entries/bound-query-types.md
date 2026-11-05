---
id: bound-query-types
description: React 테스트에서 render()가 반환한 bound query의 타입 인자·matcher를 고치거나, 런타임 테스트는 통과하지만 TS2558 등 타입 오류가 남을 때 읽는다. 설치된 Testing Library의 query 선언 확인, 타입 좁히기와 별도 TypeScript 검증 기준을 다룬다.
scope: ["packages/react/**"]
status: active
related: ["verify-baseline-test-failures"]
---

# Testing Library bound query의 제네릭 지원을 가정하지 않는다

## 교훈과 다음 행동

- 설치된 버전에서 실제 호출 지점의 타입을 확인하고 타입 수정은 직접 컴파일러로 검증한다.
- `bun node_modules/typescript/bin/tsc --project packages/react/tsconfig.json --noEmit`을 실행한다. query의 타입 인자가 지원되지 않으면 반환 타입을 단언하지 말고 matcher의 비교 타입을 조정하거나 런타임 guard로 좁힌다.
  - 기존 테스트 때문에 전체 타입 검사가 실패하면 기준 브랜치의 원본을 compiler host에 공급해 진단을 비교한다. Drawer의 `useDrawer.test.tsx`에 있는 TS2683처럼 원래 있던 오류와 이번 변경의 오류를 구분하고, 배포된 선언의 공개 타입도 별도로 확인한다.

## 발생 근거와 적용 조건

- 상황: `render()`가 반환한 `getByTestId`에도 `getByTestId<HTMLDivElement>()`를 쓸 수 있다고 가정했다. 이 저장소의 bound query 타입은 타입 인자를 받지 않는다.
- 영향: 원래 matcher 타입 오류를 해결하지 못하고 TS2558을 추가했다. 런타임 테스트는 통과해 직접 타입 검사에서 발견했다.
- 피할 패턴: 라이브러리의 일반적인 사용법이나 런타임 테스트 통과만으로 타입 수정의 유효성을 판단하는 것.
- 위험: 원본 query와 `render()`에 바인딩된 query의 타입 차이를 놓쳐 빌드 오류가 남는다.

## 변경 이력

- 2026-09-28: `AGENT_LEARNINGS.md`의 같은 제목 항목을 이관했다(원문 commit `cecc3eac1f0a64930788f1606571246614a631e7`). 기존 근거를 보존했으며 이관 과정에서 재검증하지 않았다.
- 2026-09-28: frontmatter만으로 읽기 대상을 고를 수 있도록 대상·적용 조건·본문에서 다루는 판단을 보강했다. 실행 재검증은 하지 않았다.
