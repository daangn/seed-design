# Snapshot Release 런북

`seed-snapshot-release`가 현재 PR의 정확한 snapshot 실행을 시작하거나 재사용할 때 따르는 상세 절차다. `SKILL.md`에는 라우팅과 경계만 두고, 실행 명령과 polling은 이 문서에서 관리한다.

## 1. 실행 identity

재사용할 실행은 다음 값을 모두 일치시켜야 한다.

- repository: 현재 PR 저장소의 `OWNER/REPO`
- PR number: 현재 PR 번호
- source-sha: 현재 PR의 HEAD SHA
- control-sha: trusted default-branch workflow의 SHA
- trigger-comment-id: 실행을 시작한 `/snapshot` 댓글의 서버 ID
- run-id와 run-attempt: 같은 실행의 결과를 가리키는 식별자

`gh run list`의 workflow·event·createdAt은 후보를 찾는 데만 사용한다. `📦 Snapshot Release` 댓글의 최신 여부만으로 실행이나 tarball을 연결하지 않는다. workflow가 댓글에 붙인 `<!-- seed-snapshot-metadata {...} -->` identity를 읽고, 현재 PR 번호와 HEAD SHA가 모두 일치하는지 확인한다. metadata가 없거나 값이 다르면 해당 실행과 tarball을 재사용하지 말고 새 실행을 사용한다.

run을 재사용하기 전 현재 PR HEAD를 다시 읽는다. 탐색 중 PR HEAD가 바뀌면 기존 결과를 보고하지 않고 최신 SHA에서 새 실행을 시작한다.

특정 run의 artifact를 받을 때는 반드시 run ID를 넘긴다.

```bash
gh run download <RUN_ID> --name "snapshot-release-output-<RUN_ID>" --dir "$TMPDIR/snapshot"
```

## 2. 대상과 로컬 상태

```bash
NUM=$(gh pr view --json number --jq .number)
gh pr view --json number,url,headRefOid \
  --jq '{number, url, sourceSha: .headRefOid}'
gh api "repos/{owner}/{repo}/issues/$NUM/comments" --paginate --slurp |
  jq '[.[][] | select(.body == "/snapshot")] | last | {commentId: .id, commentAt: .created_at}'
echo "---DIRTY---"
git status --short
echo "---UNPUSHED---"
git log @{u}..HEAD --oneline 2>/dev/null || echo "(no upstream tracking)"
```

PR이 없으면 중단한다. 기존 `/snapshot` 댓글이 있으면 새 댓글을 쓰지 않고 서버가 반환한 댓글 ID와 생성 시각을 보존한다. 해당 댓글 이후의 실행 중 metadata의 `trigger-comment-id`가 댓글 ID와 같은 실행만 이어간다. 로컬 dirty/unpushed 상태는 이미 원격에서 실행된 snapshot의 결과를 바꾸지 않는다.

## 3. `/snapshot` 게시 승인과 작성자 권한

- 대기 전용 요청인데 댓글이 없으면 새 댓글을 게시하지 않는다.
- 명시적인 trigger 요청은 댓글 게시 승인이다.
- 의도가 모호하면 로컬 상태를 보여주고 댓글 게시 여부를 확인한다.
- 사용자가 `Push, then post /snapshot`을 선택한 경우에만 push한다. 그 외에는 remote HEAD에 대해 게시한다.

댓글 게시 전 `gh api user`로 인증 계정을 확인하고, 저장소 API로 해당 계정의 권한 근거를 확인한다. GitHub workflow의 허용 association은 `OWNER`, `MEMBER`, `COLLABORATOR`뿐이므로 다음 중 하나가 확인되지 않으면 게시하지 않는다.

1. 현재 계정이 PR의 기존 댓글에서 `author_association`이 `OWNER`, `MEMBER`, `COLLABORATOR`로 확인됨.
2. 기존 댓글이 없는 경우, 저장소 소유자와 계정을 비교한 뒤 `gh api repos/{owner}/{repo}/collaborators/{login}/permission`의 `role_name` 또는 `permissions`가 collaborator/member에 해당하는 push·maintain·admin 권한으로 확인됨.

권한 endpoint가 404·403이거나 계정이 허용 association으로 판정되지 않으면 중단한다. 인증 계정을 확인하지 않은 상태에서 댓글 생성 API를 호출하지 않는다.

## 4. 실행 orchestration

아래 값을 현재 PR과 승인 결과로 채운다. `<PUSH_FIRST>`가 `1`일 때만 push한다.

