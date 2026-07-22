# Changeset 메시지 작성 패턴

SEED Design CHANGELOG 분석에서 추출한 메시지 작성 규칙과 예시.

> bump 타입(major/minor/patch)을 정하기 전에 **먼저 `version-matrix.md`의 전파 매트릭스**로 "이 패키지와 그것을 의존하는 패키지들이 각각 어떤 bump를 받아야 하는지"를 확인한다. 이 문서는 그렇게 정한 타입에 맞는 **메시지를 어떻게 쓰는지**를 다룬다.

## 언어 규칙

- **언어**: 한국어 (기술 용어, 컴포넌트명, prop명, CSS 속성명은 영어 유지)
- **어미**: `~합니다` 체 사용 (예: "수정합니다", "추가합니다", "지원합니다")
- **주어 생략**: 주어를 생략하고 변경 내용을 바로 서술
- **백틱**: 코드 관련 이름은 백틱으로 감싼다 (`` `prop명` ``, `` `ComponentName` ``)
- **관점**: 디자인 시스템 소비자(개발자) 관점 — "무엇이 바뀌었고, 나에게 어떤 영향이 있는가"

## 타입 분류 기준

SEED는 **2.0부터 strict semver**를 따른다. breaking change는 **major에서만** 낸다 (1.x처럼 minor에 breaking을 싣지 않는다).

### patch

기존 소비자에게 보이는 표면이 그대로인 변경.

- 버그 수정 (기존 동작이 의도와 달랐던 것을 바로잡음)
- 스타일/레이아웃 미세 조정 (padding, margin, font-weight 등) — 단 **의도된 시각적 디자인 변경**이면 `minor`
- 기존 컴포넌트에 variant **값** 추가 (새 API가 아닌 기존 옵션의 확장)
- 의존성 floor 갱신 / peer 범위 정리 — 의존 패키지가 올랐어도 **내 코드·출력이 그대로**면 patch
- 내부 리팩토링 (공개 표면·DOM 출력 변화 없음)
- 성능 개선 / 접근성 개선 (기존 동작 유지)

### minor (additive — 기존 소비자를 깨지 않음)

- 새 컴포넌트 / 서브컴포넌트 추가
- 새 기능 / 훅 추가
- 기존 컴포넌트에 새 prop/API 추가 (하위 호환 유지)
- 새 CSS recipe / variant 추가
- 새 data attribute 기반 스타일링 추가 (기존 selector는 유지)
- headless non-breaking 추가기능, 그리고 그것을 채택한 react/스타일 업데이트
- **snippet에 새 기능/스타일 추가** — 기존 코드는 안 깨지고 새 걸 쓰려면 재설치만 하면 되는 경우 (→ "snippet 변경 분류" 참조)

### major (breaking — 공개 표면을 깨는 변경)

1.x에선 minor로 냈지만 **2.0부터는 major**다.

- 공개 API / prop 제거 또는 이름 변경
- 컴포넌트 이름 변경
- recipe / slot / variant **이름** 변경·삭제
- 토큰 / css variable 이름 변경·삭제
- **공개 contract** data attribute(소비자가 자기 CSS로 타겟하는 것) 이름 변경·삭제
- headless 인터페이스 breaking을 react가 그대로 extend
- 기존 snippet이 새 npm 패키지와 함께 더 이상 동작하지 않는 경우 (재설치 강제)
- 패키지 전체 구조 변경, 런타임/프레임워크 요구사항 변경 (예: React 버전 요구 변경)

> **예외 — 내부 배선은 breaking이 아니다.** SEED의 styling 전용 `data-*`(css와 styled react를 잇는 비공개 연결)는 옮기거나 지워도 공개 표면이 아니므로 `patch`/`minor`다. 지원 표면은 **컴포넌트 + props + recipe 클래스**다. (`version-matrix.md`의 "`data-*`는 내부 배선")

## BREAKING CHANGE 접두사

