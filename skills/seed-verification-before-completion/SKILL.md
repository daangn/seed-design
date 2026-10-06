---
name: seed-verification-before-completion
description: 완료·수정 성공·검사 통과를 보고하거나, 커밋·PR 제출 전에 최종 변경의 검증 근거를 확인할 때 사용한다.
---

# Verification Before Completion

완료 주장 전에 최종 변경을 검증하고 결과와 한계를 보고한다.

- 대상 경로의 AGENTS에 따라 필요한 명령을 실행하고 전체 출력·종료 코드·실패 건수·diff를 확인한다. 실행 동작이 없는 문서 변경은 내용·링크·형식을 확인한다.
- 통과·실패·미실행·실제 사용자 흐름 미검증을 구분한다. 검사 성공은 커밋·푸시·PR·배포 권한이 아니다.
- 상세 절차와 예시는 [원본 지침](references/guidelines.md)을 읽는다. 출처·수정 내역·라이선스는 [UPSTREAM.md](UPSTREAM.md)를 따른다.
