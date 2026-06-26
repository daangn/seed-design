# 커밋 · changeset · PR 본문 (세션 맥락 정리)

ship의 핵심 산출물이다. 코드 변경 자체는 diff에 남지만, **왜 이렇게 했는지 — 의도·고민·검토한 선택지·선택 이유 — 는 세션이 끝나면 사라진다.** 그걸 PR 본문에 박제해, 미래의 리뷰어(와 미래의 나)가 맥락 없이도 판단할 수 있게 한다.

## 1. 세션 맥락 수집

PR 본문의 재료. 두 곳에서 모은다:

- **현재 세션(대화)** — 이번 작업의 목적, 막히거나 고민했던 지점, 검토했다가 버린 선택지, 최종 선택과 그 이유, 단계 2에서 보수적으로 자동수정한 내역, "확인 필요"로 남긴 판단 지점.
- **다른 세션 흔적** — 이 작업이 이어달리기일 수 있다:
  - `git log origin/dev..HEAD --oneline` — 이전 커밋들이 담은 의도
  - `gh pr view --json title,body,comments`(열린 PR이 있으면) — 기존 논의
  - `.context/` 파일 — 다른 에이전트가 남긴 메모
  - 관련 이전 PR/이슈가 언급됐으면 그 링크

추측으로 채우지 않는다. 모르는 의도는 사용자에게 1회 확인한다.

## 2. 커밋

Conventional Commits, **영어**(AGENTS.md Git 규칙). `type(scope): subject`. `scope`는 컴포넌트/패키지명. 메시지 끝에 co-author:

```
feat(badge): add interactive variant

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
```

- `bun generate:all` 출력(생성물 diff)을 함께 스테이징한다 — 빠뜨리면 레포 생성물이 소스와 어긋난다.
- 논리적으로 독립인 변경이 여럿이면 커밋을 나눈다.

## 3. changeset (`/changeset` 위임)

publishable 패키지가 바뀌었으면 `/changeset` 스킬을 호출한다. bump 확정·한국어 유저향 메시지·파일 생성은 그 스킬의 몫이다 — 재구현하지 않는다. docs/스킬/스크립트/예제만 바뀌었으면 스킵.

## 4. gh 계정 (범용)

`gh` CLI는 **대상 조직에 PR/push 권한이 있는 계정**으로 동작해야 한다. 여러 계정이 로그인돼 있으면 `gh auth status`로 확인하고 권한 있는 계정으로 `gh auth switch` 후 작업, 끝나면 원래 계정으로 복구한다. SSH push는 계정과 무관하고 `gh` API 작업(PR 생성·수정)만 해당된다.

## 5. push + PR

```bash
git push -u origin <현재 브랜치>
gh pr create --base dev --title "<Conventional Commits 영어 제목>" --body "<아래 템플릿>"
```

이미 열린 PR이 있으면 생성 대신 push만 하고 `gh pr edit --body`로 본문을 갱신한다.

### PR 본문 템플릿

```markdown
## 의도 (Why)
<이 변경이 푸는 문제 / 세션에서 모은 사용자 의도>

## 검토한 선택지와 결정
<고민했던 선택지들 → 최종 선택 + 이유. 다른 세션에서 이어진 맥락이 있으면 함께>

## 변경 요약 (What)
<핵심 변경을 레이어/컴포넌트 단위로 간단히>

## 확인 필요 / 자동 수정
<리뷰에서 판단이 필요해 남긴 항목(file:line) + 보수적으로 자동수정한 내역(포맷/import/오타/type)>

## 검증
<실행한 검증: test / generate(diff 포함 여부) / lint / docs>
```

"의도"와 "검토한 선택지와 결정"이 이 PR의 핵심이다 — 비우지 않는다. 없으면 "단순 변경, 특이 결정 없음"이라고 명시한다.
