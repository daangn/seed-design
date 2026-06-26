---
name: ship
description: seed-design 레포에서 코드 작업을 끝낸 뒤 변경분을 가볍게 검증·리뷰하고, 이번 세션(및 관련 다른 세션)의 의도·고민·선택지를 PR 본문에 정리해 커밋·PR까지 마무리한 뒤, 그 맥락에서 얻은 지식을 AGENTS.md·메모리로 환원하는 루프 학습을 수행하는 워크플로우. 리뷰 자체는 모델과 레포 컨텍스트에 맡기고, ship은 워크플로우 일관성·PR 맥락 정리·루프 학습에 집중한다. 사용자가 "리뷰하고 PR 올려줘", "작업 마무리", "커밋하고 PR 만들어줘", "변경사항 점검", "ship" 등을 요청하거나 코드 변경 작업을 끝낸 직후라면 이 스킬을 사용한다. seed-design 전용이며 changeset 스킬과 연계된다.
---

# Ship — 검증 + PR 맥락 정리 + 루프 학습

이 문서는 **라우터**다. 흐름과 게이트만 정의하고, 커밋·PR·루프 학습의 실제 절차는 `references/`에 있다. 진입할 때 그 파일을 읽는다.

## 이 스킬의 가치 위치 (왜 얇은가)

초기 설계는 정교한 리뷰 엔진(결정론적 번들링·서브에이전트 fan-out·룰 매칭·위치검증)을 뒀지만, eval 4라운드(opus/haiku × 명백/미묘/고유 결함)에서 **ship 유무가 리뷰 recall에 차이를 내지 못했다.** 이유: ① 모델이 `git diff` + `biome`/`knip`을 스스로 돌려 다 잡고, ② 레포의 `CLAUDE.md`가 `AGENTS.md`·`TECH.md`를 자동 로드해 룰이 이미 컨텍스트에 있으며, ③ seed 룰 상당수가 일반 상식이다. 정교한 리뷰 엔진은 그 둘의 재구현(ponytail 위반)이었다.

그래서 리뷰는 **가볍게(모델에 위임)** 하고, ship의 가치는 모델이 매번 일관되게 하지 못하는 곳 — **워크플로우 일관성 · PR 맥락 정리 · 루프 학습** — 에 둔다.

## 흐름

```text
1 컨텍스트+세션맥락 → 2 검증+가벼운리뷰+자동수정 → [Gate A] 3 커밋+changeset → [Gate B] 4 PR(맥락정리) → 5 루프학습
```

`[Gate A]`·`[Gate B]`는 사용자 확인 게이트다. 커밋·push·PR은 되돌리기 어렵고 바깥을 향하므로 실행 전 멈추고 승인을 받는다.

## 공통 원칙

- **우회 금지.** 막히면 임의 우회·mock·`as any`·테스트 생략을 하지 않는다. 통증 메모를 남기고 사용자에게 보고한다. 검증 실패를 숨기고 다음 단계로 가지 않는다.
- **ponytail 렌즈 (코드를 쓸 때).** 더하기 전에 사다리: 존재 필요?(YAGNI) → 모노레포에 이미 있나(*"몇 파일 건너편 재구현이 가장 흔한 낭비"*) → stdlib → 네이티브 → 기존 의존성 → 한 줄 → 최소 코드. 단 신뢰경계·데이터손실·보안·접근성·테스트는 줄이지 않는다.

## 단계

### 1 컨텍스트 + 세션 맥락
- base(`origin/dev`) 재확인 + diff 범위: `git fetch origin dev` → `git diff --name-only origin/dev...HEAD` + `git status --porcelain --untracked-files=all`. 변경 0이면 종료.
- **세션 맥락 수집** — 이번 작업의 의도, 고민했던 점, 검토한 선택지와 선택 이유. 현재 대화에서 모으고, 다른 세션 흔적(`git log origin/dev..HEAD`, 기존 PR 코멘트, `.context/`)도 훑는다. → 단계 4 PR 본문의 재료. 상세는 `references/pr-context.md`.

### 2 검증 + 가벼운 리뷰 + 자동수정
- **검증**: 변경 범위에 맞춰 `bun generate:all`(rootage/qvism 변경 시 — 생성물 누락 감지) → `bun test:all`(packages 변경 시) → `bun biome format --fix` → `bun lint:knip`. `docs/*.mdx`만이면 `bun docs:test`.
- **가벼운 리뷰**: diff를 훑어 명백한 문제를 본다. 레포 룰은 `CLAUDE.md`가 `AGENTS.md`·`TECH.md`를 자동 로드하므로 이미 컨텍스트에 있다 — 별도 룰셋을 주입하지 않는다. 큰 changeset이면 컴포넌트/파일 묶음별로 나눠 보되, 정교한 fan-out은 하지 않는다(eval상 불필요). 판단이 필요한 발견은 고치지 말고 기록 → 단계 4 "확인 필요".
- **자동수정**: 보수적·기계적만(biome 포맷 / 미사용 import / 주석·문자열 오타 / `type` 키워드). 그 외는 손대지 않고 기록.
- 검증 실패 시 멈춤(우회 금지).

### 🔒 Gate A — 커밋 전 확인
`[자동수정 N건 / 확인필요 M건 / 검증 결과]`를 요약해 보여주고 승인을 받는다.

### 3 커밋 + changeset — `references/pr-context.md`
Conventional Commits(영어) → publishable 패키지 변경 시 `/changeset` 위임. (Gate A 승인 후)

### 🔒 Gate B — push·PR 전 확인

### 4 PR — `references/pr-context.md` (핵심)
세션 맥락(의도·고민·선택지·결정)을 본문에 정리해 PR 생성/갱신. **이게 ship의 핵심 산출물이다.**

### 5 루프 학습 — `references/loop.md` (핵심, 마찰 있을 때만)
이번 세션의 마찰·지식을 AGENTS.md·메모리로 환원. 제안 → 승인 → 별도 커밋. 마찰·남길 지식이 없으면 스킵.

## 참조 파일

| 파일 | 내용 | 단계 |
|------|------|------|
| `references/pr-context.md` | 세션 맥락 수집 + 커밋·changeset·PR 본문 | 1·3·4 |
| `references/loop.md` | 루프 학습(지식 환원) | 5 |
