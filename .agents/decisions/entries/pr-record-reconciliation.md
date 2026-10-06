---
id: pr-record-reconciliation
description: PR을 제출·갱신하거나 머지 직전 확인하며 관련 decision·lesson이 최종 변경에 맞는지 판단할 때 읽는다. 합의·경험 상태와 구현 반영·검증을 분리하고 최신 PR head SHA에 근거를 연결하며 모든 교훈에 수정 구현을 요구하지 않는다.
scope: ["**"]
status: accepted
decided_at: "2026-10-06"
related_decisions: ["scoped-decision-records", "traceable-conversation-references"]
source_pr: "https://github.com/daangn/seed-design/pull/2440"
evidence_ref: "https://github.com/daangn/seed-design/pull/2440"
implemented_in: ["AGENTS.md", ".agents/decisions/AGENTS.md", ".agents/learnings/AGENTS.md", "skills/seed-verification-before-completion/SKILL.md", "skills/seed-verification-before-completion/references/record-reconciliation.md"]
---

# PR 마무리에 기록과 최종 변경을 대조한다

## 결정과 적용 조건

- PR에서 추가·변경하거나 실제 참조한 관련 기록을 최종 diff와 대조한다. 선택의 확정·경험의 유효성과 구현 반영·검증 결과는 별도로 확인한다.
- 최종 PR head SHA에 반영 결과·명령·검증 결과·미검증·예외 근거를 연결한다. 이후 관련 변경이 있으면 대조와 필요한 검증을 다시 수행한다.
- 정확한 최종 SHA는 PR 결과에 두며 기록 파일의 자기 SHA를 갱신하는 반복 커밋은 만들지 않는다. 머지 직전 담당자는 결과가 현재 head에 대한 것인지 확인한다.

## 배경·대안·비용

- 초기 판단 뒤 코드가 바뀌면 합의된 결정이나 경험 기록이 최종 구현과 어긋날 수 있다. `accepted`·`active`·경로 링크·날짜·머지만으로 코드 일치를 판단할 수 없다.
- 전체 기록 재검증은 작업 범위를 넓힌다. 이번 변경과 조건이 맞는 기록에만 수동 대조를 적용하고, CI로 의미를 자동 판별한다고 가정하지 않는다.
- 최신 PR head에 대조 결과를 남기는 비용이 생긴다. 해결되지 않은 문제에서 얻은 lesson과 문서만의 결정을 별도 범위로 설명해 불필요한 런타임 검사를 요구하지 않는다.

## 확정 근거와 재검토

- 확정 근거: 2026-10-06 사용자가 기록·구현을 머지 직전에 대조하는 제안을 “그렇게 해볼까?”라고 승인했다.
- 담당자: PR 작성자가 근거를 남기고 머지 직전 확인 담당자가 현재 head와 대조한다. 특정 계정이나 새 리뷰 의무자를 지정하지 않는다.
- 현재 구현은 문서·Skill의 절차 연결이다. 자동 CI 게이트나 실제 모든 PR·에이전트의 준수는 미검증이다. 이 PR에서의 문서 반영·검증 범위는 원천 PR의 기록 대조 결과를 따른다.
- 재검토 조건: 오래된 SHA를 현재 증거로 쓰거나, 부분 반영을 완료로 오해하거나, 대조 비용이 과도하면 필드와 절차를 보완한다.
