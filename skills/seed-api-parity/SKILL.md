---
name: seed-api-parity
description: SEED Design 저장소의 한 컴포넌트에서 React와 Lynx 공개 export, props, Recipe, 슬롯, 상태, 이벤트, 접근성, Registry와 문서 차이를 현재 체크아웃 기준으로 비교한다. 구현 누락과 브라우저·Lynx 플랫폼 제약을 구분할 때 사용한다.
---

# SEED API parity

`seed-component-map`이 찾은 실제 경로만 읽어 한 컴포넌트의 React와 Lynx 공개 표면을 비교한다. 파일을 만들거나 수정하지 않는다.

## 실행

저장소 안에서 컴포넌트 하나를 지정한다.

```bash
bun skills/seed-api-parity/scripts/api-parity.ts ProgressCircle
```

결과 JSON은 다음 순서로 읽는다.

1. `sources`에서 분석한 구현, 공개 API, Recipe, Registry, 문서 경로가 맞는지 확인한다. package 공개 API가 없는 Registry-only 컴포넌트는 `docs/registry/{platform}/ui/<name>.tsx`가 `sources.<platform>.publicApi`에 있어야 한다. 공개 Props가 참조하는 로컬 Registry 타입 파일은 `referencedPublicApi`와 해당 차원의 `evidence`에 남는다.
2. `dimensions`에서 양쪽 관찰값, 공통 값, `reactOnly`, `lynxOnly`, 근거 경로를 확인한다. Registry snippet의 exported `*Props`, 직접 선언 prop, 포함된 공개 action props와 `onClick`·`bindtap`·`main-thread:*` 이벤트도 이 비교에 포함된다.
3. `platformDifferences.expected`에서 현재 Lynx 구현이나 문서에 명시된 플랫폼 제약을 확인한다.
4. `platformDifferences.needsReview`에서 한쪽에만 관찰된 값을 직접 검토한다. `possiblyExplainedBy`는 관련 있을 수 있는 `expected` ID와 그 규칙에 이름이 일치한 양쪽 값을 함께 반환한다.

`dimensions`는 원시 비교 결과를 유지한다. `needsReview`도 한쪽 관찰값을 빠뜨리지 않고 유지한다. `possiblyExplainedBy`가 있어도 검토 목록에서 제거하지 않는다. 브라우저 DOM과 Lynx 네이티브 환경의 차이로 설명할 수 있는지, 대체 동작이 같은 사용자 결과를 내는지 확인한 뒤 미구현 여부를 판정한다.

`confidence`는 다음처럼 읽는다.

- `confirmed`: 현재 컴포넌트 맵에서 존재 여부를 직접 확인했다.
- `partial`: 양쪽 공개 API 원천에서 직접 선언된 값을 읽어 비교했다. `extends`, `Omit` 또는 다른 공개 타입을 참조해 전체 상속 표면을 풀지 못해도 직접 선언 prop과 event는 이 근거로 유지한다.
- `unknown`: 한쪽 공개 API 원천이 없거나, 컴포넌트를 정확히 찾지 못했거나, 양쪽의 직접 선언 prop 근거도 부족하다. 이때 `reactOnly`와 `lynxOnly`는 차이를 단정하지 않고 비워 둔다.

## 플랫폼 차이 판정

다음 차이는 같은 이름의 API가 없더라도 기능 부족으로 보지 않을 수 있다.

- React의 `asChild`와 DOM Slot 합성 대신 Lynx 네이티브 요소를 직접 렌더링하는 경우
- DOM `role`과 `aria-*` 대신 `accessibility-*` 네이티브 접근성 속성으로 같은 의미와 상태를 전달하는 경우
- HTML heading level 대신 `accessibility-heading`으로 heading 의미를 전달하는 경우
- 브라우저의 키보드 focus와 `focusVisible` 대신 Lynx의 tap 및 네이티브 접근성 탐색을 사용하는 경우
- CSS media query 대신 viewport 단위, JavaScript 분기 또는 별도 Recipe 값으로 반응형 목적을 달성하는 경우

다만 플랫폼 제약은 대체 동작을 생략해도 된다는 뜻이 아니다. 접근 가능한 이름·역할·상태와 핵심 사용자 결과가 양쪽에서 유지되는지 확인한다. 세부 판정 기준은 [React와 Lynx 플랫폼 차이 판정 기준](references/platform-differences.md)을 따른다.

## 작업 연결

1. 먼저 [`seed-component-map`](../seed-component-map/SKILL.md)으로 정확한 컴포넌트 이름과 현재 표면을 확인한다.
2. React와 Lynx를 함께 다루면 이 스크립트를 실행한다.
3. package 구현이 없는 Registry-only 컴포넌트는 양쪽 snippet 경로가 `sources.publicApi`와 해당 차원의 `evidence`에 포함됐는지 확인한다.
4. `expected`는 현재 컴포넌트의 Lynx 소스나 문서에서 제약을 명시적으로 확인했을 때만 사용한다. `possiblyExplainedBy`는 판정이 아니라 검토 단서다. 근거 경로와 대체 동작을 직접 읽는다.
5. `unknown`과 `needsReview`를 누락으로 단정하지 않는다. 상속 타입과 대체 동작을 확인한 뒤 판정한다.
6. 확인한 차이를 [`seed-create-component`](../seed-create-component/SKILL.md)의 플랫폼 및 배포 표면 결정에 입력한다.

스크립트는 TypeScript 컴파일러를 사용하지 않는다. `extends`, `Omit`, 외부 타입에서 상속한 prop 전체를 풀지 않는다. 대신 양쪽 공개 API에 직접 선언된 prop이 있으면 props, state, event, accessibility 차원을 `partial`로 비교하고 상속 표면이 미해석 상태임을 `warnings`에 남긴다.
