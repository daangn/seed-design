#!/usr/bin/env bash

FILE_PATH=$(jq -r '.tool_input.file_path // .tool_input.filePath // .tool_input.path // empty')

if [[ "$FILE_PATH" == *".changeset/"* ]]; then
  BASENAME=$(basename "$FILE_PATH")

  # config.json과 README.md는 절대 수정 금지
  if [[ "$BASENAME" == "config.json" || "$BASENAME" == "README.md" ]]; then
    cat >&2 <<'EOF'

.changeset/config.json과 README.md는 직접 수정할 수 없습니다.

EOF
    exit 2
  fi

  # changeset .md 파일은 경고만 출력 (차단하지 않음)
  if [[ "$FILE_PATH" == ".changeset/"*.md ]]; then
    cat >&2 <<'EOF'

changeset 파일을 작성합니다.
/changeset 스킬을 사용하면 git diff 분석 기반으로 유저향 메시지를 자동 생성할 수 있습니다.

EOF
    exit 0
  fi

  cat >&2 <<'EOF'

.changeset/ 아래에서는 .md changeset 파일만 작성할 수 있습니다.

EOF
  exit 2
fi
