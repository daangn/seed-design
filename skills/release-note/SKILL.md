---
name: release-note
description: docs 사이트 Updates 섹션에 실릴 릴리스 노트(`docs/content/updates/<slug>.mdx`, `category: release`)를 작성합니다. CHANGELOG·git 이력·PR 내용을 모아 하이라이트를 선별하고, 라이브 프리뷰와 캡쳐를 붙여 초안을 만듭니다. "릴리스 노트 써줘", "이번 달 업데이트 정리해줘", "SEED React N 릴리스 노트", "release note" 요청에 사용합니다.
user-invocable: true
argument-hint: "[버전·기간·주제]"
---

# Release Note

SEED 사용자에게 "무엇이 달라졌고 왜 달라졌는지"를 전하는 **큐레이션된 하이라이트 문서**를 쓴다.

## 다른 문서와의 경계

이 스킬이 만드는 건 아래 표의 두 번째 줄이다. 나머지 셋과 내용을 복제하지 않는다.

| 문서 | 성격 | 릴리스 노트와의 관계 |
|---|---|---|
| `/react/updates/changelog` | 패키지·버전별 전수 나열 (기계 생성) | 릴리스 노트 마지막에 링크 |
| **릴리스 노트 (이 스킬)** | **선별된 하이라이트 서사** | — |
| `/react/updates/upgrade/vN` | 마이그레이션 작업 지시 | breaking change는 **설명만 하고 여기로 보낸다** |
| `/updates/*` (`category: post`) | 에세이형 블로그 | 별개 |

**업그레이드 절차를 릴리스 노트에 복제하지 않는다.** 두 벌이 되면 갈라진다.

## 실행 절차

### Phase 1. 범위 확정 (AskUserQuestion)

발행 단위는 자유다 — 특정 React 버전일 수도, 문서 사이트 개편일 수도, 한 달치 묶음일 수도 있다. **추측하지 말고 물어본다.**

물을 것:
1. **무엇에 대한 릴리스 노트인가** — 버전 범위(`@seed-design/react@2.0.0..2.1.0`) / 기간(`2026-07-01..2026-08-04`) / 특정 주제
2. 이미 같은 범위를 다룬 `docs/content/updates/*.mdx`(`category: release`)가 있으면 알리고, 새로 쓸지 고칠지 확인

### Phase 2. 변경 수집

**1차 소스는 `docs/lib/parse-changelog.ts`다.** 21개 `CHANGELOG.md`를 이미
`{package, version, commitRefs, contentBlocks, isDependencyOnly, relatedPackages}`로 파싱해 두었고,
`docs/lib/changelog-data.ts`가 `Updated dependencies` 노이즈까지 병합해 준다. git을 처음부터 다시 긁지 않는다.

```bash
# 대상 패키지 CHANGELOG를 직접 읽는 게 가장 빠르다 (파서가 소비하는 원본과 동일)
sed -n '1,200p' packages/react/CHANGELOG.md
```

보조 소스:

```bash
# 이 레포는 squash merge라 `--merges`는 빈 결과다. 반드시 --oneline 전체 로그를 쓴다.
git log dev --since=2026-07-01 --until=2026-08-05 --oneline
```

로그에서 **걸러낼 것**: `Version Packages`, `Revert "…"`, `Update rootage generated json`,
그리고 소비자에게 안 보이는 `chore`/`ci`/`build`/`test`/내부 `refactor`.

PR 본문·스크린샷·논의가 필요하면:

```bash
gh auth switch --hostname github.com --user junghyeonsu   # daangn 스코프는 이 계정이어야 한다
gh pr view <번호> --json title,body,files
```

### Phase 3. 하이라이트 선별 (AskUserQuestion)

수집한 변경을 **featured / 언급만 / 제외** 로 분류해 제안하고 확정받는다.

판단 기준은 하나: **"소비자가 이걸 모르면 손해인가."**

