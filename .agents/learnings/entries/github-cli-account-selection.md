---
id: github-cli-account-selection
description: GitHub CLI로 PR을 생성·갱신할 때 Git push 성공과 API 권한이 다르거나 Enterprise Managed User 접근 오류가 나면 읽는다.
scope: ["**"]
status: active
verified_at: "2026-09-28"
---

# Git push와 GitHub CLI의 인증 계정을 따로 확인한다

## 교훈과 다음 행동

- SSH push나 저장소 조회 성공으로 GitHub CLI의 PR 쓰기 권한을 판단하지 않는다. `gh auth status`와 `gh api user --jq .login`으로 등록 계정과 현재 API 사용자를 확인한다. 인증 토큰 값을 읽거나 출력하지 않는다.
- 현재 계정으로 요청한 저장소에 접근할 수 없고 같은 사용자의 다른 등록 계정이 있으면, 승인된 작업에 맞는 계정을 선택한다. `gh auth switch --hostname github.com --user <등록 계정>` 뒤 사용자와 저장소 권한을 다시 확인하고 요청한 작업만 수행한다. 적합한 등록 계정이 없으면 사용자에게 계정 연결을 요청한다.
- 계정 전환은 CLI의 공유 상태를 바꾼다. 원래 활성 계정을 보존하고 성공·실패 모두 복원하되, 그 사이 다른 작업이 활성 계정을 바꿨으면 덮어쓰지 않는다.

## 발생 근거와 적용 조건

- `daangn/seed-design`의 SSH push와 `gh repo view`는 성공했지만, `gh pr create`는 활성 Enterprise Managed User 계정에서 `Unauthorized: As an Enterprise Managed User, you cannot access this content`로 실패했다.
- 같은 사용자의 등록된 개인 계정으로 전환해 API 사용자와 저장소의 `permissions.push`를 확인한 뒤 [PR #2297](https://github.com/daangn/seed-design/pull/2297)을 생성했다. 완료 후 기존 활성 계정으로 복원했다. 이 결과를 다른 저장소·계정의 권한으로 일반화하지 않는다.

## 변경 이력

- 2026-09-28: PR 생성 실패의 계정 원인을 확인하고, 등록 계정 전환·권한 확인·생성·원래 계정 복원을 실제 수행한 근거로 기록했다.
