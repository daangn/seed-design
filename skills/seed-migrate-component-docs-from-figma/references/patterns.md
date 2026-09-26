# MDX 컴포넌트 패턴

`docs/content/components/*.mdx` 가이드 문서에서 쓰는 MDX 컴포넌트와 작성 규칙이다. MDX에 쓸 수 있는 컴포넌트 목록은 `docs/components/mdx-components.tsx`가 원천이다. 실제 예시는 `docs/content/components/radio.mdx`(Card·Do/Don't·Grid)와 `docs/content/components/action-button.mdx`(Properties·Guidelines·Comparison)에 있다.

## 끝내기 전 확인

1. `FigmaImage`의 `id`가 모두 채워졌다. 빈 `id=""`는 문서 빌드에서 `FigmaImage requires a static non-empty 'id' prop` 오류를 낸다(`docs/components/figma-image/collect-figma-image-ids.ts`) → 이미지 ID 매핑 단계에서 placeholder를 모두 채운다. 채울 수 없으면 그 이미지를 빼고 사용자에게 알린다.
2. 본문에 `PlatformStatusTable`을 넣지 않았다([플랫폼 상태 표](#플랫폼-상태-표)).
3. Guidelines의 필수 규칙과 `DoImage`·`DontImage`의 `body`가 이미지 없이 판정 가능한 문장이다([도구가 판정할 수 있는 Guidelines](#도구가-판정할-수-있는-guidelines)).
4. 토큰·컴포넌트 링크가 아래 URL 형식을 따른다.

## Frontmatter

```markdown
---
title: { Component Name }
description: { 컴포넌트의 역할을 설명하는 한국어 1–2문장 }
keywords: ["{한국어 검색어}"]
coverImage: /og/components/{component-id}
---
```

- `keywords`는 선택이다.
- `coverImage`는 `docs/public/og/components/{component-id}.png`·`.webp` 쌍을 가리킨다. 한쪽만 있으면 `bun docs:images:og:generate`(ffmpeg 필요)로 짝을 만들고 `bun docs:images:og:validate`로 확인한다. 새 문서라 자산이 없으면 사용자에게 알린다.
- 한 문서가 여러 컴포넌트 id를 다룰 때만 `componentIds: [...]`를 둔다(예: `docs/content/components/list.mdx`의 `["list-item", "list-header"]`). 없으면 파일 slug 하나가 컴포넌트 id다.

## 플랫폼 상태 표

본문에 `<PlatformStatusTable>`을 넣지 않는다. `docs/app/components/[[...slug]]/page.tsx`가 frontmatter `componentIds`(없으면 slug)로 페이지 헤더에 플랫폼 상태를 렌더링하고, llms 텍스트에도 자동으로 넣는다. `PlatformStatusTable`은 MDX 컴포넌트 목록에 없으므로 본문에 쓰면 렌더링되지 않는다.

## ComponentSpecBlock

관련 Rootage spec이 있는 컴포넌트에만 문서 마지막 `## Specification` 아래에 둔다. 기존 문서의 관련 spec이 바뀌지 않았으면 다른 spec을 전수 탐색하지 않는다.

```tsx
## Specification

<ComponentSpecBlock id="{component-id}" />
```

관련 spec이 여럿일 때만 spec마다 하위 섹션을 두고 `headingComponent="h4"`를 준다(허용 값 `h3`·`h4`, 기본 `h3`).

```tsx
## Specification

### Radio Group

<ComponentSpecBlock id="radio-group" headingComponent="h4" />

### Radio

<ComponentSpecBlock id="radio" headingComponent="h4" />
```

## FigmaImage

Figma node ID로 이미지를 넣는다. Anatomy 도식, 속성 설명, 가이드라인, 비교 이미지에 쓴다. 빌드 때 `docs/components/figma-image/remark-figma-image.ts`가 이미지 URL로 바꾼다.

```tsx
<FigmaImage id="{figma-node-id}" alt="{이미지를 설명하는 한국어 alt}" />
```

각 섹션에서 `FigmaImage`는 제목 바로 아래가 아니라 본문 뒤에 둔다(제목 → 본문 → 이미지). 독자가 맥락을 먼저 읽고 이미지를 보게 하기 위해서다.

```tsx
{/* 맞음: 본문 다음 이미지 */}
### Type

기본 타입과 서비스나 카테고리 별 타입을 제공합니다.

<FigmaImage id="..." alt="..." />

{/* 틀림: 제목 바로 아래 이미지 */}
### Type

<FigmaImage id="..." alt="..." />

기본 타입과 서비스나 카테고리 별 타입을 제공합니다.
```

## DoImage / DontImage

올바른 사용과 잘못된 사용 예시를 보여 준다.

- `figmaId`: Figma node ID. `FigmaImage`의 `id`와 prop 이름이 다르다.
- `body`: 이미지 아래 캡션으로 렌더링되는 짧은 지침. 보통 Figma의 Do/Don't frame 안이나 근처 텍스트에서 가져온다. 무엇을 하고 피할지 말한다.
- `alt`: 이미지가 시각적으로 보여 주는 내용의 묘사. 지침이 아니다.

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

짝이 되는 `DoImage` 없이 `DontImage`만 단독으로 둬도 된다.

alt 규칙(`FigmaImage`·`DoImage`·`DontImage` 공통):

- alt를 비워 두지 않는다 → Figma에서 확인할 수 있는 시각 내용을 묘사한다.
- Do/Don't의 alt는 `body`에서 추론한다. `body`가 지침을 말하면 alt는 그 지침을 보여 주는 장면을 묘사한다. 예: `body`가 `버튼을 4개 이상 나란히 사용하지 않습니다.`이면 alt는 `Action Button을 4개 나란히 배치한 예시`.

## Grid

이미지를 나란히 놓는 컨테이너다. Do/Don't 짝에 가장 많이 쓰고, 비교할 이미지 두 개에도 쓴다.

```tsx
{/* Do/Don't 짝 */}
<Grid>
  <DoImage figmaId="" body="..." alt="..." />
  <DontImage figmaId="" body="..." alt="..." />
</Grid>

{/* 일반 이미지 두 개 */}
<Grid>
  <FigmaImage id="" alt="..." />
  <FigmaImage id="" alt="..." />
</Grid>

{/* 일반 이미지와 Don't */}
<Grid>
  <FigmaImage id="" alt="..." />
  <DontImage figmaId="" body="..." alt="..." />
</Grid>
```

## Card

관련 컴포넌트로 가는 링크와 짧은 설명이다. 관련 컴포넌트 Card는 frontmatter 바로 아래 본문 첫머리에 둔다.

```tsx
<Card href="/components/{related-component}" title="{Related Component Name}">
  {두 컴포넌트의 관계를 설명하는 한국어 문장}
</Card>
```

예: `docs/content/components/radio.mdx`의 `Field` Card.

관련 업데이트 글은 `## Specification` 앞 `## 더 알아보기`에 `description` prop을 쓴 self-closing `Card`로 둔다(예: `docs/content/components/action-button.mdx`).

## 디자인 토큰 참조

본문에서 특정 토큰을 언급할 때는 토큰 reference 페이지로 inline 링크한다. URL은 `/foundations/design-token/reference/%24{token-name}`이다(`%24`는 `$`의 URL 인코딩).

```markdown
[`$color.stroke.neutral-muted`](/foundations/design-token/reference/%24color.stroke.neutral-muted)
[`$radius.r2`](/foundations/design-token/reference/%24radius.r2)
```

토큰 묶음을 표로 보여 줄 때는 `TokenReference`를 쓴다. 주로 foundation 문서에서 쓴다.

```tsx
{/* group으로 */}
<TokenReference groups={["color", "fg"]} />

{/* 정규식으로 */}
<TokenReference regex={/^\$color\..*-pressed$/} />
```

## 컴포넌트 교차 링크

본문에서 실제 다른 컴포넌트를 언급할 때만 그 컴포넌트 페이지로 링크한다. 경로는 `/components/{component-id}`다.

```markdown
[Bottom Sheet](/components/bottom-sheet)
[Checkbox](/components/checkbox)
```

일반 명사나 Figma에 없는 보충 설명은 링크로 만들지 않는다.

## 도구가 판정할 수 있는 Guidelines

`seed-design` Skill의 진단(`skills/seed-design/rules/component-guidelines.md`)은 게시된 `/llms/components/{id}.txt`를 raw로 읽어 판정 기준을 만든다. 하드코딩한 목록이 없으므로 가이드라인을 쓰는 것이 그 컴포넌트의 리뷰를 켜는 일이다. 진단은 다음을 수집한다.

- 문서 전체의 `DoImage`·`DontImage` `body` 속성(주석 처리된 블록 제외)
- Guidelines 또는 Usage 절의 볼드 문장 중 문장형 규칙
- 판단 보충으로 Guidelines·Usage·Properties의 명시적 규범

그래서 각 규칙을 통과·위반으로 판정할 수 있게 쓴다.

- 배경이 아니라 규칙을 쓴다. 판정 가능한 문장과 배경 문장은 함께 있어도 되지만, 배경만 있는 절은 기준을 하나도 만들지 않는다. 예시 문장은 아래 코드 블록에 있다.
- 무엇이 위반인지 이미지 없이 문장 안에서 알 수 있게 쓴다.
- `**bold**`는 필수 규칙에만 쓴다. Figma 팁, 소제목, 사실 서술은 굵게 하지 않는다. 볼드가 곧 "필수"라는 신호다.
- `DoImage`·`DontImage`의 `body`는 그 자체로 기준 하나다. 이미지 없이도 성립하는 완결된 문장으로 쓴다.
- 사용 지침 절의 제목은 `## Guidelines`로 쓴다(표준 제목 순서와 기존 문서의 형식).

```text
판정 가능: Snap Point를 추가하는 경우 Handle을 반드시 표시해야 합니다.
배경 서술: Handle은 시트를 확장하거나 축소할 수 있게 해줍니다.
```

## 표준 제목 순서

모든 문서에 모든 절이 필요하지는 않다. Figma에 있는 절만 이 순서로 둔다.

1. Anatomy: 구조 도식과 부분 설명
2. Properties: 속성별 하위 절(Size, Variant, Layout, State, Width, Tone, Weight 등)
3. Guidelines: Do/Don't 이미지를 포함한 사용 지침
4. {Component A} vs. {Component B}: 비슷한 컴포넌트와 비교(표 형식)
5. {Component} V3 Changes: V2에서 넘어올 때의 변경점
6. Specification: `ComponentSpecBlock`

## 문서 문체

가이드 문서 본문은 에이전트 문서와 문체가 다르다.

- 한국어 존댓말("~합니다", "~해주세요")로, 전문적이고 명확하게 쓴다.
- 기술 내부가 아니라 사용 맥락을 중심으로 설명한다.
- 컴포넌트명과 기술 용어는 공식 English 표기를 유지한다.
- frontmatter `description`은 컴포넌트 역할을 설명하는 간결한 한국어 1–2문장이다.
