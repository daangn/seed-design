---
name: seed-snapshot-release
description: PR snapshot release를 trigger하거나 결과를 확인할 때 사용한다.
---

# Snapshot Release

End-to-end orchestration of the snapshot-release flow for the PR connected to the current branch:

1. (optionally) post a `/snapshot` comment if none exists,
2. wait for the `Continuous Releases` workflow to finish,
3. report the tarball URLs from the resulting `📦 Snapshot Release` PR comment.

Supports kicking off a fresh snapshot *or* picking up one that's already in flight or already finished.

## 재실행

이미 `/snapshot` 댓글이 있으면 새 댓글을 쓰지 않고 진행 중이거나 완료된 실행을 이어서 확인한다. 댓글 게시 뒤 중단됐어도 다시 실행하면 해당 실행을 찾는다.

## Step 1: Discover

PR 정보와 로컬 상태를 함께 확인한다. 아래 명령은 필요한 값을 한 번에 수집하는 예시다.

```bash
gh pr view --json number,url,comments \
  --jq '{number, url, anchor: ([.comments[] | select(.body == "/snapshot")] | last | .createdAt // "")}'
echo "---DIRTY---"
git status --short
echo "---UNPUSHED---"
git log @{u}..HEAD --oneline 2>/dev/null || echo "(no upstream tracking)"
```

- `gh pr view` exits non-zero (no PR for current branch) → stop and tell the user.
- `anchor` non-empty → fast path. The local git state doesn't matter here (the run already exists and was built from whatever was on remote at that time). Skip Step 2 and run Step 3 with the anchor as-is.
- `anchor` empty → run Step 2. Carry the `DIRTY` and `UNPUSHED` sections into the next step so the user sees them before deciding.

## Step 2: Confirm trigger (only when no `/snapshot` exists)

현재 요청을 먼저 구분한다.

- **대기 전용 요청**(예: "snapshot 기다려줘", "snapshot 끝났어?", "결과 보여줘")인데 `/snapshot` 댓글이 없으면, 댓글이 없음을 알리고 멈춘다. 사용자가 직접 게시하거나 trigger 요청으로 다시 실행할 수 있다고 안내한다.
- **명시적인 trigger 요청**(예: "snapshot 해줘", "trigger a snapshot", "`/snapshot`을 게시해줘")은 댓글 게시 승인이다. 같은 실행에 대해 다시 승인받지 않는다.
- trigger 의도가 모호하면 아래 상태를 포함해 댓글 게시 여부를 확인한다.

Snapshot release는 PR의 *remote* HEAD로 빌드하므로 uncommitted 변경이나 unpushed commit은 tarball에 포함되지 않는다.

- **Clean tree, fully pushed**: `/snapshot` 댓글을 게시할지 확인한다.
- **Clean tree, but unpushed commits exist**: unpushed commit 수를 알리고 `Push, then post /snapshot` / `Post anyway against remote HEAD` / `Stop, I'll handle it` 중 하나를 확인한다.
- **Uncommitted changes**: push 선택지를 제안하지 않는다. 로컬 전용 변경이 tarball에 빠짐을 알리고 `Stop, I'll handle it` / `Post anyway against remote HEAD` 중 하나를 확인한다.

`Stop`이면 commit·push 뒤 다시 실행하도록 알린다. 사용자가 `Push, then post /snapshot`을 선택하면 `PUSH_FIRST=1`, 명시 trigger 또는 `Post anyway`면 `PUSH_FIRST=0`으로 Step 3을 실행한다.

## Step 3: Orchestrate

아래 흐름으로 필요하면 push·`/snapshot` 댓글 게시·실행 대기·결과 댓글 조회를 이어서 수행한다. `<NUM>`, `<ANCHOR>`, `<PUSH_FIRST>`에는 Step 1·2의 값을 넣는다. 댓글을 새로 게시할 때 `<ANCHOR>`는 비워 두고, 사용자가 명시적으로 push를 승인한 경우에만 `<PUSH_FIRST>`를 `1`로 둔다.

```bash
set -euo pipefail

NUM=<NUM>
ANCHOR='<ANCHOR>'
PUSH_FIRST='<PUSH_FIRST>'  # "1" or "0"

# Trigger path: optionally push, then post /snapshot
if [ -z "$ANCHOR" ]; then
  if [ "$PUSH_FIRST" = "1" ]; then
    git push
  fi
  gh pr comment "$NUM" --body "/snapshot"
  ANCHOR=$(date -u +%Y-%m-%dT%H:%M:%SZ)
fi

# Find the matching Continuous Releases run (handle the brief registration delay)
RUN_ID=""
for _ in $(seq 1 10); do
  RUN_ID=$(gh run list --workflow=continuous-releases.yml --limit 5 \
    --json databaseId,createdAt,event \
    --jq "[.[] | select(.event == \"issue_comment\" and .createdAt >= \"$ANCHOR\")] | .[0].databaseId // empty")
  [ -n "$RUN_ID" ] && break
  sleep 2
done

if [ -z "$RUN_ID" ]; then
  echo "no matching Continuous Releases run found after polling" >&2
  exit 1
fi

# Stream until the run finishes; preserve its exit code even on non-success
WATCH_EXIT=0
gh run watch "$RUN_ID" --exit-status || WATCH_EXIT=$?

# Always print the latest 📦 Snapshot Release body, even on failure (may not exist)
echo "---SNAPSHOT_RELEASE_COMMENT---"
gh pr view "$NUM" --json comments \
  --jq '[.comments[] | select(.body | contains("📦 Snapshot Release"))] | last | .body // ""' \
  || true

# On non-success, surface the failed / incomplete steps for diagnosis
if [ "$WATCH_EXIT" -ne 0 ]; then
  echo "---FAILED_STEPS---"
  gh run view "$RUN_ID" --json jobs \
    --jq '.jobs[].steps[] | select(.conclusion != "success" and .conclusion != "skipped") | {name, conclusion}' \
    || true
fi

exit $WATCH_EXIT
```

긴 실행은 백그라운드에서 시작하고 완료 알림을 기다린다. 상태를 반복 조회하지 않는다.

## Step 4: Report to the user

Parse the orchestrator output:

- **On success** (exit 0): Show the `📦 Snapshot Release` body to the user as-is — the tarball URLs are the payload they're after. Include a one-line install hint:

  ```bash
  bun add https://pkg.pr.new/@seed-design/<package>@<sha>
  ```

- **On failure / cancellation** (exit ≠ 0): Show the failed steps and likely causes (dependency install failure, build failure, network reachability, etc.). If a `📦 Snapshot Release` comment from a prior run is present, mention it too so the user knows whether anything was published.

## Notes

- The comment body must be **exactly** `/snapshot` — no surrounding whitespace or extra text — or the workflow won't trigger.
- `Continuous Releases` runs on the `issue_comment` event in the default branch (`dev`) context, so the run's `headBranch` won't match the PR branch. Don't filter by `--branch`; match on workflow file + anchor time + `event == "issue_comment"`.
- If multiple PRs could be involved or the user means a different PR, ask for the PR number explicitly.
- For repeated `/snapshot` comments on the same SHA, always use the **most recent** workflow run and the **most recent** `📦 Snapshot Release` comment.