`(BREAKING CHANGE: {사용자가 해야 할 마이그레이션 액션})`은 **major changeset의 첫 줄에만** 붙인다. CHANGELOG에서 소비자가 무엇을 해야 하는지 바로 보이게 하기 위함이다. **minor/patch에는 붙이지 않는다.**

### 형식

```text
(BREAKING CHANGE: {마이그레이션 액션}) {변경 설명}
```

### 예시

```text
(BREAKING CHANGE: `PageBanner.TextContent`를 `PageBanner.Content`로 변경해야 합니다.) Page Banner의 슬롯 구조를 정리합니다.

  - `PageBanner.TextContent`를 `PageBanner.Content`로 이름 변경합니다.
  - Box로 스타일링하던 부분을 `PageBanner.Body`로 교체합니다.
  - `npx @seed-design/cli@latest add ui:page-banner`로 snippet을 다시 설치한 뒤 사용처를 수정하세요.
```

```text
(BREAKING CHANGE: `size` 토큰 이름이 바뀌어 의존 패키지를 함께 올려야 합니다.) Color/Size 토큰 일부를 재명명합니다.

  - `$color.legacy.*` 토큰을 제거합니다.
  - css 소비 패키지는 peer/deps를 `^N+1`로 올려야 합니다.
```

### 규칙

- 접두사의 마이그레이션 액션은 사용자가 **무엇을 해야 하는지** 명시한다 (예: "`prop명`을 `새이름`으로 변경해야 합니다", "snippet을 다시 설치해야 합니다")
- 접두사 뒤의 설명은 **무엇이 바뀌었는지** 서술한다
- 불릿 리스트로 세부 변경사항과 마이그레이션 방법을 안내한다

## snippet 변경 분류

snippet은 사용자가 자기 코드베이스로 **복사해간 코드**라 npm 공개 표면이 아니다. snippet 자체엔 버전이 없고, snippet이 `dependencies`로 가리키는 npm 패키지(`@seed-design/react`·`@seed-design/css`)의 changeset으로 추적된다. 분류는 `version-matrix.md`의 "기준은 내 공개 표면"을 따른다.

판단 기준 한 줄: **"재설치 안 하면 기존 코드가 깨지나?"**

- **안 깨짐** (새 기능/스타일을 받으려면 재설치만 하면 됨) → **`minor`**, 접두사 **없음**.
  - "`npx @seed-design/cli@latest add ui:x`로 최신화하면 ~를 사용할 수 있습니다." 톤.
- **깨짐** (재설치 강제, 사용처 수정 필요) → **`major`**, `(BREAKING CHANGE: x snippet을 다시 설치해야 합니다.)` 접두사.

## 메시지 구조

### patch — 1줄

간결한 변경사항 한 줄:

```text
BottomSheet title 영역의 padding을 수정합니다.
```

```text
iOS의 폰트 스케일링 max limit을 135%에서 160%로 늘립니다.
```

```text
Avatar 및 Avatar Stack의 `size=56` variant를 추가합니다.
```

### patch — 1줄 제목 + 불릿 리스트

여러 변경이 하나의 맥락에 묶일 때:

```text
ImageFrame 컴포넌트 개선

- `fallback` prop이 이미지 로딩 실패 시 대체 콘텐츠를 올바르게 표시하도록 개선합니다.
- Reaction Button이 iOS에서 렌더링되지 않는 문제를 수정합니다.
```

### patch — 사용자 영향 없음

내부 변경이지만 changeset이 필요한 경우:

```text
(사용자 변경사항 없음) Rootage `text-input`에 `type=singleLine` variant 정의를 추가합니다.
```

### minor — 제목 + 설명 + 코드 예제

```text
Breakpoint 기반 반응형 스타일링을 지원합니다.

- Box, Flex, Grid, VStack 등 유틸리티 컴포넌트의 레이아웃 관련 프로퍼티에 breakpoint 기반 반응형 객체를 사용할 수 있습니다.

​```tsx
<Box padding={{ base: "x3", md: "x6" }} />
<Grid columns={{ base: 1, md: 2, lg: 4 }} gap="x4" />
​```
```

