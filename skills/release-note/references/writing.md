# 릴리즈 노트 작성 가이드

## 톤

**`~합니다`체.** 현재 docs 사이트 전체가 이 문체다.

| 문서 | `해요.` | `합니다./습니다.` |
|---|---|---|
| `react/updates/upgrade/v2.mdx` | 0 | 48 |
| `react/components/menu.mdx` | 0 | 17 |
| `updates/why-design-system-needs-branding.mdx` (2026) | 1 | 38 |
| `updates/how-seed-evolved.mdx` (2026) | 6 | 22 |
| `updates/whats-new-in-action-button.mdx` (2024) | 12 | 0 |

노션의 "친절한 SEED 릴리즈 노트"는 `~해요`체였다. 2024년 글도 그랬지만 2026년 문서는 전부 `~합니다`체로 옮겨왔다. **릴리즈 노트는 `~합니다`체를 쓴다.**

한 문서 안에서 문체를 섞지 않는다.

### 문장 규칙

- **주어를 세우지 않는다.** "저희가 ~를 추가했어요" ❌ → "~를 추가합니다" ✅
- **소비자에게 무엇이 달라지는지**를 쓴다. 내부 구현이 아니라.
  - ❌ `MenuContent`의 remount 로직을 `key` 기반에서 ref 기반으로 교체했습니다
  - ✅ Menu를 열고 닫을 때마다 내부 상태가 초기화되던 문제를 수정합니다
- 커밋 메시지·changeset 문구를 그대로 붙여넣지 않는다. 둘 다 다른 독자를 향한 글이다.
- 코드 식별자(`prop`, 패키지명, 클래스명, 토큰명)는 백틱.
- 산문에서 **"SEED Design"이라 쓰지 않는다. "SEED"** (패키지명·저장소명은 예외).
- 과장하지 않는다. "혁신적인", "완벽하게" 같은 수식어 없이 무엇이 되는지만 적는다.

## 구조

```mdx
---
title: SEED React 2.1
description: 한 문장 요약. 인덱스 리스트와 OG 설명에 그대로 실린다.
publishedAt: 2026-07-28T00:00:00+09:00
category: release
---

<Callout type="info" title="tl;dr">

1. **[한 줄 요약]** — [자세히](#앵커)
2. **[한 줄 요약]** — [자세히](#앵커)
3. [업그레이드 가이드](/react/updates/upgrade/v2)

</Callout>

## [하이라이트 1]

무엇이 달라졌는지 한두 문단. 필요하면 코드 예시.

<ComponentExample name="react/menu/preview">   {/* 아래 "라이브 프리뷰" 참고 — children 필수 */}
  ...
</ComponentExample>

## [하이라이트 2]

...

## 그 외

- [소소한 개선·버그 수정 불릿]

<Cards>
  <Card href="/react/updates/upgrade/v2" title="업그레이드 가이드" description="2.1로 올릴 때 필요한 작업" />
  <Card href="/react/updates/changelog" title="전체 변경사항" description="패키지·버전별 changelog" />
</Cards>
```

### tl;dr

**필수다.** 릴리즈 노트는 처음부터 끝까지 읽는 글이 아니라 훑고 점프하는 글이다.

- 3~5개 항목. 그보다 많으면 하이라이트 선별이 덜 된 것이다.
- 각 항목은 굵은 한 줄 + 본문 앵커 링크.
- 앵커는 h2 제목의 소문자 kebab (한글 제목이면 그대로). 작성 후 실제로 동작하는지 dev 서버에서 확인한다.
- breaking change가 있으면 tl;dr에 업그레이드 가이드 링크를 넣는다.

### 하이라이트 h2

- 제목은 **기능 이름이 아니라 사용자가 얻는 것**으로 짓는다.
  - ❌ `## Grid 컴포넌트 responsive prop`
  - ✅ `## 넓은 화면과 마우스 환경`
- h3는 그 안에서 항목이 여럿일 때만. 2단(h2 > h3)을 넘기지 않는다.
- 각 하이라이트는 마지막에 문서 링크로 닫는다. 릴리즈 노트는 진입점이지 레퍼런스가 아니다.

### breaking change

**설명하고 보낸다.** 절차는 `/react/updates/upgrade/vN`에 있다.

