---
name: changeset
description: bun changeset CLI가 감지한 변경 패키지를 기반으로 changeset 파일을 자동 생성합니다. 패키지별 bump를 사용자에게 확정받고, 한국어 유저향 메시지를 작성합니다.
---

# Changeset

`bun changeset`이 감지한 변경 패키지를 후보로 삼아, 패키지별 bump를 사용자에게 확정받고, 확인 후 `.changeset/*.md` 파일을 작성한다.

## 실행 절차

### Phase 1: 변경 패키지 감지 (후보 목록)

`bun changeset` CLI로 변경된(=릴리스 대상) 패키지 후보 목록을 얻는다. 이 CLI는 인터랙티브라 그냥 실행하면 입력을 기다리며 멈추므로, **백그라운드로 실행한 뒤 종료시키고 출력만 capture**한다.

```bash
( bun changeset </dev/null >/tmp/changeset-detect.txt 2>&1 ) &
p=$!; sleep 4; kill "$p" 2>/dev/null; wait "$p" 2>/dev/null
# ANSI/커서 제어문자 제거 후 'changed packages' 섹션의 패키지명만 추출
perl -pe 's/\e\[[0-9;?]*[a-zA-Z]//g' /tmp/changeset-detect.txt \
  | sed -n '/changed packages/,/unchanged packages/p' \
  | grep -oE '@[a-z-]+/[a-z0-9-]+' | sort -u
```

1. 추출된 `changed packages`를 **후보 목록**으로 삼는다. 포함 여부와 bump는 Phase 2에서 패키지별로 확정한다.
   - `bun changeset`은 **private 패키지를 이미 제외**하므로 따로 거를 필요 없다.
   - grep 결과가 비거나 잘려 보이면 `/tmp/changeset-detect.txt`를 직접 읽어 `changed packages` 블록을 눈으로 확인한다 (긴 목록은 터미널 폭에 맞춰 잘려 보일 수 있다).
2. 이미 존재하는 `.changeset/*.md` 파일을 읽어 이미 커버된 패키지가 있는지 확인한다.
   - 이미 커버된 패키지가 있다면 사용자에게 알리고, 추가 changeset이 필요한지 확인한다.

> [!NOTE]
> CLI 목록은 `.changeset/config.json`의 `baseBranch`(보통 `dev`) 기준이라, 현재 브랜치가 dev에 머지되지 않은 커밋들 위에 **stacked**되어 있으면 하위 커밋의 패키지까지 끌려와 부풀 수 있다. 이건 Phase 2에서 사용자가 `안함(제외)`으로 걸러내면 되므로, 여기서는 후보를 넓게 잡아도 된다.

### Phase 2: 패키지별 bump 확정 (AskUserQuestion)

후보의 **각 패키지마다** 실제 변경 내용을 확인하고(`git diff <패키지_경로>` 또는 커밋 로그), `references/patterns.md`의 분류 기준으로 추천 bump를 정한 뒤, **AskUserQuestion으로 사용자에게 패키지별 bump를 확정받는다.**

3. 패키지 1개당 질문 1개. 옵션은 `major` / `minor` / `patch` / `안함(제외)` 4개.
   - 모델이 분석한 추천 타입을 **첫 번째 옵션으로 두고 라벨에 `(추천)`**을 붙인다. 판단 근거는 옵션 description에 적는다.
   - `안함(제외)`은 그 패키지를 changeset에서 빼는 선택지다. stacked로 딸려온 무관 패키지나 changeset이 불필요한 패키지에 사용한다.
4. AskUserQuestion은 호출당 질문 4개까지 가능하므로, 후보가 5개 이상이면 4개씩 나눠 여러 번 호출한다.
5. `안함`으로 답한 패키지는 제외하고, 나머지를 **확정 목록**으로 삼는다.
   - **주의**: breaking change는 `major`가 아니라 `minor`로 답하게 하고, 메시지에 `(BREAKING CHANGE: ...)` 접두사를 붙여 표현한다 — `references/patterns.md` 참조. major는 패키지 전체 구조 변경 같은 대격변에만.

### Phase 3: 메시지 작성

6. `references/patterns.md`를 읽고 메시지 패턴을 참조한다.
7. 확정 목록의 변경 내용을 바탕으로 **디자인 시스템 소비자(개발자)** 관점의 한국어 메시지를 작성한다.
   - 내부 리팩토링이 아닌 **사용자에게 보이는 변경**에 초점을 맞춘다.
   - 타입별 구조를 따른다 (patch: 1줄+불릿, minor: 제목+설명+코드예제, major: 제목+설명+마이그레이션).
   - breaking change가 포함된 경우 `(BREAKING CHANGE: {마이그레이션 액션})` 접두사를 메시지 첫 줄에 붙인다.
8. 독립적인 변경이 여러 개면 별도 changeset 파일로 분리를 권장한다.

### Phase 4: 메시지 확인

9. bump는 Phase 2에서 확정됐으므로, 여기서는 **메시지 미리보기**를 보여주고 확인받는다:

```text
## Changeset 초안

### 포함 패키지 (Phase 2 확정)
| 패키지 | 변경 타입 |
|--------|----------|
| @seed-design/react | patch |

### 메시지 미리보기
(changeset 파일 전체 내용을 코드블록으로)
```

10. 사용자에게 메시지 확인/수정을 요청한다. 수정 요청이 있으면 반영 후 다시 보여준다.

### Phase 5: 파일 생성

11. 사용자가 승인하면 `.changeset/` 디렉토리에 Write 도구로 파일을 생성한다.
12. 파일명은 영어 소문자 `형용사-명사-동사.md` 형태의 랜덤 3단어 조합을 사용한다.
    - 기존 `.changeset/*.md` 파일명과 충돌하지 않도록 확인한다.

---

## Linked 패키지 그룹

`.changeset/config.json`의 `linked` 배열에 정의된 패키지들은 릴리스 시 동일 버전으로 자동 처리된다. changeset에는 변경된 패키지만 포함하면 된다.

- `[@seed-design/figma, @seed-design/mcp]`
- `[@seed-design/codemod, @seed-design/migration-index]`

## 주의사항

- changeset 메시지는 **CHANGELOG에 그대로 들어가는 유저향 텍스트**다. 내부 구현 디테일이 아닌 사용자 영향을 서술한다.
- frontmatter의 패키지명은 반드시 쌍따옴표(`"`)로 감싼다.

## 참조 파일

- `references/patterns.md` — 메시지 작성 패턴 가이드
