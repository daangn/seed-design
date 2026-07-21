---
name: changeset
description: bun changeset CLI가 감지한 변경 패키지를 기반으로 changeset 파일을 자동 생성합니다. 패키지별 bump를 사용자에게 확정받고, 한국어 유저향 메시지를 작성합니다.
---

# Changeset

`bun changeset`이 감지한 변경 패키지를 후보로 삼아, 패키지별 bump를 사용자에게 확정받고, 확인 후 `.changeset/*.md` 파일을 작성한다.

> SEED는 **2.0부터 strict semver**를 따른다 (breaking change는 major에서만). bump 결정은 `references/version-matrix.md`의 전파 매트릭스를 단일 기준으로 삼는다 — 한 패키지의 변경이 그것을 의존하는 패키지로 어떻게 전파되는지가 핵심이다.

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

후보의 **각 패키지마다** 실제 변경 내용을 확인하고(`git diff <패키지_경로>` 또는 커밋 로그), `references/version-matrix.md`의 전파 매트릭스로 추천 bump를 정한 뒤, **AskUserQuestion으로 사용자에게 패키지별 bump를 확정받는다.**

1. **전파 후보 확장**: 한 패키지를 bump하면 그것을 의존하는 패키지도 매트릭스대로 함께 후보에 올린다. css가 오르면 `react`(css를 peer로 소비), headless가 오르면 `react`(dependency로 소비), react가 major면 `figma`(major 정렬). `bun changeset`이 stacked 등으로 못 잡은 dependent도 여기서 직접 추가한다.
2. 패키지 1개당 질문 1개. 옵션은 `major` / `minor` / `patch` / `안함(제외)` 4개.
   - 모델이 분석한 추천 타입을 **첫 번째 옵션으로 두고 라벨에 `(추천)`**을 붙인다. 판단 근거(매트릭스의 어느 행인지)는 옵션 description에 적는다.
   - `안함(제외)`은 그 패키지를 changeset에서 빼는 선택지다. stacked로 딸려온 무관 패키지나 changeset이 불필요한 패키지에 사용한다.
3. AskUserQuestion은 호출당 질문 4개까지 가능하므로, 후보가 5개 이상이면 4개씩 나눠 여러 번 호출한다.
4. `안함`으로 답한 패키지는 제외하고, 나머지를 **확정 목록**으로 삼는다.
   - **주의 (2.0)**: 공개 표면을 깨는 변경(공개 prop/API·recipe·slot·variant·토큰·공개 data attr 이름변경·삭제, headless breaking을 extend 등)은 **`major`**다. 1.x처럼 minor로 답하지 않는다. 반대로 내부 배선(styling 전용 `data-*`, `typography`를 제외한 `vars/component/*`) 이동·삭제는 비공개라 breaking이 아니다(`patch`/`minor`). 판단이 헷갈리면 `references/version-matrix.md`로 확인한다.

### Phase 3: 메시지 작성

1. `references/patterns.md`를 읽고 메시지 패턴을 참조한다.
2. 확정 목록의 변경 내용을 바탕으로 **디자인 시스템 소비자(개발자)** 관점의 한국어 메시지를 작성한다.
   - 내부 리팩토링이 아닌 **사용자에게 보이는 변경**에 초점을 맞춘다.
   - 타입별 구조를 따른다 (patch: 1줄+불릿, minor: 제목+설명+코드예제, major: 제목+설명+마이그레이션).
   - `(BREAKING CHANGE: {마이그레이션 액션})` 접두사는 **major에만** 첫 줄에 붙인다. minor/patch엔 붙이지 않는다.
   - snippet 변경은 "재설치 안 하면 기존 코드가 깨지나?"로 가른다 — 안 깨지면 `minor`(접두사 없음), 깨지면 `major`. (`references/patterns.md`의 "snippet 변경 분류")
3. 독립적인 변경이 여러 개면 별도 changeset 파일로 분리를 권장한다. 단 전파로 함께 오르는 패키지(css+react 등)는 한 파일에 묶는다.

### Phase 4: 메시지 확인

1. bump는 Phase 2에서 확정됐으므로, 여기서는 **메시지 미리보기**를 보여주고 확인받는다:

```text
## Changeset 초안

### 포함 패키지 (Phase 2 확정)
| 패키지 | 변경 타입 |
|--------|----------|
| @seed-design/react | patch |

### 메시지 미리보기
(changeset 파일 전체 내용을 코드블록으로)
```

2. 사용자에게 메시지 확인/수정을 요청한다. 수정 요청이 있으면 반영 후 다시 보여준다.

### Phase 5: peer floor 수동 bump 체크

1. 확정 목록에 **css 또는 headless의 `minor`**가 있으면, 그걸 새로 소비하는 dependent(주로 `react`)의 peer/dep floor를 올려야 하는지 `references/version-matrix.md`로 확인한다.
   - `.changeset/config.json`의 `onlyUpdatePeerDependentsWhenOutOfRange`가 켜져 있어, floor가 새 버전 범위 **안**이면 changeset이 dependent를 자동으로 안 올린다. 안 올리면 `react@new + css@old` 조합이 허용되어 **런타임 silent 실패**가 난다.
   - 필요하면 dependent의 `package.json`에서 해당 floor를 `^N.M.0`로 직접 수정해 같은 PR에 포함한다 (패키지 설치가 아니라 **버전 정책 edit**이라 직접 수정이 정당하다). ceiling(`<N+1`)은 건드리지 않는다.
   - **`major` bump는 changeset이 자동 전파**하므로 이 단계는 **minor 전파에만** 해당한다.
2. floor 수정이 필요하면 사용자에게 어떤 `package.json`을 어떻게 바꿀지 알리고 진행한다.

### Phase 6: 파일 생성

1. 사용자가 승인하면 `.changeset/` 디렉토리에 Write 도구로 파일을 생성한다.
2. 파일명은 영어 소문자 `형용사-명사-동사.md` 형태의 랜덤 3단어 조합을 사용한다.
   - 기존 `.changeset/*.md` 파일명과 충돌하지 않도록 확인한다.

---

## 주의사항

- changeset 메시지는 **CHANGELOG에 그대로 들어가는 유저향 텍스트**다. 내부 구현 디테일이 아닌 사용자 영향을 서술한다.
- frontmatter의 패키지명은 반드시 쌍따옴표(`"`)로 감싼다.
- bump는 내 **공개 표면**이 무엇이 바뀌었나로 정한다. 의존성이 올랐다는 이유만으로 올리지 않는다 (`references/version-matrix.md`의 "기준은 내 공개 표면").
- `.changeset/config.json`의 `linked`에 묶인 패키지들은 릴리스 시 같은 버전으로 자동 정렬되므로, changeset에는 실제로 변경된 패키지만 넣으면 된다.

## 참조 파일

- `references/version-matrix.md` — 패키지 간 버전 전파 매트릭스 + bump 결정 기준 (**먼저 참조**)
- `references/patterns.md` — 메시지 작성 패턴 가이드
