# Snapshot Release 런북

`seed-snapshot-release`가 현재 PR의 snapshot 실행을 시작하거나 재사용할 때 따르는 절차다. 게시 승인 조건은 `SKILL.md`「적용 조건」을 따른다.

## 1. 실행 identity

`.github/workflows/continuous-releases.yml`(workflow 이름 `Continuous Releases`)은 PR 댓글이 `/snapshot`으로 시작하고 작성자 association이 `OWNER`·`MEMBER`·`COLLABORATOR`일 때 실행된다. 실행마다 다음 metadata를 남긴다.

- artifact `snapshot-release-metadata-<run-id>-<run-attempt>` 안의 `snapshot-metadata.json`
- 성공 결과 댓글 끝의 `<!-- seed-snapshot-metadata {...} -->`

metadata 키와 재사용 조건:

- `repository`: 현재 PR 저장소의 `OWNER/REPO`
- `pr-number`: 현재 PR 번호
- `source-sha`: 실행이 PR을 조회한 시점의 PR HEAD SHA
- `control-sha`: trusted default-branch workflow의 SHA
- `trigger-comment-id`: 실행을 시작한 `/snapshot` 댓글의 서버 ID
- `run-id`, `run-attempt`: 같은 실행의 결과를 가리키는 식별자

재사용할 실행은 이 값이 모두 현재 요청과 일치해야 한다.

- `gh run list`의 workflow·event·createdAt은 후보를 좁히는 데만 쓴다.
- 최신 `📦 Snapshot Release` 댓글이라는 이유로 실행이나 tarball을 연결하지 않는다 → 댓글의 metadata를 읽고 PR 번호와 현재 HEAD SHA가 모두 일치하는지 확인한다. metadata가 없거나 값이 다르면 그 실행과 tarball을 쓰지 않고 새 실행을 쓴다.
- run을 재사용하기 직전에 PR HEAD를 다시 읽는다. 탐색 중 HEAD가 바뀌었으면 기존 결과를 보고하지 않고 최신 SHA에서 새로 실행한다.
- `gh run view`의 `headSha`는 issue-comment workflow의 control SHA다. PR source SHA 비교에 쓰지 않고, metadata의 `source-sha`와 `gh pr view --json headRefOid`를 비교한다.

특정 run의 publish 결과 artifact는 run ID를 넘겨 받는다. 보존 기간은 1일이다.

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

- PR이 없으면 멈춘다.
- 기존 `/snapshot` 댓글이 있으면 서버가 반환한 댓글 ID와 생성 시각을 보존하고, metadata의 `trigger-comment-id`가 그 ID와 같은 실행만 이어간다.
- 그 실행의 `source-sha`가 현재 PR HEAD와 다르면 기존 댓글을 재사용하지 않는다 → 새 trigger로 보고 3절의 게시 조건을 확인한다.
- 로컬 dirty·unpushed 상태는 이미 원격에서 실행된 snapshot 결과를 바꾸지 않는다.

## 3. `/snapshot` 게시와 작성자 권한

- 사용자가 `Push, then post /snapshot`을 고른 경우에만 push한다. 그 밖에는 원격 PR HEAD를 대상으로 게시한다.
- 댓글 본문은 정확히 `/snapshot`으로 쓴다. 2절의 기존 댓글 조회가 본문 완전 일치로 찾기 때문이다.

댓글을 게시하기 전에 `gh api user`로 인증 계정을 확인하고, 다음 중 하나로 허용 association 근거를 확인한다.

1. 현재 계정이 이 PR에 남긴 기존 댓글의 `author_association`이 `OWNER`, `MEMBER`, `COLLABORATOR` 중 하나다.
2. 기존 댓글이 없으면 저장소 소유자와 계정을 비교한 뒤, `gh api repos/{owner}/{repo}/collaborators/{login}/permission`의 `role_name` 또는 `permissions`가 collaborator·member에 해당하는 push·maintain·admin 권한이다.

권한 endpoint가 404·403이거나 허용 association으로 판정되지 않으면 멈춘다. 인증 계정을 확인하지 않은 상태에서 댓글 생성 API를 호출하지 않는다.

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

