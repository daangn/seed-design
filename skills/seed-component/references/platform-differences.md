# React와 Lynx 플랫폼 차이 판정 기준

`api-parity.ts` 결과의 한쪽 전용 값이 의도한 플랫폼 차이인지 구현 누락인지 판정할 때 읽는다. 브라우저 DOM과 Lynx native 렌더러는 같은 사용자 결과를 다른 API로 제공할 수 있으므로, API 이름이 다르다는 사실만으로 누락이라 판정하지 않는다.

## 판정 순서

1. [API 비교 결과 읽기](api-parity.md#결과-읽기)대로 `dimensions`, `platformDifferences.expected`, `platformDifferences.needsReview`를 확인한다. 출력 필드와 `confidence`의 뜻은 그 문서가 기준이다.
2. `needsReview` 항목마다 아래 [대표적인 정당한 차이](#대표적인-정당한-차이)에서 맞는 범주를 찾는다. `possiblyExplainedBy`는 이름 패턴으로 찾은 검토 단서일 뿐 대체 동작이 확인됐다는 뜻이 아니다.
3. 근거 파일을 직접 읽는다.
   - 공통 접근성 매핑 → `packages/lynx-react/src/types.ts`의 `LynxAccessibilityProps`
   - 컴포넌트별 제약 → Lynx 구현의 `@platform Lynx` JSDoc과 `docs/content/lynx/components/<name>.mdx`의 차이·미지원 섹션(`웹 버전과의 차이`·`Web Version Differences`, `Lynx 미지원 기능`·`Unsupported Lynx Features`)
4. 범주의 근거가 확인됨 → 플랫폼 제약으로 판정하고 [제약으로 끝내지 않는 경우](#제약으로-끝내지-않는-경우)를 이어서 확인한다.
5. 근거가 없음 → 보완할 누락으로 판정하고 확인한 근거 경로를 함께 적는다.

## 대표적인 정당한 차이

각 항목의 괄호는 `platformDifferences.expected[]`의 `category`와 `id`(`api-parity.ts`의 `PLATFORM_CONSTRAINT_RULES`) 값이다. `possiblyExplainedBy[].id`에도 같은 `id`가 나온다.

- 요소 합성(`composition`, `slot-composition`) → React는 `asChild`와 DOM Slot으로 렌더링 요소를 교체하고, Lynx는 native `<view>`·`<text>`를 직접 렌더링한다. 현재 Lynx 구현이나 문서가 Slot 기반 합성을 제공하지 않는다고 명시하면 플랫폼 제약이다.
- 접근성 속성(`accessibility`, `native-accessibility-properties`) → React는 `role`, `aria-label`, `aria-expanded` 같은 DOM ARIA를, Lynx는 `accessibility-label`, `accessibility-role-description`, `accessibility-value` 같은 native 속성을 쓴다. 이름이 달라도 같은 의미와 상태가 접근성 트리에 전달되는지 확인한다.
- Heading(`heading`, `native-heading-semantics`) → React는 HTML `h1`~`h6`, `headingLevel`, `aria-level`로 문서 개요 단계를 표현하고, Lynx는 `accessibility-heading`으로 heading 의미를 전달한다. Lynx native 접근성 표면이 heading level을 받지 않는다는 근거가 있으면 단계 prop 부재는 누락이 아니다.
- 키보드 포커스(`focus`, `keyboard-focus-model`) → React는 `focus`, `focusVisible`, 방향키와 Home·End 탐색을 제공하고, Lynx는 native tap과 접근성 탐색을 쓴다. 웹 키보드 포커스 모델이 없다는 근거가 있으면 웹 전용 상태와 키 이벤트 부재는 플랫폼 제약이다.
- 반응형 스타일(`responsive-styling`, `css-media-queries`) → React는 CSS `@media`와 반응형 variant를, Lynx는 viewport 단위, JavaScript 분기, 별도 Recipe 값을 쓴다. Lynx가 `@media`를 지원하지 않는다는 근거가 있으면 같은 CSS variant 부재는 누락이 아니다. 대체 동작은 따로 확인한다.

## 제약으로 끝내지 않는 경우

플랫폼 제약은 같은 API를 억지로 추가하지 않아도 된다는 뜻일 뿐이다. 다음을 계속 확인한다.

- 접근 가능한 이름, 역할, 상태가 두 플랫폼에서 같은 사용자 결과를 만드는가.
- `asChild` 없이도 필요한 이벤트와 스타일을 안전하게 조합할 수 있는가.
- 키보드 포커스 대신 Lynx native 접근성 탐색과 tap 동작이 제공되는가.
- media query 대신 지원 화면 크기에서 같은 레이아웃 목적을 달성하는가.
