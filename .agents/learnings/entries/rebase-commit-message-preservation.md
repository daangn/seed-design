---
id: rebase-commit-message-preservation
description: 충돌을 해결한 rebase에서 원본 커밋의 메시지·작성자·순서를 보존하거나 이력을 재작성한 원격 브랜치를 갱신할 때 읽는다. 본문에 줄 시작 # 문자가 있거나 GitHub가 만든 긴 squash 메시지를 재사용할 때 Git의 메시지 정리가 본문을 바꾸는 문제와 확인 기준을 다룬다.
scope: ["**"]
status: active
verified_at: "2026-09-29"
---

# 충돌 후 rebase는 커밋 본문까지 대조한다

## 교훈과 다음 행동

- rebase 전 기준·대상 SHA를 고정하고 원본 커밋을 백업한다. 충돌 후 메시지를 재사용할 때는 `git -c commit.cleanup=verbatim rebase --continue`처럼 주석 제거를 막는다.
- 제목뿐 아니라 전체 메시지, 작성자 이름·이메일·작성 시각과 순서를 원본 커밋에 대응시켜 비교한다. `git range-diff`로 패치 변경도 따로 검토한다.
- cleanup 설정만으로 끝 줄바꿈까지 동일하다고 가정하지 않는다. 엄격한 바이트 보존이 필요하면 원본 메시지를 읽어 tree·새 parent·작성자·committer와 함께 commit object를 재구성한 뒤 tree 불변과 메시지 일치를 검증한다.

- 원격 갱신이 승인됐으면 `git ls-remote`·`git rev-parse`로 조회한 전체 SHA로 `--force-with-lease=refs/heads/<branch>:<expected-sha>`를 지정한다. 이력 재작성 없이 커밋만 추가했다면 일반 fast-forward push를 사용한다.

## 발생 근거와 적용 조건

- major rebase의 Popover 커밋을 `GIT_EDITOR=true git rebase --continue`로 재개하자 본문의 `#1949 set on dialog...` 줄이 주석으로 처리되어 빠졌다. 일부 메시지에는 마지막 줄바꿈도 추가됐다.
- 2026-09-29에 원본 16개 커밋과 새 커밋의 전체 메시지·작성자·작성 시각을 대조하여 발견했다. 원본 메시지로 commit object를 재구성한 뒤 16개 모두 순서·메타데이터 일치를 검증했다. 파일 내용과 충돌 해결 결과는 그대로 유지했다.

- #1894의 추가 교훈 커밋을 push할 때 조회하지 않은 SHA를 lease로 사용해 stale info로 거절됐다. 이력 재작성 후 추가 커밋만 있는 상태라 일반 push면 충분했다.

## 변경 이력

- 2026-09-29: major rebase에서 발견하고 원인·복원 후 대조 결과를 기록했다.
- 2026-09-29: #1894 원문 commit `c5abbf25d`에서 개인 인증 내용과 분리 가능한 원격 SHA·lease 검증 교훈만 병합했다.
