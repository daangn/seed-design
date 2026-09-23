# React와 Lynx 플랫폼 차이 판정 기준

API 이름이 다르다는 사실만으로 Lynx 구현 누락을 판단하지 않는다. 브라우저 DOM과 Lynx 네이티브 렌더러가 같은 사용자 결과를 서로 다른 방식으로 제공할 수 있기 때문이다.

## 판정 순서

1. `dimensions`에서 양쪽 관찰값과 `confidence`를 확인한다.
2. `platformDifferences.expected`에서 현재 Lynx 구현이나 문서에 명시된 플랫폼 제약을 확인한다.
3. `platformDifferences.needsReview`에서 한쪽에만 관찰된 값을 확인한다. `possiblyExplainedBy`가 있으면 그 항목에 기록된 정확한 관찰값과 연결된 제약, 대체 동작을 함께 확인한다.
4. 근거 파일을 직접 읽어 의도된 차이인지 실제 누락인지 결정한다.

`confidence: unknown`인 값은 누락으로 판정하지 않는다. 타입 상속, `Omit`, 외부 타입 또는 한쪽 원천 부재로 전체 공개 표면을 읽지 못한 상태다.

## 대표적인 정당한 차이

| 분류 | React 브라우저 환경 | Lynx 환경 | 판정 기준 |
| --- | --- | --- | --- |
| 요소 합성 | `asChild`와 DOM Slot으로 렌더링 요소를 교체한다. | 네이티브 `<view>`나 `<text>`를 직접 렌더링한다. | 현재 Lynx 구현이나 문서가 Slot 기반 합성을 제공하지 않는다고 명시하면 플랫폼 제약이다. |
| 접근성 속성 | `role`, `aria-label`, `aria-expanded` 같은 DOM ARIA 속성을 사용한다. | `accessibility-label`, `accessibility-role-description`, `accessibility-value` 같은 네이티브 속성을 사용한다. | 속성 이름이 달라도 같은 의미와 상태가 접근성 트리에 전달되는지 확인한다. |
| Heading | HTML `h1`~`h6`, `headingLevel`, `aria-level`로 문서 개요 단계를 표현한다. | `accessibility-heading`으로 heading 의미를 전달한다. | Lynx 네이티브 접근성 표면이 HTML heading level을 받지 않는다는 근거가 있으면 단계 prop 부재는 누락이 아니다. |
| 키보드 포커스 | `focus`, `focusVisible`, 방향키와 Home/End 탐색을 제공한다. | 네이티브 tap과 접근성 탐색을 사용한다. | 웹 키보드 포커스 모델이 없다는 근거가 있으면 웹 전용 상태와 키 이벤트 부재는 플랫폼 제약이다. |
| 반응형 스타일 | CSS `@media`와 반응형 variant를 사용한다. | viewport 단위, JavaScript 분기 또는 별도 Recipe 값으로 대응한다. | Lynx에서 `@media`를 지원하지 않는다는 근거가 있으면 동일 CSS variant 부재는 누락이 아니다. 대체 동작은 별도로 확인한다. |

현재 저장소의 공통 접근성 매핑은 `packages/lynx-react/src/types.ts`의 `LynxAccessibilityProps`에서 확인한다. 컴포넌트별 제약은 Lynx 구현 주석과 문서의 `Web Version Differences`, `Unsupported Lynx Features` 영역을 우선 근거로 삼는다.

## 제약으로 끝내지 않는 경우

플랫폼 제약은 같은 API를 강제로 추가하지 않아도 된다는 뜻이다. 다음 항목은 계속 확인한다.

- 접근 가능한 이름, 역할, 상태가 두 플랫폼에서 같은 사용자 결과를 만드는가.
- `asChild` 없이도 필요한 이벤트와 스타일을 안전하게 조합할 수 있는가.
- 키보드 포커스 대신 Lynx 네이티브 접근성 탐색과 tap 동작이 제공되는가.
- media query 대신 지원 화면 크기에서 같은 레이아웃 목적을 달성하는가.

`needsReview`는 플랫폼 제약 후보와 연결된 값도 제거하지 않는다. `possiblyExplainedBy`는 이름 패턴으로 찾은 검토 단서일 뿐이며, 대체 동작이 확인됐다는 뜻이 아니다. 이 목록은 곧바로 결함 목록이 아니라 추가 판정이 필요한 후보 목록이다.
