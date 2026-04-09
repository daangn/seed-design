# Changeset 메시지 작성 패턴

SEED Design CHANGELOG 분석에서 추출한 메시지 작성 규칙과 예시.

## 언어 규칙

- **언어**: 한국어 (기술 용어, 컴포넌트명, prop명, CSS 속성명은 영어 유지)
- **어미**: `~합니다` 체 사용 (예: "수정합니다", "추가합니다", "지원합니다")
- **주어 생략**: 주어를 생략하고 변경 내용을 바로 서술
- **백틱**: 코드 관련 이름은 백틱으로 감싼다 (`` `prop명` ``, `` `ComponentName` ``)
- **관점**: 디자인 시스템 소비자(개발자) 관점 — "무엇이 바뀌었고, 나에게 어떤 영향이 있는가"

## 타입 분류 기준

### patch

- 버그 수정 (기존 동작이 의도와 달랐던 것을 바로잡음)
- 스타일/레이아웃 미세 조정 (padding, margin, font-weight 등)
- 기존 컴포넌트에 variant 값 추가 (새 API가 아닌 기존 옵션의 확장)
- 의존성 업데이트 (peerDependencies 범위 확장 등)
- 내부 리팩토링 (사용자 API 변경 없음)
- 성능 개선 (API 변경 없음)
- 접근성 개선 (기존 동작 유지)

### minor

- 새 컴포넌트 추가
- 새 기능/훅 추가
- 기존 컴포넌트에 새 prop/API 추가 (기존 API 하위 호환 유지)
- 새 CSS recipe 추가
- snippet 업데이트가 필요한 내부 구조 변경 (하위 호환은 됨)
- 기존 prop/API 제거 또는 이름 변경 (**breaking change** — BREAKING CHANGE 접두사 사용)
- 기존 동작의 breaking change (**breaking change** — BREAKING CHANGE 접두사 사용)
- 컴포넌트 이름 변경 (**breaking change** — BREAKING CHANGE 접두사 사용)
- snippet 재설치가 필요한 변경 (**breaking change** — BREAKING CHANGE 접두사 사용)

### major

거의 사용하지 않는다. 판단이 어려우면 사용자에게 확인한다.

- 패키지 전체 구조 변경 (예: 패키지 분리/통합)
- 전체 API 표면의 근본적 재설계
- 런타임/프레임워크 요구사항 변경 (예: React 버전 요구 변경)

## BREAKING CHANGE 접두사

minor에 breaking change가 포함될 때, 메시지 첫 줄 앞에 `(BREAKING CHANGE: {사용자가 해야 할 마이그레이션 액션})` 접두사를 붙인다.

### 형식

```text
(BREAKING CHANGE: {마이그레이션 액션}) {변경 설명}
```

### 예시

```text
(BREAKING CHANGE: BottomSheet snippet을 다시 설치해야 합니다.) BottomSheet에 드래그를 통해 닫는 기능을 추가합니다.

  - vaul headless 코드 기반으로 seed에 맞게 커스텀하여 구현했습니다.
  - vaul과 동일한 인터페이스를 가지고 있습니다. (snap-points, fade-from-index, etc.)
  - `npx @seed-design/cli@latest add ui:bottom-sheet`로 snippet을 최신화하세요.
```

```text
(BREAKING CHANGE: TextField snippet을 다시 설치해야 합니다.) Text Field 관련 컴포넌트를 업데이트합니다.

  - 스타일 업데이트
  - size 통일 및 variant (underline) 추가
  - 내부적으로 Field 컴포넌트를 사용하도록 변경하여 스타일 일관성 향상
```

```text
(BREAKING CHANGE: PageBanner snippet을 다시 설치해야 합니다.) Page Banner 스니펫을 업데이트합니다.

  - Box를 사용하여 스타일링하던 부분을 `PageBanner.Body`로 교체합니다.
  - `PageBanner.TextContent`를 `PageBanner.Content`로 이름 변경합니다.
```

### 규칙

- 접두사의 마이그레이션 액션은 사용자가 **무엇을 해야 하는지** 명시한다 (예: "snippet을 다시 설치해야 합니다", "`prop명`을 `새이름`으로 변경해야 합니다")
- 접두사 뒤의 설명은 **무엇이 바뀌었는지** 서술한다
- 불릿 리스트로 세부 변경사항과 마이그레이션 방법을 안내한다

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
- Reaction Button uncontrolled 상태에서 클릭 시 상태가 변경되지 않는 문제를 수정합니다.
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

```tsx
<Box padding={{ base: "x3", md: "x6" }} />
<Grid columns={{ base: 1, md: 2, lg: 4 }} gap="x4" />
```
```text

```
Content Placeholder 컴포넌트를 추가합니다.
```text

```
Footer Block을 추가합니다.

- `Footer.LinkText`: 푸터에서 사용하는 링크 텍스트 컴포넌트
- 4가지 푸터 블록 예제와 소셜 미디어 아이콘 컴포넌트 포함
```text

### major — 제목 + 설명 + 마이그레이션 가이드

```
`AlertDialogRoot`, `MenuSheetRoot` 및 `BottomSheetRoot`의 `onOpenChange` 두 번째 인자로 `details`를 제공합니다. `details.reason`과 `details.event`를 사용할 수 있습니다.

`DialogAction`을 `DialogPrimitive.CloseButton`으로 교체합니다. `AlertDialogAction` `onClick` 핸들러에서 `event.preventDefault()`를 호출하여 닫기 동작을 방지할 수 있습니다.
```text

```
**`add` 명령어 사용 방식을 변경합니다.**

- 항목 추가

```sh
seed-design add ui:action-button breeze:animate-number
```text

- 기존 `seed-design add action-button` 형식은 더 이상 지원되지 않습니다.
- `seed-design add-all ui lib breeze`로 레지스트리별 일괄 추가가 가능합니다.
```

## 다수 패키지 포함

하나의 changeset에 여러 패키지를 포함할 수 있다.

### 동일 맥락 — 하나의 changeset으로 통합

```text
---
"@seed-design/react": patch
"@seed-design/css": patch
"@seed-design/rootage-artifacts": patch
---

IdentityPlaceholder의 스타일과 글리프를 업데이트하고, `identity="business"` variant를 추가합니다.
```

### 독립적 변경 — 별도 changeset으로 분리

패키지 A의 버그 수정과 패키지 B의 새 기능 추가처럼 맥락이 다르면 별도 파일로 분리한다.

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

- 내부 구현 디테일을 나열하지 않는다 (예: "파일명 변경", "import 경로 수정" 등)
- 커밋 메시지를 그대로 복사하지 않는다 — changeset은 CHANGELOG용 유저향 텍스트다
- 영어로 작성하지 않는다 (기술 용어 제외)
- `~해요` 체와 `~합니다` 체를 하나의 changeset 내에서 섞지 않는다
