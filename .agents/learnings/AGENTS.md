# .agents/learnings

에이전트가 작성·관리하고 사람이 검토할 수 있는 저장소 내부 학습 기록이다. 폴더명은 용도를 나타내며 접근 제어나 자동 로딩을 제공하지 않는다.

## 검증

- 변경한 항목의 필수 필드·고유 ID·적용 경로·관계 대상을 확인하고, 같은 범위의 기록과 중복되거나 충돌하지 않는지 읽는다.
- `superseded`의 대체 기록과 `promoted`의 이동 문서가 존재하는지 확인한다. 대체 관계는 자기 자신을 가리키거나 순환하지 않게 한다.
- `git diff --check -- AGENTS.md AGENT_LEARNINGS.md .agents/learnings`로 공백을 확인한다. 새 파일도 직접 읽어 링크·형식을 검토한다. 문서 변경에는 제품 테스트·빌드를 실행하지 않는다.

## 규칙

### 형식

- `entries/<id>.md`에 교훈 하나를 둔다. 별도 수동 인덱스는 만들지 않고 각 파일의 frontmatter를 원천으로 삼는다.
- 필수 필드는 `id`, `description`, `scope`, `status`다. `id`는 고유한 kebab-case 파일명이며 제목을 바꿔도 유지한다. `description`에는 언제 읽어야 하는지 적는다.
- `scope`는 저장소 루트 기준 경로 패턴의 배열이다. 공통 교훈은 `["**"]`로 표시한다. 경로 외에도 작업을 찾을 수 있도록 `description`에 도구·오류·작업 키워드를 넣는다.
- 조회 예시에 맞게 필드는 한 줄로 쓰고, `id`·`status`는 따옴표 없는 값, 배열은 `["값"]` 형식을 쓴다. 설명에 `: ` 등이 있으면 문자열 전체를 따옴표로 감싼다.
- 선택 필드 `related`는 관련 교훈 ID 배열, `superseded_by`는 대체 교훈 ID 하나, `promoted_to`는 규칙으로 옮긴 문서의 저장소 상대 경로 배열이다. 관계는 필요한 방향으로만 기록하며 역방향 링크를 의무화하지 않는다.
- 실제 재검증을 수행했을 때만 `verified_at`에 `"YYYY-MM-DD"`를 쓰고 본문에 검증 범위와 증거를 적는다. 이관·편집·조회 날짜로 대체하지 않는다. `active` 자체는 현재 코드에서 재검증했다는 뜻이 아니다.
- 본문은 아래 세 소제목을 사용한다. 원인·환경·버전·증거를 보존하고 같은 내용을 반복하지 않는다. 원본 로그 전체 대신 판단에 필요한 실패와 확인 결과를 남긴다.

```markdown
---
id: docs-build-prerequisites
description: 새 worktree에서 docs 검증을 준비하거나 workspace 모듈 누락을 조사할 때 읽는다.
scope: ["docs/**"]
status: active
related: ["workspace-installation"]
---

# 새 worktree의 docs 검증은 선행 lib 빌드가 필요하다

## 교훈과 다음 행동

## 발생 근거와 적용 조건

## 변경 이력
```

### 상태와 관계

- `active`: 기본 읽기 대상이다. 적용 조건과 현재 코드가 맞는지 확인하고 사용한다.
- `superseded`: 다른 교훈에 병합·대체되었다. `superseded_by`와 변경 이력에 병합 이유를 남기고, 다른 기록의 관련 링크도 실제 의미에 맞게 갱신한다.
- `promoted`: 항상 지킬 규칙으로 정착해 가장 좁은 `AGENTS.md`나 관련 Skill로 옮겼다. `promoted_to`와 변경 이력에 이동 근거를 남긴다. 이후 규칙은 이동한 문서를 원천으로 삼는다.
- `retired`: 더 이상 유효하지 않다. 본문에 판단 근거를 남긴다. 비활성 기록은 삭제하지 않고 기본 조회에서 제외한다.
- 끊어진 링크·사라진 적용 경로는 재검토 대상으로 삼는다. 연결이 없는 독립 교훈이나 오래된 기록은 그것만으로 폐기하지 않는다. 서로 모순되면 근거·환경·버전 조건을 비교하고, 최신 작성일만으로 한쪽을 채택하지 않는다.
- 교훈은 사용자 요청과 해당 경로의 현재 규칙 안에서 적용한다. 충돌하면 사용자 요청과 현재 규칙을 따르고 기록의 조건·상태를 재검토한다.

