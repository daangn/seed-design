---
name: seed-api-parity
description: SEED Design 저장소의 한 컴포넌트에서 React와 Lynx 공개 export, props, Recipe, 슬롯, 상태, 이벤트, 접근성, Registry와 문서 차이를 현재 체크아웃 기준으로 비교한다. 두 플랫폼 구현 전 공개 API 동등성을 확인하거나 플랫폼별 미지원 범위를 기록할 때 사용한다.
---

# SEED API parity

`seed-component-map`이 찾은 실제 경로만 읽어 한 컴포넌트의 React와 Lynx 공개 표면을 비교한다. 파일을 만들거나 수정하지 않는다.

## 실행

저장소 안에서 컴포넌트 하나를 지정한다.

```bash
bun skills/seed-api-parity/scripts/api-parity.ts ProgressCircle
```

결과 JSON의 `sources`에서 분석한 구현, 공개 API, Recipe, Registry, 문서 경로를 먼저 확인한다. `dimensions`는 양쪽 값, 공통 값, `reactOnly`, `lynxOnly`, 근거 경로를 반환한다.

`confidence`는 다음처럼 읽는다.

- `confirmed`: 현재 컴포넌트 맵에서 존재 여부를 직접 확인했다.
- `partial`: 양쪽 소스에서 직접 선언된 값을 읽어 비교했다.
- `unknown`: 한쪽 근거가 없거나, 컴포넌트를 정확히 찾지 못했거나, 상속 타입 때문에 전체 표면을 확인하지 못했다. 이때 `reactOnly`와 `lynxOnly`는 차이를 단정하지 않고 비워 둔다.

## 작업 연결

1. 먼저 [`seed-component-map`](../seed-component-map/SKILL.md)으로 정확한 컴포넌트 이름과 현재 표면을 확인한다.
2. React와 Lynx를 함께 다루면 이 스크립트를 실행한다.
3. `unknown`을 누락으로 단정하지 않는다. 결과의 근거 경로를 직접 읽고 상속 타입과 플랫폼 제약을 확인한다.
4. 확인한 차이를 [`seed-create-component`](../seed-create-component/SKILL.md)의 Delivery Surface Gate와 Analog Parity Check에 입력한다.

스크립트는 TypeScript 컴파일러를 사용하지 않는다. `extends`, `Omit`, 외부 타입에서 상속한 prop을 발견하면 관련 prop 차원을 `unknown`으로 낮추고 직접 확인한 값만 양쪽 관찰값에 남긴다.
