---
id: lynx-split-base-branch
description: Lynx 1.0(DES-2608 하위) 컴포넌트의 공개 Headless 분리 티켓을 시작·제출하거나, 선례 Headless 패키지가 현재 checkout에 없거나, 기준 브랜치 이동으로 PR이 충돌하거나 rebase가 다른 lane 커밋까지 재생할 때 읽는다. 선례가 있는 원격 브랜치로 작업 기준·PR base를 정하는 방법, `--onto`로 자체 커밋만 옮기고 이름을 바꾼 파일과 충돌한 기준 쪽 변경을 이식하는 방법, 학습 기록 커밋을 기능 PR과 분리하는 방법, base 변경과 force push 순서를 다룬다. dev 대상 일반 기능 작업에는 적용하지 않는다.
scope: ["packages/lynx-react/**", "packages/lynx-react-headless/**", "docs/examples/lynx/**", "examples/lynx-spa/**"]
status: active
related: ["workspace-installation", "verify-baseline-test-failures"]
---

# Lynx 1.0 분리 작업의 기준 브랜치는 선례가 지금 있는 원격 브랜치로 매번 확인한다

## 교훈과 다음 행동

- 작업 시작과 제출 직전에 선례 PR의 현재 위치를 확인하고, 작업 브랜치 기준과 PR base를 그 브랜치에 맞춘다.
  - `gh pr list --state all --search '<선례 컴포넌트> headless' --json number,title,baseRefName,state`
  - `git branch -a --contains <선례 sha>` → `git show origin/<branch>:<경로>`로 선례 파일을 읽는다.
  - 2026-09-28 기준 Lynx 1.0 분리 작업은 dev 기반 `refactor-lynx-components`에 있다.
- 기준을 옮길 때는 `git rebase <새 기준>`을 쓰지 않는다. 기존 기준(`oldBase`)을 확정하고 `git rebase --onto <새 기준> <oldBase>`로 자체 커밋만 옮긴다. `seed-change` submit 절차와 같다. 자체 커밋이 0개여도 같은 명령을 쓴다.
- 새 기준이 dev에서 가져온 변경이, 이번 작업에서 이름을 바꾸거나 지운 파일과 modify/delete로 충돌할 수 있다. 이때는 기준 쪽 diff(`git diff <oldBase> <새 기준> -- <옛 경로>`)를 읽어 새 파일에 같은 의미로 옮긴다. 그런 다음 element tree parity 기준을 새 기준 브랜치에서 다시 수집해 비교한다.
- 학습 기록 커밋은 기능 PR에 넣지 않고 dev 대상 별도 PR로 올린다. `git worktree add -b docs/<ticket>-agent-learnings /tmp/<ticket>/learnings origin/dev`에서 편집·커밋한 뒤 `gh pr create --base dev`로 올린다.
- 학습 기록은 dev PR로만 쌓이므로 `refactor-lynx-components` checkout의 `.agents/learnings/`는 최신이 아니다. 작업 시작과 문서·제출 결정 직전에 `git fetch origin && git log --oneline <기준>..origin/dev -- .agents/learnings`로 새 항목을 찾고 `git show origin/dev:.agents/learnings/entries/<id>.md`로 읽는다.
- PR base를 바꿔야 하면 `gh pr edit <n> --base <branch>`를 먼저 하고 `--force-with-lease`로 push한다. base가 `dev|minor|major`인 상태에서 push하면 그 base 전용 workflow(Kapture Capture)가 실행되고, 직후 base를 바꾸면 실패 기록이 head SHA에 남는다.
- 기준 checkout에 필요한 skill 스크립트가 없으면 `mkdir -p /tmp/<ticket>/skills-dev && git archive origin/dev skills/seed-change | tar -x -C /tmp/<ticket>/skills-dev` 뒤 저장소 루트에서 실행한다. `change-plan.ts`의 `--base-ref`는 `origin/dev|minor|major`만 받으므로 다른 기준 브랜치는 직접 검증 명령을 고른다.
- 기준을 옮긴 뒤 `bun generate:all`이 이번 변경과 무관한 생성물(예: `docs/public/__docs__/index.json`의 다른 문서 항목)을 바꾸면 기준 브랜치의 기존 차이일 수 있다. diff가 자신의 문서 변경과 관련 없으면 되돌리고 PR에 섞지 않는다.