- **featured** — 새 컴포넌트, 새 API·토큰, 눈에 보이는 동작 변화, breaking change, 오래 묵은 버그 수정
- **언급만** — 소소한 버그 수정, DX 개선. 마지막 `## 그 외` 불릿으로
- **제외** — 내부 리팩토링, 문서 오탈자, 의존성 bump, 생성물 동기화

featured가 6개를 넘으면 묶을 축(예: "넓은 화면 지원", "폼 요소 개선")을 찾아 h2로 그룹핑한다.

### Phase 4. 초안 작성

`references/writing.md`를 **읽고** 톤·구조·컴포넌트 선택 규칙에 따라 작성한다.

출력 경로: `docs/content/updates/<kebab-case-slug>.mdx`

```yaml
---
title: SEED React 2.1
description: 한 문장. 인덱스 리스트와 OG 설명에 그대로 쓰인다.
publishedAt: 2026-07-28T00:00:00+09:00
category: release
---
```

- **`category: release` 필수.** 빼면 블로그 카드로 렌더된다.
- **`coverImage`는 넣지 않는다.** 생략하면 OG가 Updates 섹션 카드(`/og/updates.png`)로 폴백하고
  타이틀·설명은 이 글 자신의 frontmatter를 쓴다 (`docs/lib/seo.ts`의 `buildDocsPageMetadata`).
  릴리스마다 3200×1680 커버를 만들 필요가 없다.
- 슬러그는 `content/updates/`가 **평면 네임스페이스**다 (`app/updates/[slug]`는 단일 세그먼트 라우트라
  하위 디렉토리를 만들면 404). `seed-react-2-1`, `docs-renewal-2026-08`처럼 짓는다.

### Phase 5. 이미지

**라이브 프리뷰가 1순위다.** 캡쳐한 이미지는 컴포넌트가 바뀌면 낡지만 프리뷰는 안 낡는다.

1. **컴포넌트** → `<ComponentExample name="react/<name>/preview" />`
   먼저 `docs/registry/`에 그 preview가 실재하는지 확인한다. 없으면 문서 링크로 대체한다.
2. **Blocks** → `<BlockPreview name="<block>-01">`
3. **프리뷰로 표현 불가**(전/후 비교, 모션, Figma 원본, 이미 지워진 API) → 캡쳐
   ```bash
   bun --filter @seed-design/docs dev          # :3000
   bun --filter @seed-design/docs storybook    # :6006 (테마·폰트스케일 변형이 필요할 때)
   ```
   Playwright MCP(`.mcp.json`에 등록됨)로 캡쳐 → `bun images:convert`(ffmpeg)로 webp 변환 →
   `docs/public/updates/<slug>/NN-name.webp`에 저장 → MDX에서 `![설명](/updates/<slug>/NN-name.webp)`.
   `alt`는 장식이 아니라 **무엇을 보여주는 이미지인지** 한국어로 쓴다.
4. **커버 이미지는 만들지 않는다** (Phase 4 참고).

### Phase 6. 검증

```bash
bun --filter @seed-design/docs dev
#   /updates            → Release Notes 리스트에 새 행이 뜨는가
#   /updates/<slug>     → 우측 ToC, tl;dr, 라이브 프리뷰가 렌더되는가
bun --filter @seed-design/docs build
```

본문에 쓴 `/react/...` 내부 링크가 실존하는지 확인한다 (`docs/content/` 아래 해당 mdx 존재 여부).

## 주의사항

- 커밋 메시지·changeset 문구를 **그대로 옮기지 않는다.** 소비자(개발자)에게 무엇이 달라지는지로 다시 쓴다.
- 문서에 없던 MDX 컴포넌트를 새로 만들지 않는다 — 만들면 `docs/app/_llms/rules/` 변환 룰과 fixture가
  따라와야 하고, 없으면 llms.txt에 raw JSX가 샌다 (`docs/AGENTS.md`).
- 산문에서 "SEED Design"이라 쓰지 않는다. **"SEED"** (패키지명·저장소명은 예외).

## 참조 파일

- `references/writing.md` — 톤·문체, MDX 템플릿, 사용 가능한 컴포넌트