```mdx
## 시맨틱 버저닝을 준수합니다

[왜 이렇게 바뀌는지 서사]

<Callout type="warn">
업그레이드에 필요한 코드 변경은 [SEED React 2 업그레이드 가이드](/react/updates/upgrade/v2)에 정리했습니다.
</Callout>
```

## 사용 가능한 MDX 컴포넌트

`docs/components/mdx-components.tsx`에 등록된 것만 쓴다. **새로 만들지 않는다** — 새 컴포넌트는
`docs/app/_llms/rules/` 변환 룰 + fixture가 따라와야 하고, 없으면 llms.txt에 raw JSX가 샌다.

| 컴포넌트 | 용도 | 예시 |
|---|---|---|
| `Callout` | tl;dr, 주의, 배경 설명 | `<Callout type="info" title="tl;dr">` — `type`: `info`/`warn`/`error`/`success`/`idea` |
| `ComponentExample` | 컴포넌트 라이브 프리뷰 | 아래 "라이브 프리뷰" 참고 |
| `BlockPreview` | Block 라이브 프리뷰 | `<BlockPreview name="side-navigation-01">` |
| `Card` / `Cards` | 마무리 CTA, 문서 링크 묶음 | `<Card href title description />` |
| `Badge` | 상태 라벨 | `<Badge tone="brand">` — `neutral`/`warning`/`informative`/`positive`/`critical`/`brand` |
| `Tabs` / `Tab` | 프레임워크·환경별 분기 | `<Tabs items={["React", "Lynx"]}>` |
| `Steps` / `Step` | 순서 있는 절차 | 릴리즈 노트에선 드물다. 업그레이드 가이드 쪽 도구다 |
| `TypeTable` | prop 표 | 새 API를 상세히 보여줄 때. 보통은 문서 링크로 충분하다 |
| ` ```package-install ` | 패키지 설치 코드블록 | 버전 명시가 필요할 때 |

일반 코드블록은 ` ```tsx `. `pre`가 SEED Codeblock으로 오버라이드돼 있어 별도 처리가 필요 없다.

## 라이브 프리뷰

`ComponentExample`은 **children(코드블록)을 넘겨야 "미리보기 / 코드" 탭이 있는 프레임 카드로** 렌더된다.
children 없이 `<ComponentExample name="..." />`만 쓰면 테두리 없는 320px 빈 영역에 컴포넌트만 떠서
산문 사이에서 붕 뜬다. 컴포넌트 문서와 같은 형태로 쓴다:

````mdx
<ComponentExample name="react/menu/preview">
  ```json doc-gen:file
  {
    "file": "examples/react/menu/preview.tsx",
    "codeblock": true
  }
  ```
</ComponentExample>
````

- `name`은 `docs/examples/<name>.tsx` 경로다. 쓰기 전에 파일이 실재하는지 확인한다.
- `doc-gen:file`의 `file`은 `docs/` 기준 상대 경로다. `name`과 같은 파일을 가리켜야 한다.
- 오버레이 컴포넌트(Side Panel, Menu Sheet 등)는 프리뷰가 트리거 버튼 하나만 보여준다.
  한 문서에 그런 프리뷰를 여러 개 넣지 말고 문서 링크로 대체한다.
- Blocks(`BlockPreview`)는 400px iframe이라 릴리즈 노트에는 무겁다. 문서 링크를 쓴다.

## 이미지

우선순위: **라이브 프리뷰 → 캡쳐 → 없음**. 캡쳐 이미지는 컴포넌트가 바뀌면 낡는다.

캡쳐가 불가피할 때만:

- 경로: `docs/public/updates/<slug>/NN-name.webp` (`NN`은 01부터 등장 순서)
- 마크다운: `![무엇을 보여주는 이미지인지](/updates/<slug>/NN-name.webp)`
  - `img`는 `ImageZoom`으로 오버라이드돼 있어 클릭 확대·radius·로딩 배경이 자동으로 붙는다
  - `alt`는 **한국어 설명문**이다. 파일명이나 "스크린샷" 같은 말로 채우지 않는다
- 변환: `bun images:convert` (ffmpeg 기반)
- **커버 이미지(`coverImage` frontmatter)는 만들지 않는다.** 생략하면 OG가 Updates 섹션 카드로
  폴백하고, 인덱스 리스트 행은 애초에 썸네일을 안 쓴다.