```bash
set -euo pipefail

NUM=<NUM>
OWNER='<OWNER>'
REPO='<REPO>'
COMMENT_ID='<COMMENT_ID_OR_EMPTY>'
COMMENT_AT='<COMMENT_AT_OR_EMPTY>'
PUSH_FIRST='<PUSH_FIRST>'
SNAPSHOT_META_DIR=$(mktemp -d)
trap 'rm -rf "$SNAPSHOT_META_DIR"' EXIT

if [ -z "$COMMENT_ID" ]; then
  if [ "$PUSH_FIRST" = "1" ]; then
    git push
  fi
  COMMENT_JSON=$(gh api --method POST "repos/$OWNER/$REPO/issues/$NUM/comments" -f body='/snapshot')
  COMMENT_ID=$(jq -er '.id' <<< "$COMMENT_JSON")
  COMMENT_AT=$(jq -er '.created_at' <<< "$COMMENT_JSON")
fi

RUN_ID=""
for _ in $(seq 1 30); do
  while read -r CANDIDATE_ID CANDIDATE_ATTEMPT; do
    CANDIDATE_DIR="$SNAPSHOT_META_DIR/$CANDIDATE_ID-$CANDIDATE_ATTEMPT"
    mkdir -p "$CANDIDATE_DIR"
    if gh run download "$CANDIDATE_ID" \
      --name "snapshot-release-metadata-$CANDIDATE_ID-$CANDIDATE_ATTEMPT" \
      --dir "$CANDIDATE_DIR" >/dev/null 2>&1 &&
      jq -e --argjson comment_id "$COMMENT_ID" \
        '.["trigger-comment-id"] == $comment_id' \
        "$CANDIDATE_DIR/snapshot-metadata.json" >/dev/null; then
      RUN_ID="$CANDIDATE_ID"
      break
    fi
  done < <(gh run list --workflow=continuous-releases.yml --limit 20 \
    --json databaseId,createdAt,event,attempt \
    --jq ".[] | select(.event == \"issue_comment\" and .createdAt >= \"$COMMENT_AT\") | [.databaseId, .attempt] | @tsv")
  [ -n "$RUN_ID" ] && break
  sleep 2
done

[ -n "$RUN_ID" ] || { echo "no Continuous Releases run matched comment $COMMENT_ID" >&2; exit 1; }
gh run watch "$RUN_ID" --exit-status || WATCH_EXIT=$?
```

`createdAt >= "$COMMENT_AT"` 조건은 후보 범위만 줄인다. 최종 `RUN_ID`는 artifact의 `trigger-comment-id`가 서버 댓글 ID와 같은 실행으로 정한다. run을 고른 뒤에는 `gh run view "$RUN_ID" --json databaseId,attempt,headSha,event`와 결과 댓글의 metadata를 함께 확인한다. `headSha`는 issue-comment workflow의 control SHA일 수 있으므로 PR source SHA 비교에 사용하지 않는다. source SHA는 metadata와 `gh pr view --json headRefOid`를 비교한다.

실행이 성공하면 같은 run ID·attempt·PR·source/control SHA가 metadata에 있는 `📦 Snapshot Release` 댓글만 결과로 보고한다. 실행이 실패하거나 취소되면 failed steps를 보여주며, 다른 실행의 이전 댓글은 결과로 재사용하지 않는다.

```bash
echo "---SNAPSHOT_RELEASE_COMMENT---"
gh pr view "$NUM" --json comments \
  --jq '[.comments[] | select(.body | contains("📦 Snapshot Release")) | select(.body | contains("<!-- seed-snapshot-metadata"))] | last | .body // ""' \
  || true

if [ "${WATCH_EXIT:-0}" -ne 0 ]; then
  echo "---FAILED_STEPS---"
  gh run view "$RUN_ID" --json jobs \
    --jq '.jobs[].steps[] | select(.conclusion != "success" and .conclusion != "skipped") | {name, conclusion}' \
    || true
fi

exit "${WATCH_EXIT:-0}"
```

## 5. 결과 보고

성공 시 검증한 동일 실행의 `📦 Snapshot Release` 본문과 tarball URL을 그대로 보여주고, install hint를 한 줄 덧붙인다.

```bash
bun add https://pkg.pr.new/@seed-design/<package>@<sha>
```

실패·취소 시 failed steps와 가능한 원인을 보여준다. 동일 run identity에 연결된 부분 게시 결과가 있을 때만 함께 언급한다. metadata가 없는 댓글, 다른 PR·SHA·attempt의 결과, 최신이라는 이유만으로 선택한 댓글은 보고하지 않는다.

댓글 본문은 정확히 `/snapshot`이어야 한다. `Continuous Releases`는 default branch의 `issue_comment` context에서 실행되므로 PR branch를 `--branch`로 필터링하지 않는다. 반복 게시가 같은 SHA를 대상으로 한다면 가장 최근의 **identity가 일치하는** 실행과 결과 댓글을 사용한다.
