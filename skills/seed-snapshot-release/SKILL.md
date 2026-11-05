---
name: seed-snapshot-release
description: PR snapshot release를 trigger하거나 결과를 확인할 때 사용한다.
---

# Snapshot Release

현재 브랜치에 연결된 PR의 snapshot release를 시작하거나 결과를 확인한다. 상세 명령·polling·실행 identity·권한 확인·결과 파싱은 [Snapshot Release 런북](references/workflow.md)을 따른다.

## 적용 조건

- PR snapshot을 새로 trigger하거나 이미 실행 중인 snapshot을 이어서 확인할 때 사용한다.
- 대상 PR과 현재 PR HEAD SHA가 먼저 확정되어야 한다.
- 대기 전용 요청에는 `/snapshot` 댓글을 게시하지 않는다.
- 명시적인 trigger 요청만 댓글 게시 승인으로 취급한다. 모호한 요청은 로컬 상태를 보여주고 확인한다.
- 댓글 게시 전 인증 계정과 `OWNER`, `MEMBER`, `COLLABORATOR` 중 하나에 해당하는 권한 근거를 확인한다. 확인할 수 없으면 게시하지 않는다.
- workflow metadata의 repository, PR number, source-sha, control-sha, run-id, run-attempt가 현재 요청과 일치할 때만 실행·artifact·결과 댓글을 재사용한다.
- 현재 PR HEAD가 바뀌었거나 metadata가 없거나 일치하지 않으면 이전 결과를 보고하지 않고 새 실행을 사용한다.

## 결과

성공 시 동일 실행에 연결된 `📦 Snapshot Release` 본문과 tarball URL을 보고한다. 실패·취소 시 failed steps와 동일 실행에 연결된 부분 결과만 보고한다.

`SKILL.md`에는 라우팅, 입력, 승인·중단 경계, 결과 조건만 유지한다. push, `/snapshot` 댓글 게시, workflow polling, run/artifact 조회의 상세 절차는 reference 문서에서 확인한다.
