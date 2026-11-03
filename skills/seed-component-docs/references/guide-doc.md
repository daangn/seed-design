# 공통 가이드 문서 작성

`docs/content/components/<id>.mdx`는 플랫폼과 무관한 디자인 의도를 설명하는 문서다. 부품, 속성, 사용 규칙, 비슷한 컴포넌트와의 선택 기준을 담고 코드·설치는 담지 않는다. 기준 문서는 `select.mdx`(긴 컴포넌트)와 `pagination.mdx`(짧은 컴포넌트)다. 새 절을 쓰기 전에 둘 중 가까운 쪽의 같은 절을 읽는다.

## 작업 순서

1. 근거를 모은다. Figma 페이지가 있으면 [figma-migration.md](figma-migration.md)로 추출하고, 없으면 구현·PRD·사용자 설명에서 부품·속성·규칙을 뽑는다. 근거에 없는 규칙을 보태지 않는다.
2. Rootage spec 존재를 확인한다: `ls packages/rootage/components/<id>.yaml`. 있으면 `## Specification`이 필수다.
3. [골격](#골격)대로 쓴다. 근거에 있는 절만 두고 빈 절은 만들지 않는다.
4. [끝내기 전 확인](#끝내기-전-확인)을 통과한다.

## 구조

제목 순서는 고정이다. `Anatomy → Properties → Guidelines → {A} vs. {B} → 더 알아보기 → Specification`.

- `## Anatomy`: 한 문장 개요 뒤에 `- **Name:** 역할. 상태·제약.` 목록. 콜론은 볼드 안에 둔다. 이미지 alt는 `{Component}의 Anatomy 이미지. A, B, C로 구성됩니다.`
- `## Properties`: 속성마다 `### Size`, `### Variant`, `### Tone`, `### Layout`, `### State`, 컴포넌트 고유 속성 순. `Property` 접미사는 붙이지 않는다(`### Prefix`, `### Selection Mode`). 값이 2~3개면 `- **Value**: 언제 쓰는지.` 목록, 4개 이상이거나 비교 축이 있으면 `| Value | 사용 상황 |` 표. State의 대상이 둘 이상이면 `#### Trigger State`처럼 나눈다.
- `## Guidelines`: 첫 절은 `### {Component} 사용하기`로 사용 맥락과 "대신 다른 방법을 고려합니다" 목록을 쓴다. 이어지는 절 제목은 `### Label 작성하기`, `### Size 선택하기`처럼 동사형이다. 각 절은 규칙 + 이유 1단락, 조건 분기는 `- **조건**: 행동.` 목록, 예외·대안 1단락.
- `## {A} vs. {B}`: Guidelines 다음. 구두점은 `vs.`다. 한 줄 정의 문장 뒤에 첫 열이 비교 축(`**목적**`, `**사용 맥락**`)인 표. 셋 이상을 고르는 안내는 `## 선택 컴포넌트 고르기`(select.mdx).
- `## 더 알아보기`: 관련 업데이트 글이 있을 때만 `description` prop을 쓴 self-closing `Card`.
- `## Specification`: 마지막. 아래 [ComponentSpecBlock](#componentspecblock).

도입부: frontmatter 바로 아래에 혼동되는 형제 컴포넌트나 상위 컨테이너가 있으면 `Card`, 범위를 선 그어야 하면 "무엇을 하지 않는지" 1~2단락(date-picker.mdx).

## 문체

- 한국어 존댓말 "~합니다"로 쓴다. 규칙은 "~합니다/~해야 합니다", 권장은 "~권장합니다", 금지는 "~하지 않습니다". "~해주세요"와 "~해요"는 쓰지 않는다.
- 한 문장 40~70자, 한 단락 1~3문장. 규칙과 이유를 한 단락에 묶는다. 예: `Select는 항상 Field의 Label과 함께 사용합니다. Field의 Label이 없으면 값을 선택한 이후에 그 값이 무엇을 나타내는지 알 수 없습니다.`
- 컴포넌트명·속성값·상태명은 영문 원표기(`Enabled`, `Neutral Weak`, `Trigger`), 일반 UI 용어는 한국어, 수치는 단위와 함께(`480px`, `40px 빈 슬롯`).
- `**bold**` 단독 문장은 필수 규칙에만 쓴다. Figma 팁, 소제목 대용, 사실 서술은 굵게 하지 않는다. 기준 문서는 본문 볼드 문장이 0개이고 규칙을 목록과 Do/Don't body로 드러낸다.
- 사실만 적힌 절("Footer 사용 여부를 제공합니다.")은 언제 쓰는지까지 쓴다. 링크 없는 "가이드를 참고하세요"는 쓰지 않는다.

## 도구가 판정할 수 있는 Guidelines

`seed-design` Skill의 진단(`skills/seed-design/rules/component-guidelines.md`)은 게시된 `/llms/components/{id}.txt`에서 `DoImage`·`DontImage`의 `body`와 Guidelines·Usage 절의 볼드 문장형 규칙을 수집해 판정 기준으로 쓴다. 가이드라인을 쓰는 것이 그 컴포넌트의 리뷰를 켜는 일이다.

- 각 규칙은 이미지 없이 통과·위반을 판정할 수 있는 문장으로 쓴다. `판정 가능: Snap Point를 추가하는 경우 Handle을 반드시 표시해야 합니다.` / `배경 서술: Handle은 시트를 확장하거나 축소할 수 있게 해줍니다.`
- Do body는 "~합니다", Don't body는 "~하지 않습니다"로 쓰고 필요하면 이유 한 문장을 붙인다. Don't에 Do 문장을 넣지 않는다.
- 절 제목은 `## Guidelines`다.

## MDX 컴포넌트

쓸 수 있는 컴포넌트는 `docs/components/mdx-components.tsx`가 원천이다. 가이드 문서에서 쓰는 것만 적는다.

### Frontmatter

```markdown
---
title: { Component Name }
description: { 역할을 설명하는 한국어 1문장. "~컴포넌트입니다"로 끝낸다 }
keywords: ["{한국어 음차}", "{동의어}"]
coverImage: /og/components/{component-id}
---
```

- `keywords`는 선택이다. `featured: true`는 동시에 소수의 최신 문서에만 붙인다.
- `coverImage`는 `docs/public/og/components/{id}.png`·`.webp` 쌍이다. 한쪽만 있으면 `bun docs:images:og:generate`(ffmpeg 필요)로 짝을 만들고 `bun docs:images:og:validate`로 확인한다. 자산이 없으면 사용자에게 알린다.
- 한 문서가 여러 컴포넌트 id를 다룰 때만 `componentIds: [...]`(`list.mdx`). 없으면 파일 slug가 id다.
- 플랫폼 상태 표는 `docs/app/components/[[...slug]]/page.tsx`가 `componentIds`(없으면 slug)로 헤더에 렌더링한다. 본문에 `PlatformStatusTable`을 쓰면 렌더링되지 않는다.
- `AvailableSince`는 플랫폼 문서용이다. 가이드에는 넣지 않는다.

### FigmaImage

```tsx
<FigmaImage id="{figma-node-id}" alt="{시각 내용을 묘사하는 한국어 alt}" />
```

제목 → 본문 → 이미지 순서로 둔다. 독자가 맥락을 읽은 뒤 이미지를 본다. 빌드 때 `docs/components/figma-image/remark-figma-image.ts`가 URL로 바꾸며, 빈 `id=""`는 `FigmaImage requires a static non-empty 'id' prop` 오류를 낸다.

### DoImage / DontImage

```tsx
<DoImage
  figmaId="{figma-node-id}"
  body="Neutral Weak 버튼을 나란히 사용할 수 있습니다."
  alt="Neutral Weak Action Button을 나란히 배치한 예시"
/>
<DontImage
  figmaId="{figma-node-id}"
  body="무분별하게 Brand 컬러를 사용하지 않습니다."
  alt="Action Button Brand 컬러 과다 사용 예시"
/>
```

- `figmaId`(FigmaImage의 `id`와 prop 이름이 다르다), `body`(캡션이자 판정 기준), `alt`(장면 묘사, 지침이 아님) 순으로 쓴다.
- alt는 body에서 추론한다. body가 `버튼을 4개 이상 나란히 사용하지 않습니다.`이면 alt는 `Action Button을 4개 나란히 배치한 예시`.
- `DontImage` 단독도 된다. 실제 문서의 Don't는 Do보다 세 배 많다.

### Grid

이미지를 나란히 놓는다. 자식은 둘이다. Do → Don't 순.

```tsx
<Grid>
  <DoImage figmaId="" body="..." alt="..." />
  <DontImage figmaId="" body="..." alt="..." />
</Grid>
```

`FigmaImage` 둘, `FigmaImage` + `DontImage` 조합도 쓴다.

### Card

```tsx
<Card href="/components/{related-id}" title="{Related Name}">
  {두 컴포넌트의 관계 1문장}
</Card>
```

관련 컴포넌트 Card는 frontmatter 바로 아래. Field 계열은 `X를 Field 내부에서 사용하여 X Field로 활용할 수 있습니다.` 문형을 쓴다. `## 더 알아보기`에는 `description` prop을 쓴 self-closing Card(action-button.mdx).

### Callout

용어 정의나 범위 밖 안내는 `<Callout type="info">`, 주의는 `<Callout type="warning" title="...">`(select.mdx). 남발하지 않는다.

### ComponentSpecBlock

Rootage spec이 있는 컴포넌트에만 문서 마지막 `## Specification` 아래에 둔다.

```tsx
## Specification

<ComponentSpecBlock id="{component-id}" />
```

spec이 여럿이면 spec마다 `### {Spec Name}` + `headingComponent="h4"`(허용 값 `h3`·`h4`).

### 링크

- 컴포넌트: `[Bottom Sheet](/components/bottom-sheet)`. 실제 다른 컴포넌트를 언급할 때만.
- 문서 안 anchor: `[단일 선택에서 "없음"을 답으로 받기](#단일-선택에서-없음을-답으로-받기)`.
- 토큰: `` [`$color.stroke.neutral-muted`](/foundations/design-token/reference/%24color.stroke.neutral-muted) ``(`%24`는 `$`).
- 토큰 묶음 표는 `<TokenReference groups={["color", "fg"]} />`. 주로 foundation 문서용이다.

## 골격

`{ }`는 치환, `{/* */}`는 조건부 절이다.

```mdx
---
title: { Component Name }
description: { 역할 1문장 }
keywords: ["{음차}"]
coverImage: /og/components/{id}
---

{/* 형제·상위 컴포넌트가 있을 때만 */}
<Card href="/components/{related-id}" title="{Related Name}">
  {관계 1문장}
</Card>

## Anatomy

{Component}는 {A}, {B}, {C}로 구성됩니다.

- **{A}:** {역할}. {상태·제약}.
- **{B}:** {역할}.

<FigmaImage id="{id}" alt="{Component}의 Anatomy 이미지. {A}, {B}, {C}로 구성됩니다." />

## Properties

### Size

{Component}는 {Large}, {Medium} 두 가지 Size를 제공합니다.

- **{Large}**: {언제 쓰는지}.
- **{Medium}**: {언제 쓰는지}.

<FigmaImage id="{id}" alt="{Component}의 Size Property - {Large}, {Medium}" />

### State

- **Enabled:** 기본 상태입니다.
- **Pressed:** {요소}를 누르고 있는 동안의 상태입니다.
- **Disabled:** 비활성 상태입니다. 사용자가 상호작용할 수 없습니다.

<FigmaImage id="{id}" alt="{Component}의 State - Enabled, Pressed, Disabled" />

## Guidelines

### {Component} 사용하기

{사용 맥락 1~2문장. 대표 사용 예.}

아래와 같은 경우에는 {Component} 대신 다른 방법을 고려합니다.

- {상황}: [{Alternative}](/components/{alt-id})을 사용합니다.

<FigmaImage id="{id}" alt="{사용 장면 묘사}" />

### {규칙 동사형 제목}

{규칙 + 이유 1단락.}

<Grid>
  <DoImage figmaId="{id}" body="{~합니다.}" alt="{장면}" />
  <DontImage figmaId="{id}" body="{~하지 않습니다. 이유.}" alt="{위반 장면}" />
</Grid>

## {Component} vs. {Other}

[{Other}](/components/{other-id})는 {정의}이고, {Component}는 {정의}입니다.

|               | {Component} | {Other} |
| ------------- | ----------- | ------- |
| **목적**      | …           | …       |
| **사용 맥락** | …           | …       |

{/* Rootage spec이 있을 때만 */}
## Specification

<ComponentSpecBlock id="{id}" />
```

## 끝내기 전 확인

1. `FigmaImage`·`DoImage`·`DontImage`의 `id`/`figmaId`와 `alt`가 모두 채워졌다. 채울 수 없는 이미지는 빼고 사용자에게 알린다.
2. 각 절이 제목 → 본문 → 이미지 순서다.
3. Guidelines의 규칙과 Do/Don't body가 이미지 없이 판정 가능한 문장이고, Don't body는 "~하지 않습니다"다.
4. `packages/rootage/components/<id>.yaml`이 있으면 `## Specification`이 있다.
5. 컴포넌트·토큰 링크의 대상 페이지가 실제로 있다. 비교 제목은 `vs.`다.
6. 본문에 `PlatformStatusTable`, `AvailableSince`, "~해요", 링크 없는 외부 참조가 없다.
