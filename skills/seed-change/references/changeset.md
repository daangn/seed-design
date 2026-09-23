# Changeset

현재 diff에서 릴리스 후보를 찾고, 공개 출력에 미치는 영향으로 bump를 정한다. 사용자가 현재 요청에서 패키지별 bump와 메시지를 확정했거나 초안을 승인한 뒤에만 `.changeset/*.md`를 쓴다.

이 분기에서는 `package.json`의 dependency·peer dependency 범위를 고치지 않는다 → 필요한 peer 하한 조정은 [version-matrix.md](version-matrix.md)「peer dependency 후속 처리」대로 최종 보고에 남긴다.

## 후보 계획

저장소 루트에서 읽기 전용 계획 스크립트를 실행한다.

```bash
bun skills/seed-change/scripts/changeset-plan.ts --base-ref origin/dev
```

`--base-ref`는 `origin/dev`, `origin/minor`, `origin/major`만 받는다. 생략하면 `.changeset/config.json`의 `baseBranch`(`dev`)로 `origin/dev`, 없으면 로컬 `dev`를 쓴다. [변경 계획](impact-plan.md)이 고른 실제 기준 브랜치를 명시한다. 리베이스 전에는 feature 브랜치의 기존 기준을, 리베이스 뒤 최종 확인에서는 확정된 `targetRef`를 쓴다.

결과에서 다음을 확인한다.

- `candidates`: 기준 브랜치 이후 변경된 공개 workspace 패키지. rename은 이전·새 경로를 모두 포함하고, 삭제된 패키지는 기준 브랜치의 `package.json`으로 복원한다.
- `candidates[].coveredBy`: 그 후보를 이미 다루는 기존 `.changeset/*.md` 경로. 충분한 파일이 있으면 중복 changeset을 만들지 않는다. 전체 목록은 `existingChangesets`에 있다.
- `excluded`: `reasons`가 `private`나 `archive`(`packages/archive/*`)라서 후보에서 빠진 패키지.
- `reverseDependencies`: 후보를 `dependencies`·`optionalDependencies`·`peerDependencies`로 의존하는 공개 workspace 패키지. 공개 영향이 전파되는지 판단할 때 쓴다.
- `versionChangesReviewCandidates`: `reverseDependencies` 중 `peerDependencies` 관계만 모은 목록. 현재 작업에서는 이 목록의 `package.json`을 고치지 않는다.

스크립트는 기준 브랜치 이후 커밋, index, worktree, untracked 파일을 합쳐 보여 준다. stacked 변경이 섞였으면 후보의 diff와 커밋 로그를 직접 읽고 이번 작업에 속한 패키지만 남긴다.

## bump 확정

1. [version-matrix.md](version-matrix.md)를 읽는다. Lynx `0.x` 정책과 새 공개 패키지의 시작 버전도 거기에 있다.
2. 후보마다 공개 export, 타입, prop, Recipe, 토큰, 렌더 결과, 접근성 동작을 직접 확인하고 `major`, `minor`, `patch`, `안함(제외)` 중 하나를 추천한다.
3. 역의존 패키지는 version-matrix「실제 소비 패키지 판단」에 해당할 때만 동반 bump 후보로 둔다. 이 판단은 changeset 범위를 정할 뿐 dependency range 편집을 허용하지 않는다.
4. 패키지마다 추천 bump와 근거를 보여 주고, 현재 요청에서 이미 확정하지 않았으면 확정받는다. 스크립트는 변경 의미, bump, 배포 브랜치를 결정하지 않는다.

## 메시지 작성과 승인

[patterns.md](patterns.md)를 읽고 디자인 시스템 소비자 관점의 한국어 메시지를 쓴다. 하나의 사용자 변화가 여러 패키지에 전파되면 한 파일에 묶고, 서로 독립적인 변화는 파일을 나눈다.

초안은 `## Changeset 초안` 제목, 패키지별 bump 목록(`- @seed-design/react: patch`), 파일마다 `changeset` 코드 블록 순서로 보여 준다.

```changeset
---
"@seed-design/react": patch
---

사용자에게 보이는 변경을 설명합니다.
```

현재 요청에서 bump와 메시지가 확정되지 않았으면 파일을 쓰기 전에 초안을 승인받는다. 수정 요청이 있으면 반영한 초안을 다시 보여 준다.

## 파일 작성과 확인

1. 승인 뒤 [patterns.md](patterns.md)「파일 형식」대로 새 파일을 만든다. 기존 파일은 덮어쓰지 않는다.
2. 같은 `--base-ref`로 계획 스크립트를 다시 실행해 `coveredBy`를 확인한다.
3. `versionChangesReviewCandidates` 중 새 기능을 실제로 소비하는 패키지는 최종 보고에 Version Changes PR 후속 항목으로 남긴다.
4. 가장 높은 확정 bump를 최종 [변경 계획](impact-plan.md)의 `--bump` 근거로 보고한다. 작성한 `.changeset/*.md`가 변경 경로에 있으면 `change-plan.ts`가 그 bump를 자동으로 읽는다.

changeset 승인은 commit·push·PR 승인이 아니다. 이 분기에서는 rebase, commit, push, PR 생성, 배포를 하지 않는다 → 사용자가 제출을 요청하면 [submit.md](submit.md)로 넘어간다.