## 작업 절차

### 읽기

1. 작업 시작 시 이 규칙을 읽고 경로·키워드로 메타데이터를 조회한다. 관련 `active` 본문만 읽어 계획에 반영한다.
2. 관련성이 있으면 `related` 대상의 메타데이터도 확인한다. 비활성 기록을 직접 찾았으면 상태와 대체·이동 경로를 먼저 확인한다. 모든 관계의 본문을 재귀적으로 읽지는 않는다.
3. 범위가 불명확하거나 후보가 없으면 키워드를 넓히거나 활성 메타데이터 전체를 조회한다. 중요한 결정 전에는 관련 교훈만 다시 확인하고, 과거 명령·버전 정보는 현재 코드와 대조한다.

저장소 루트에서 다음 예시의 검색어를 작업에 맞게 바꾼다. 경로 패턴을 자동 매칭하는 명령은 아니므로 출력된 `scope`의 적용 여부를 판단한다. 공통 교훈의 메타데이터는 항상 포함한다. `learning_query='.'`이면 활성 메타데이터 전체를 본다.

Bash가 없는 하네스에서는 Glob·Grep의 경로를 `.agents/learnings/entries/`로 명시하고 Read의 줄 범위로 처음 두 `---` 사이를 먼저 읽는다. 같은 상태·범위 기준으로 본문을 고르고, 셸 예시를 실행하려고 도구 권한을 넓히지 않는다.

```bash
learning_query='docs|workspace|모듈'
rg --files --hidden .agents/learnings/entries -g '*.md' | sort |
while IFS= read -r learning_file; do
  learning_meta=$(awk '
    NR == 1 { if ($0 != "---") exit; next }
    /^---$/ { printf "%s", metadata; exit }
    { metadata = metadata $0 ORS }
  ' "$learning_file")
  printf '%s\n' "$learning_meta" | rg -q '^status: active$' || continue
  printf '%s\n' "$learning_meta" | rg -qi -e "$learning_query" -e '^scope: \["\*\*"\]$' || continue
  printf '\n%s\n%s\n' "$learning_file" "$learning_meta"
done
```

### 기록과 정리

읽기 전용 계획·조회·리뷰에서는 이 절의 파일 갱신·커밋을 실행하지 않는다. 발견한 교훈 후보와 근거만 결과로 반환하고 기록은 쓰기가 허용된 작업에서 처리한다.

1. 원인과 다음 행동이 확인되고 다른 작업에서도 재사용할 수 있을 때 기록한다. 단순 오타나 원인 미확정 실패는 기록을 확정하지 않고 현재 작업에서 먼저 조사한다.
2. 추가 전에 위 조회와 `rg --hidden -n '<경로|키워드>' .agents/learnings/entries`로 비활성 항목을 포함한 기존 기록도 찾는다. 같은 원인·대응이면 기존 항목에 근거를 보강하고, 조건이 다르면 별도 기록과 필요한 관계를 남긴다.
3. 추가·수정한 항목과 관련 기록의 중복·충돌·링크를 함께 확인한다. 의미상 중복은 근거를 읽고 판단하며 자동 검출을 보장하지 않는다. 이미 중복된 기록은 병합하고 원본을 `superseded`로 보존한다.
4. 코드 경로가 이동·삭제되면 해당 `scope`를 가진 기록도 재검토한다. 규칙으로 정착한 교훈은 해당 문서로 옮기고 `promoted`로, 유효하지 않은 교훈은 근거와 함께 `retired`로 바꾼다.
5. 작업 말미에 이번에 변경한 학습 항목의 경로만 지정해 별도 커밋한다. 다른 작업자의 변경·이미 stage된 무관한 변경이 섞이지 않는지 먼저 확인한다. 아래 경로는 실제 변경한 항목들로 바꾼다.

```bash
git add -- .agents/learnings/entries/docs-build-prerequisites.md
git commit -m "docs(learnings): clarify docs build prerequisites" -- .agents/learnings/entries/docs-build-prerequisites.md
```

- 학습 항목 커밋은 사용자 확인 없이 한다. 규칙 문서·Skill로 승격할 때 그 문서의 수정과 커밋은 해당 작업의 승인 범위를 따른다. push·PR·merge 권한은 루트 규칙을 따른다.
- 완료 응답에는 기록한 교훈과 커밋 해시를 알린다. 조회만 했다면 날짜나 이력을 갱신하지 않는다.