### minor — snippet 새 기능 (additive, 접두사 없음)

기존 snippet은 안 깨지고, 새 기능을 쓰려면 최신화만 하면 되는 경우:

```text
BottomSheet에 드래그를 통해 닫는 기능을 추가합니다.

- vaul headless 코드 기반으로 seed에 맞게 커스텀하여 구현했습니다.
- snap-points, fade-from-index 등 vaul과 동일한 인터페이스를 제공합니다.
- `npx @seed-design/cli@latest add ui:bottom-sheet`로 최신화하면 사용할 수 있습니다.
```

### major — 제목 + 설명 + 마이그레이션 가이드

```text
(BREAKING CHANGE: `DialogAction`을 `DialogPrimitive.CloseButton`으로 교체해야 합니다.) Dialog 닫기 동작 제어 방식을 변경합니다.

- `AlertDialogRoot`, `MenuSheetRoot`, `BottomSheetRoot`의 `onOpenChange` 두 번째 인자로 `details`(`details.reason`, `details.event`)를 제공합니다.
- `AlertDialogAction` `onClick`에서 `event.preventDefault()`를 호출해 닫기를 막을 수 있습니다.
```

## 다수 패키지 포함

하나의 changeset에 여러 패키지를 포함할 수 있다. 어떤 패키지를 함께 올려야 하는지는 `version-matrix.md`의 전파 매트릭스로 정한다.

### 전파에 따른 동반 bump — 하나의 changeset으로 통합

예: 새 컴포넌트를 추가하면 css(recipe 추가)와 react(컴포넌트 추가)가 함께 minor.

```text
---
"@seed-design/css": minor
"@seed-design/react": minor
---

Content Placeholder 컴포넌트를 추가합니다.
```

> ⚠️ 위처럼 css가 minor 오를 때 **react의 css peer floor(`^N.M.0`)는 changeset이 자동으로 안 올린다** (`onlyUpdatePeerDependentsWhenOutOfRange`). 같은 PR에서 `react/package.json`을 손수 올려야 한다 — `version-matrix.md`의 "peer floor 수동 bump 함정" 참조.

### 독립적 변경 — 별도 changeset으로 분리

패키지 A의 버그 수정과 패키지 B의 새 기능처럼 맥락이 다르면 별도 파일로 분리한다.

### 패키지별 다른 타입

한 changeset 내에서 패키지마다 다른 타입을 지정할 수 있다:

```text
---
"@seed-design/react": minor
"@seed-design/css": minor
"@seed-design/rootage-artifacts": patch
---
```

## changeset 파일 형식

```text
---
"@seed-design/패키지명": patch|minor|major
---

한국어 메시지
```

- 파일 위치: `.changeset/<random-name>.md`
- 파일명: 영어 소문자 `형용사-명사-동사.md` (예: `afraid-parrots-joke.md`)
- frontmatter의 패키지명은 반드시 쌍따옴표(`"`)로 감싼다
- frontmatter와 메시지 사이에 빈 줄 하나

## 안티패턴

- **breaking change를 minor로 내지 않는다** (2.0부터 공개 표면 breaking은 `major`).
- **의존성이 올랐다는 이유만으로 버전을 올리지 않는다** — 그 변경이 내 공개 표면으로 새어나갈 때만 전파한다 (observable contract).
- 내부 구현 디테일을 나열하지 않는다 (예: "파일명 변경", "import 경로 수정").
- 커밋 메시지를 그대로 복사하지 않는다 — changeset은 CHANGELOG용 유저향 텍스트다.
- 영어로 작성하지 않는다 (기술 용어 제외).
- `~해요` 체와 `~합니다` 체를 하나의 changeset 내에서 섞지 않는다.