- `createdAt >= "$COMMENT_AT"` 조건은 후보 범위만 줄인다. 최종 `RUN_ID`는 metadata artifact의 `trigger-comment-id`가 서버 댓글 ID와 같은 실행이다.
- workflow는 default branch의 `issue_comment` context에서 실행된다 → `gh run list`를 PR branch로 `--branch` 필터링하지 않는다.
- concurrency group이 PR 번호별(`snapshot-release-<PR>`)이고 `cancel-in-progress: false`다. 같은 PR의 이전 실행이 끝날 때까지 새 실행은 대기하고, metadata artifact도 그때까지 생기지 않는다.
- 60초 안에 run을 찾지 못하면 → `gh run list --workflow=continuous-releases.yml`에서 댓글 시각 이후 run의 상태를 확인해 보고한다. 댓글을 다시 게시하지 않는다.
- run을 고른 뒤 `gh run view "$RUN_ID" --json databaseId,attempt,headSha,event`와 결과 댓글의 metadata를 함께 확인한다.
- 같은 SHA에 여러 번 게시했다면 identity가 일치하는 실행 중 가장 최근 것과 그 결과 댓글을 쓴다.

결과 댓글과 실패 step 출력은 같은 스크립트에 이어서 실행한다. 결과 댓글은 metadata의 `run-id`·`run-attempt`·`trigger-comment-id`·`source-sha`가 모두 일치하는 것만 고른다.

```bash
RUN_ATTEMPT=$(gh run view "$RUN_ID" --json attempt --jq .attempt)
SOURCE_SHA=$(gh pr view "$NUM" --json headRefOid --jq .headRefOid)

echo "---SNAPSHOT_RELEASE_COMMENT---"
gh api "repos/$OWNER/$REPO/issues/$NUM/comments" --paginate --slurp |
  jq -r --argjson run "$RUN_ID" --argjson attempt "$RUN_ATTEMPT" \
    --argjson cid "$COMMENT_ID" --arg sha "$SOURCE_SHA" '
    [.[][] | .body as $b
      | ($b | capture("<!-- seed-snapshot-metadata (?<m>\\{.*\\}) -->")? | .m | fromjson) as $m
      | select($m["run-id"] == $run and $m["run-attempt"] == $attempt
               and $m["trigger-comment-id"] == $cid and $m["source-sha"] == $sha)
      | $b] | last // ""' || true

if [ "${WATCH_EXIT:-0}" -ne 0 ]; then
  echo "---FAILED_STEPS---"
  gh run view "$RUN_ID" --json jobs \
    --jq '.jobs[].steps[] | select(.conclusion != "success" and .conclusion != "skipped") | {name, conclusion}' \
    || true
fi

exit "${WATCH_EXIT:-0}"
```

## 5. 결과 보고

workflow 동작:

- package publish(`release` job)가 성공해야 결과 댓글이 달린다. publish가 실패하면 결과 댓글은 없고 trigger 댓글에 `-1` reaction이 붙는다.
- Rootage가 바뀐 PR은 Rootage CDN snapshot도 게시한다. 이 단계만 실패하면 결과 댓글에 "Rootage CDN 게시에 실패" 문구가 들어가고 실행은 실패로 끝난다. 같은 SHA에서 `/snapshot`을 다시 실행할 수 있다.
- 전체 성공이면 trigger 댓글에 `rocket` reaction이 붙는다.

보고:

- 성공: 같은 run ID·attempt·PR·source/control SHA가 metadata에 있는 `📦 Snapshot Release` 댓글 본문과 tarball URL을 그대로 보여 주고, 설치 힌트를 한 줄 덧붙인다. URL은 추측하지 않고 댓글이 나열한 package URL을 그대로 쓴다: `bun add <댓글의 pkg.pr.new URL>`.
- 성공인데 일치하는 결과 댓글이 없음 → 다른 댓글로 대신하지 않는다. `gh run view "$RUN_ID" --json jobs`로 `Comment snapshot result` job 결과를 확인해 함께 보고한다.
- 실패·취소: failed steps와 가능한 원인을 보여 준다. 같은 run identity에 연결된 부분 게시 결과(예: Rootage CDN만 실패한 결과 댓글)가 있을 때만 함께 언급한다.
- metadata가 없는 댓글, 다른 PR·SHA·attempt의 결과, 최신이라는 이유만으로 고른 댓글은 보고하지 않는다.
