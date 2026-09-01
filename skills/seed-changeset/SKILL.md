---
name: seed-changeset
description: SEED 저장소의 현재 Git 변경에서 공개 패키지 후보와 기존 changeset 포함 여부를 찾고, 사용자 확인을 거쳐 패키지 bump와 한국어 changeset 메시지를 작성한다. peer dependency 범위, 브랜치, 배포는 변경하지 않는다.
---

# SEED Changeset

현재 diff에서 릴리스 후보를 찾고, 공개 출력에 미치는 영향으로 bump를 정한다. 변경 의미와 bump는 자동으로 추측하지 않는다. 사용자가 패키지별 bump와 메시지를 승인한 뒤에만 `.changeset/*.md`를 작성한다.

이 스킬은 `package.json`의 dependency 또는 peer dependency 범위를 수정하지 않는다. 새 기능 때문에 필요한 peer dependency 하한 조정은 Version Changes PR에서 수동으로 처리한다.

## 후보 계획

저장소 루트에서 읽기 전용 계획 스크립트를 실행한다.

```bash
bun skills/seed-changeset/scripts/changeset-plan.ts --base-ref origin/dev
```

`--base-ref`에는 `seed-change-plan`이 선택한 실제 기준 브랜치를 지정한다. 리베이스 전에는 feature 브랜치의 기존 기준을 사용한다. 리베이스 뒤 최종 확인에서는 확정된 `targetRef`를 사용한다.

결과에서 다음 항목을 확인한다.

- `candidates`: 기준 브랜치 이후 변경된 공개 workspace 패키지다. rename은 이전·새 경로를 모두 포함한다. 삭제된 패키지는 기준 브랜치의 `package.json`으로 복원한다.
- `excluded`: private 또는 `packages/archive/*`라서 changeset 후보에서 제외된 패키지다.
- `coveredBy`: 기존 `.changeset/*.md`가 후보를 이미 다루는지 보여준다. 충분한 파일이 있으면 중복 changeset을 만들지 않는다.
- `reverseDependencies`: 변경 후보를 의존하는 공개 workspace 패키지다. 실제 공개 영향이 전파되는지 판단할 때 사용한다.
- `versionChangesReviewCandidates`: Version Changes PR에서 peer dependency 하한을 검토할 후보 목록이다. 현재 작업에서는 이 목록의 `package.json`을 수정하지 않는다.

스크립트는 기준 브랜치 이후 커밋, index, worktree, untracked 파일을 합쳐 보여준다. stacked 변경이 섞였다면 후보의 diff와 커밋 로그를 직접 읽고 이번 작업에 속한 패키지만 남긴다.

## bump 확정

[version-matrix.md](references/version-matrix.md)를 읽는다. 후보별 공개 export, 타입, prop, Recipe, 토큰, 렌더 결과, 접근성 동작을 직접 확인하고 `major`, `minor`, `patch`, `안함(제외)` 중 하나를 추천한다.

표준 SemVer를 모든 패키지에 동일하게 적용한다. Lynx 패키지도 breaking은 `major`, 하위 호환 기능 추가는 `minor`, 버그 수정은 `patch`다.

역의존 패키지는 실제로 새 기능을 소비하거나 변경을 공개 표면에 노출할 때만 동반 bump 후보가 된다. 의존 관계가 있다는 사실만으로 동반 bump를 만들지 않는다. 이 판단은 changeset 범위를 정하기 위한 것이며 dependency range 편집을 허용하지 않는다.

패키지마다 추천 bump와 근거를 사용자에게 보여주고 확정받는다. 스크립트는 변경 의미, bump, 배포 브랜치를 결정하지 않는다.

## 메시지 작성과 승인

[patterns.md](references/patterns.md)를 읽고 디자인 시스템 소비자 관점의 한국어 메시지를 작성한다. 하나의 사용자 변화가 여러 패키지에 전파되면 한 파일에 묶는다. 서로 독립적인 변화는 파일을 나눈다.

다음 형식으로 초안을 보여준다.

````text
## Changeset 초안

| 패키지 | bump |
| --- | --- |
| @seed-design/react | patch |

```changeset
---
"@seed-design/react": patch
---

사용자에게 보이는 변경을 설명합니다.
```
````

사용자가 bump와 메시지를 승인하기 전에는 파일을 쓰지 않는다. 수정 요청이 있으면 반영한 초안을 다시 보여준다.

## 파일 작성과 확인

승인 뒤 `.changeset/<형용사-명사-동사>.md`를 새로 만든다. 기존 파일명과 충돌하지 않는 영어 소문자 세 단어를 사용한다. frontmatter 패키지명은 쌍따옴표로 감싼다. 기존 파일은 덮어쓰지 않는다.

계획 스크립트를 같은 `baseRef`로 다시 실행해 coverage를 확인한다. `versionChangesReviewCandidates` 중 실제 새 기능 소비자는 최종 보고에 Version Changes PR 후속 항목으로 남긴다. 이 작업에서 peer range를 편집하지 않는다.

가장 높은 확정 bump는 최종 `seed-change-plan`의 브랜치 판단 근거로 전달한다. 이 스킬에서는 rebase, commit, push, PR 생성, 배포를 수행하지 않는다.
