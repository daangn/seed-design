---
name: seed-changeset
description: SEED Design 저장소의 현재 Git 변경에서 공개 패키지 후보와 기존 changeset 포함 여부를 찾고, 사용자 확인을 거쳐 패키지 bump와 한국어 changeset 메시지를 작성한다. 브랜치 선택이나 패키지 배포에는 사용하지 않는다.
---

# SEED Changeset

현재 diff에서 릴리스 후보를 찾되, 변경 의미와 bump를 자동으로 추측하지 않는다. 패키지별 bump와 메시지를 사용자가 확인한 뒤에만 `.changeset/*.md` 또는 dependency floor를 수정한다.

## 후보 계획

저장소 루트에서 읽기 전용 계획 스크립트를 실행한다.

```bash
bun skills/seed-changeset/scripts/changeset-plan.ts --base-ref origin/dev
```

`--base-ref`에는 `seed-change-plan`과 같은 실제 기준 브랜치를 지정한다. 리베이스 전에는 현재 feature의 기존 기준 브랜치를 사용하고, 리베이스 뒤 최종 확인에서만 확정된 `targetRef`를 사용한다.

출력에서 다음 항목을 확인한다.

- `candidates`: 지정한 `baseRef` 이후 Git 변경에 포함된 공개 workspace 패키지다. rename은 이전·새 경로를 모두 포함하며, 삭제된 패키지는 `baseRef`의 `package.json`으로 복원한다.
- `excluded`: private 또는 `packages/archive/*`라서 changeset 후보에서 빠진 패키지다.
- `coveredBy`: 기존 `.changeset/*.md`가 이미 후보를 다루는지 보여준다. 기존 파일로 충분한지 확인하고 중복 changeset을 만들지 않는다.
- `reverseDependencies`: 변경 후보를 의존하는 공개 workspace 패키지다. 실제 전파 여부를 판단할 때 사용한다.
- `peerFloorReviewCandidates`: peer dependency floor를 검토할 수 있는 목록이다. 목록에 있다는 이유만으로 수정하지 않는다.

스크립트는 base 이후 커밋과 index, worktree, untracked 파일을 합친다. stacked 변경이 섞였다면 각 후보의 diff와 커밋 로그를 읽고 이번 작업에 해당하는 패키지만 남긴다.

## bump 확정

먼저 [version-matrix.md](references/version-matrix.md)를 읽는다. 후보별 공개 표면 변경과 역의존 사용처를 직접 확인한 뒤 `major`, `minor`, `patch`, `안함(제외)` 중 하나를 추천한다.

패키지마다 추천과 근거를 보여주고 사용자에게 확정받는다. 스크립트는 변경 의미, bump, 배포 브랜치를 결정하지 않는다.

css의 `minor`를 확정했다면 `peerFloorReviewCandidates`와 매트릭스의 "실제로 쓰는" 표를 함께 확인한다. 새 기능을 실제로 소비하는 패키지만 peer dependency floor를 올리고 ceiling은 바꾸지 않는다.

headless의 `minor`를 확정했다면 `reverseDependencies`에서 React 등 실제 소비 패키지를 확인하고 전파 changeset이 필요한지 판단한다. dependency floor나 전파 changeset을 수정할 때도 먼저 대상과 값을 사용자에게 확인받는다.

## 메시지 작성과 승인

[patterns.md](references/patterns.md)를 읽고 디자인 시스템 소비자 관점의 한국어 메시지를 작성한다. 독립적인 변경은 파일을 나누고, 한 변경의 전파 패키지는 한 파일에 묶는다.

다음 초안을 사용자에게 보여준다.

````text
## Changeset 초안

| 패키지 | bump |
|--------|------|
| @seed-design/react | patch |

```changeset
---
"@seed-design/react": patch
---

사용자에게 보이는 변경을 설명합니다.
```
````

사용자가 bump와 메시지를 승인하기 전에는 파일을 쓰지 않는다. 수정 요청이 있으면 초안을 다시 보여준다.

## 파일 작성

승인 뒤 `.changeset/<형용사-명사-동사>.md`를 새로 만든다. 기존 파일명과 충돌하지 않는 영어 소문자 세 단어를 사용하고, frontmatter 패키지명은 쌍따옴표로 감싼다. 기존 파일을 덮어쓰지 않는다.

작성 뒤 계획 스크립트를 다시 실행해 후보 coverage를 확인한다. 가장 높은 확정 bump는 최종 `seed-change-plan`의 브랜치 판단 근거로 사용하되, 이 스킬에서 rebase, commit, push, PR 생성을 수행하지 않는다.
