#!/usr/bin/env bash

set -u -o pipefail

readonly SOURCE_BRANCH="dev"
readonly TARGET_BRANCHES=("minor" "major")
readonly REMOTE="origin"

failures=0
failed_branches=()

short_sha() {
  local sha="$1"
  printf '`%s`' "${sha:0:12}"
}

append_result() {
  local branch="$1"
  local before="$2"
  local after="$3"
  local status="$4"
  local details="$5"

  printf '| `%s` | %s | %s | %s | %s |\n' \
    "$branch" "$before" "$after" "$status" "$details" >> "$GITHUB_STEP_SUMMARY"
}

initialize_summary() {
  local trigger="수동 실행"

  if [[ "${GITHUB_EVENT_NAME:-}" == "pull_request_target" ]]; then
    trigger="Changesets Version PR #${VERSION_PR_NUMBER:-unknown} 병합"
  fi

  {
    echo "# 릴리스 브랜치 동기화"
    echo
    echo "- 실행 사유: ${trigger}"
    echo "- 기준 브랜치: \`${SOURCE_BRANCH}\`"
    echo "- 기준 커밋: $(short_sha "$source_sha")"
    echo
    echo "| 브랜치 | 이전 커밋 | 이후 커밋 | 결과 | 상세 |"
    echo "| --- | --- | --- | --- | --- |"
  } >> "$GITHUB_STEP_SUMMARY"
}

write_failure_prompt() {
  local repository="${GITHUB_REPOSITORY:-owner/repository}"
  local run_url="${GITHUB_SERVER_URL:-https://github.com}/${repository}/actions/runs/${GITHUB_RUN_ID:-unknown}"

  {
    echo
    echo "<details>"
    echo "<summary>AI 수정용 프롬프트</summary>"
    echo
    echo '```text'
    echo "다음 GitHub Actions 브랜치 동기화 실패를 수정해 주세요."
    echo
    echo "- 저장소: ${repository}"
    echo "- 실행 결과: ${run_url}"
    echo "- 기준 브랜치: ${SOURCE_BRANCH}"
    echo "- 기준 커밋: ${source_sha}"
    echo "- 실패 브랜치: ${failed_branches[*]}"
    echo
    echo "작업 요구사항:"
    echo "1. 저장소의 AGENTS.md와 위 Actions 실행의 Summary 및 로그를 먼저 확인해 정확한 실패 원인을 파악합니다."
    echo "2. origin의 최신 ${SOURCE_BRANCH}와 실패 브랜치를 가져와 로컬에서 실패를 재현합니다."
    echo "3. 각 실패 브랜치를 ${SOURCE_BRANCH} 위로 리베이스합니다. 충돌이 있으면 양쪽 변경 의도를 확인해 해결합니다."
    echo "4. ${SOURCE_BRANCH} 브랜치는 수정하지 않습니다. 성공적으로 리베이스한 대상 브랜치만 갱신합니다."
    echo "5. 푸시 전 원격 SHA가 바뀌지 않았는지 확인하고 --force-with-lease를 사용합니다. 동시 변경은 덮어쓰지 않습니다."
    echo "6. 저장소 지침에 맞는 생성 및 테스트 명령을 실행합니다."
    echo "7. 브랜치별 이전·이후 SHA, 해결한 충돌, 검증 결과를 보고합니다."
    echo '```'
    echo
    echo "</details>"
  } >> "$GITHUB_STEP_SUMMARY"
}

