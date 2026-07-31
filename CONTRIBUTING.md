# 기여 가이드

SEED에 기여해 주셔서 감사합니다. 이 문서는 개발 환경 셋업과 PR 규칙을 다룹니다.

## 시작하기 전에

오타 수정, 문서 보완, 버그 픽스는 바로 PR을 올려 주세요.

아래 변경은 PR 전에 [이슈](https://github.com/daangn/seed-design/issues)로 먼저 논의해 주세요. 방향이 맞지 않으면 작업이 헛수고가 됩니다.

- 새 컴포넌트 추가
- 공개 API 변경
- 새 패키지 추가
- 외부 의존성 추가

## 개발 환경

Node 24(`.nvmrc`), Bun 1.3.13(CI 기준)이 필요합니다.

```bash
bun install
bun ecosystem:build
bun install
bun generate:all
bun packages:build
```

`bun install`을 두 번 실행하는 게 맞습니다.

`bun packages:build`는 `packages/*`만 빌드하고 `ecosystem/*`은 제외하므로, 토큰과 스타일을 생성하는 `rootage`·`qvism` CLI를 `bun ecosystem:build`로 먼저 빌드해야 합니다. 그리고 CLI가 빌드된 뒤에 두 번째 `bun install`이 워크스페이스 bin 링크를 걸어 줘야 `bun generate:all`이 이 레포의 CLI를 사용합니다. 이 링크가 없으면 `generate:all`이 조용히 다른 CLI를 실행해서, 명령은 성공했는데 생성물이 하나도 갱신되지 않습니다.

## 확인 방법

| 목적 | 명령어 |
| --- | --- |
| 문서 사이트 | `bun docs:dev` |
| Storybook | `bun storybook` |
| 전체 테스트 | `bun test:all` |
| 포맷 정리 | `bun biome format --fix` |

패키지별 빌드·테스트 명령어는 [TECH.md](./TECH.md)의 「주요 명령어」에 정리돼 있습니다.

## 컴포넌트 작업

컴포넌트를 추가하거나 여러 레이어(rootage 스키마 → qvism recipe → react 패키지 → 문서)에 걸친 변경을 할 때는 레포에 포함된 `create-component` 스킬을 참고해 주세요. 플랫폼 결정, 카테고리별 패턴, 작업 순서와 검증까지 안내합니다.

Claude Code를 쓰신다면 클론 직후 `/create-component`로 바로 사용할 수 있습니다. `skills/`가 원천이고 `.claude/skills`가 이 디렉터리로의 심링크입니다.

## changeset

사용자에게 보이는 변경(기능 추가, 버그 픽스, 스타일 변경)에는 changeset이 필요합니다. `.changeset/*.md`를 직접 작성하지 말고 `changeset` 스킬을 사용해 주세요. 변경된 패키지를 감지해 bump 종류를 정하고 유저향 메시지를 작성합니다. Claude Code에서는 `/changeset`입니다.

문서 수정이나 내부 리팩터링만 있다면 changeset 없이 올려도 됩니다.

## 커밋 · PR 규칙

커밋 메시지와 PR 제목은 **영어**로, [Conventional Commits](https://www.conventionalcommits.org/) 형식을 따릅니다.

```text
type(scope): subject
```

```text
feat(button): add loading state
fix(tooltip): correct z-index
docs: update component rules
```

코드에는 주석을 넣지 않습니다. 변경 이유와 배경은 PR 본문에 적어 주세요. 코드만 읽어서는 알 수 없는 워크어라운드나 외부 제약처럼 정말 필요한 경우에만 주석을 남기고, 이때는 한국어로 씁니다.

## 생성 파일

토큰과 스타일 CSS의 일부 경로는 rootage·qvism이 만들어내는 산출물입니다. 직접 수정하면 다음 생성 때 덮어써집니다. 원천 파일을 고친 뒤 `bun generate:all`을 실행해서 생성물을 함께 커밋해 주세요.

어느 경로가 생성물인지는 [TECH.md](./TECH.md)의 「생성 파일 직접 수정 금지」에 있습니다. 컴포넌트 작업이라면 `create-component` 스킬에 원천·생성물 대응표가 있습니다.

## 라이선스

SEED는 [Apache-2.0](./LICENSE)으로 배포됩니다. PR을 올리면 기여물이 같은 Apache-2.0 조건으로 제출된 것으로 봅니다(Apache License 2.0 제5조 Submission of Contributions).

본인이 직접 작성하지 않은 코드나 에셋이 포함된다면 **출처와 라이선스를 PR 본문에 적어 주세요.** 출처를 확인할 수 없으면 머지할 수 없습니다.

당근 로고·캐릭터 등 브랜드 리소스는 [NOTICE](./NOTICE)의 별도 조항을 따릅니다.