## 발생 근거와 적용 조건

- DES-2612(ActionButton) 계획 중 `origin/dev` 기반 checkout의 `packages/lynx-react-headless/`만 보고 선례를 찾았다. 당시 DES-2611 Accordion 분리(#2270)는 `origin/minor`에만 있었다.
- 작업을 minor로 옮겨 #2293을 올린 뒤 #2270이 minor에서 revert(#2294)되고 `refactor-lynx-components`로 다시 들어가(#2295) PR이 충돌했다. 같은 PR에 넣은 학습 기록 커밋도 rebase에서 add/add·modify/delete 충돌을 냈다.
- #2293은 base가 `minor`인 상태에서 force push한 뒤 base를 바꿔 Kapture Capture `context`가 `Live pull request does not match the exact Kapture capture context`로 실패했다. 새 base는 이 workflow의 대상이 아니라 다시 실행되지 않았다.
- `refactor-lynx-components`로 옮긴 뒤 `bun generate:all`은 Lynx getting-started 문서 3건의 index 차이만 만들었고, ActionButton 변경과 무관해 포함하지 않았다.
- DES-2613(AppBar)에서 자체 커밋 없이 dev 기반이던 브랜치를 `git rebase --autostash origin/minor`로 옮기자, minor에 없는 dev 커밋 28개가 feature 커밋처럼 다시 쌓였다. 브랜치를 기준에 다시 맞춰 되돌렸다.
- DES-2613을 `refactor-lynx-components`로 옮길 때, 이 기준에 들어 있던 dev #2283(AppBar 높이 56px 통합)이 수정한 `packages/lynx-react/src/components/AppBar/useAppBar.ts`와 충돌했다. 이 작업에서는 그 파일을 `useStyledAppBar.ts`로 바꾸고 원래 파일은 지웠다. #2283의 높이 변경을 새 파일로 옮기고, `origin/refactor-lynx-components`에서 다시 수집한 parity와 byte 단위로 같은지 확인했다.
- DES-2618(FloatingActionButton)은 작업 중 dev에 추가된 `lynx-headless-no-docs`(#2317, "Headless는 별도로 문서화하지 않는다")를 기준 checkout에서 보지 못해 FAB 문서에 `## Headless` 절을 넣은 채 PR(#2320)을 올렸다. 학습 PR을 dev 위로 rebase하다 발견해 절을 지우는 커밋을 추가했다.
- DES-2620(Dialog)도 dev 기반 checkout에서 학습 기록을 조회한 뒤 `refactor-lynx-components`로 옮겨 `lynx-headless-no-docs`를 보지 못했다. Dialog 문서에 `## Headless` 절과 `headless.tsx` 예제를 넣었다가, 학습 브랜치를 dev 위로 rebase하며 발견해 커밋 전에 지웠다.
- 피할 패턴: 현재 checkout의 파일 목록이나 한 번 확인한 결과만으로 선례 위치와 기준 브랜치를 고정하는 것. 학습 기록 커밋을 기능 PR에 섞는 것.
- 위험: 형제 티켓마다 다른 기준에서 작업하고, 선례가 옮겨지면 PR이 충돌한다.

## 변경 이력

- 2026-09-28: DES-2612 작업의 `AGENT_LEARNINGS.md` 항목을 이관하면서 base 이동·학습 PR 분리·force push 순서 교훈을 합쳤다. 개인 환경 정보는 제외했다.
- 2026-09-28: DES-2613의 기준 이동 사례를 근거로 `--onto` 이동과 rename 충돌 이식 절차를 보강했다.
- 2026-09-29: DES-2618에서 dev에만 있는 최신 학습 항목을 놓친 사례로 조회 절차를 추가했다.
- 2026-09-29: DES-2620에서 같은 누락이 반복된 근거를 추가했다.