sync_branch() {
  local branch="$1"
  local before_sha
  local after_sha
  local remote_refs

  if ! remote_refs="$(git ls-remote --heads "$REMOTE" "refs/heads/$branch")"; then
    append_result "$branch" "-" "-" "실패" "원격 브랜치 상태를 조회하지 못했습니다."
    return 1
  fi

  before_sha="$(awk 'NR == 1 { print $1 }' <<< "$remote_refs")"

  if [[ -z "$before_sha" ]]; then
    if git push --force-with-lease="refs/heads/$branch:" "$REMOTE" \
      "refs/remotes/$REMOTE/$SOURCE_BRANCH:refs/heads/$branch"; then
      append_result "$branch" "없음" "$(short_sha "$source_sha")" "생성" \
        "\`${SOURCE_BRANCH}\`와 같은 커밋에서 생성했습니다."
      return 0
    fi

    append_result "$branch" "없음" "-" "실패" \
      "브랜치 생성 중 원격 상태가 변경되었거나 푸시가 거부되었습니다."
    return 1
  fi

  if [[ "$before_sha" == "$source_sha" ]]; then
    append_result "$branch" "$(short_sha "$before_sha")" "$(short_sha "$before_sha")" \
      "변경 없음" "이미 \`${SOURCE_BRANCH}\`와 같습니다."
    return 0
  fi

  if ! git fetch --no-tags "$REMOTE" \
    "+refs/heads/$branch:refs/remotes/$REMOTE/$branch"; then
    append_result "$branch" "$(short_sha "$before_sha")" "-" "실패" \
      "원격 브랜치를 가져오지 못했습니다."
    return 1
  fi

  if ! git switch --force-create "$branch" "refs/remotes/$REMOTE/$branch"; then
    append_result "$branch" "$(short_sha "$before_sha")" "-" "실패" \
      "로컬 작업 브랜치를 준비하지 못했습니다."
    return 1
  fi

  if ! git rebase "refs/remotes/$REMOTE/$SOURCE_BRANCH"; then
    git rebase --abort || true
    append_result "$branch" "$(short_sha "$before_sha")" "-" "실패" \
      "\`${SOURCE_BRANCH}\` 기준 리베이스에서 충돌이 발생했습니다. 원격 브랜치는 변경하지 않았습니다."
    return 1
  fi

  after_sha="$(git rev-parse HEAD)"
  if [[ "$after_sha" == "$before_sha" ]]; then
    append_result "$branch" "$(short_sha "$before_sha")" "$(short_sha "$after_sha")" \
      "변경 없음" "리베이스 결과가 기존 브랜치와 같습니다."
    return 0
  fi

  if git push --force-with-lease="refs/heads/$branch:$before_sha" "$REMOTE" \
    "HEAD:refs/heads/$branch"; then
    append_result "$branch" "$(short_sha "$before_sha")" "$(short_sha "$after_sha")" \
      "갱신" "\`${SOURCE_BRANCH}\` 위로 리베이스했습니다."
    return 0
  fi

  append_result "$branch" "$(short_sha "$before_sha")" "-" "실패" \
    "실행 중 원격 상태가 변경되었거나 푸시가 거부되었습니다."
  return 1
}

if ! git fetch --no-tags "$REMOTE" \
  "+refs/heads/$SOURCE_BRANCH:refs/remotes/$REMOTE/$SOURCE_BRANCH"; then
  echo "원격 ${SOURCE_BRANCH} 브랜치를 가져오지 못했습니다." >&2
  source_sha="확인 실패"
  failures=1
  failed_branches+=("$SOURCE_BRANCH")
  initialize_summary
  append_result "$SOURCE_BRANCH" "-" "-" "실패" "원격 기준 브랜치를 가져오지 못했습니다."
  write_failure_prompt
  exit 1
fi

source_sha="$(git rev-parse "refs/remotes/$REMOTE/$SOURCE_BRANCH")"
git config user.name "github-actions[bot]"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
initialize_summary

for branch in "${TARGET_BRANCHES[@]}"; do
  if ! sync_branch "$branch"; then
    failures=$((failures + 1))
    failed_branches+=("$branch")
  fi
done

if ((failures > 0)); then
  {
    echo
    echo "> ${failures}개 브랜치를 동기화하지 못했습니다. 위 결과를 확인해 주세요."
  } >> "$GITHUB_STEP_SUMMARY"
  write_failure_prompt
  exit 1
fi

{
  echo
  echo "> 모든 릴리스 브랜치 동기화를 마쳤습니다."
} >> "$GITHUB_STEP_SUMMARY"
