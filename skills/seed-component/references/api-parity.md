# React·Lynx API 비교

[컴포넌트 경로 조회](component-map.md)가 찾은 실제 경로만 읽어 한 컴포넌트의 React·Lynx 공개 표면을 비교한다. 파일을 만들거나 고치지 않는다.

## 실행

정확한 컴포넌트 이름이나 현재 표면이 불확실하면 먼저 경로를 조회한다. 한 번에 컴포넌트 하나를 지정한다.

```bash
bun skills/seed-component/scripts/api-parity.ts ProgressCircle
```

## 결과 읽기

1. `sources.<platform>`의 `implementation`, `publicApi`, `referencedPublicApi`, `recipes`, `registry`, `docs`가 맞는 경로인지 확인한다.
   - package 공개 API가 없는 Registry-only 컴포넌트 → `docs/registry/{platform}/ui/<name>.tsx`가 `publicApi`에 있어야 한다.
   - 공개 Props가 참조하는 로컬 Registry 타입 파일 → `referencedPublicApi`와 해당 차원의 `evidence`에 남는다.
2. `dimensions`(`exports`, `props`, `slots`, `variants`, `state`, `event`, `accessibility`, `registry`, `docs`)에서 양쪽 관찰값, `common`, `reactOnly`, `lynxOnly`, `evidence`를 확인한다. Registry snippet의 exported `*Props`, 직접 선언 prop, 포함된 공개 action props, `onClick`·`bindtap`·`main-thread:*` 이벤트도 비교에 들어간다.
3. `platformDifferences.expected`를 확인한다. 현재 컴포넌트의 Lynx 소스·문서에서 제약을 명시적으로 확인한 항목만 여기에 들어간다.
4. `platformDifferences.needsReview`의 한쪽 관찰값을 하나씩 직접 검토한다. `possiblyExplainedBy`는 관련 있을 수 있는 `expected` ID와 그 규칙에 이름이 일치한 양쪽 값을 돌려주는 검토 단서다 → 근거 경로와 대체 동작을 직접 읽는다.
5. `warnings`에서 미해석 상속 표면과 `unknown`으로 남은 차원의 이유를 확인한다.

`dimensions`는 원시 비교 결과이고, `needsReview`는 `possiblyExplainedBy`가 있어도 항목을 빼지 않는다. 브라우저 DOM과 Lynx 네이티브 환경의 차이로 설명되는지, 대체 동작이 같은 사용자 결과를 내는지 확인한 뒤 미구현 여부를 판정한다. `expected[].id`(`slot-composition`, `native-accessibility-properties`, `native-heading-semantics`, `keyboard-focus-model`, `css-media-queries`)별 판정 기준은 [React와 Lynx 플랫폼 차이 판정 기준](platform-differences.md)을 따른다.

## confidence

- `confirmed` → 현재 컴포넌트 맵에서 존재 여부를 직접 확인했다.
- `partial` → 양쪽 공개 API 원천에 직접 선언된 값만 비교했다. 스크립트는 TypeScript 컴파일러를 쓰지 않아 `extends`, `Omit`, 외부 타입에서 상속한 prop을 풀지 않는다. 직접 선언 prop이 있으면 props·state·event·accessibility 차원을 이 근거로 비교하고 상속 표면은 `warnings`에 미해석으로 남긴다.
- `unknown` → 한쪽 공개 API 원천이 없거나, 컴포넌트를 정확히 찾지 못했거나, 양쪽 직접 선언 근거가 부족하다. `reactOnly`·`lynxOnly`는 차이를 단정하지 않으려고 비워 둔다. 비어 있어도 차이가 없다는 뜻이 아니다.

`unknown`과 `needsReview`를 누락의 증거로 보고하지 않는다 → 상속 타입과 대체 동작을 확인한 뒤 판정한다.

## 결과 사용

- 비교만 요청받음 → 공통·의도한 플랫폼 차이·보완할 누락·미확인 항목을 근거 경로와 함께 반환하고 끝낸다.
- 구현 요청 안에서 사용함 → 확인한 차이를 [플랫폼 선택](platform-gate.md)과 [API 설계](api-design.md)의 배포 표면 결정에 넣는다.
