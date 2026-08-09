# Release Automation 기술 개요

## 구조

- `src/core`: 레인 설정, marker, GitHub 응답 타입, Changesets 및 validation status 정책
- `src/setup`: 최초 branch bootstrap과 activation 상태 변경
- `src/lane`: Version Packages read-plan과 trusted write 검증
- `src/sync`: FIFO 선택, target tree 재구성, 검증, merge와 blocker alert
- `src/publish`: 게시 승인, immutable tarball, npm, tag, Rootage 입력, receipt와 알림
- `src/validation`: generated PR의 trusted `dev` 검증 진입점
- `src/local`: credential-free 로컬 진단, 전체 검증, package dry-run
- `bin/control.ts`: 사람이 직접 호출하지 않는 고정 GitHub Actions control 명령

도메인은 `core`를 공유하되 서로의 workflow entrypoint를 호출하지 않는다. 테스트는 구현 옆에 두고 barrel file은 만들지 않는다.

## Workflow 경계

| workflow | 역할 | write 경계 |
| --- | --- | --- |
| `release-bootstrap.yml` | 최초 `minor`·`major` 생성 | branch 생성과 bootstrap PR |
| `release-activation.yml` | Rootage, sync와 dry-run·production mode 전환 | `dev` activation PR |
| `release-sync.yml` | FIFO drain, trusted merge, blocker alert | job별 GitHub 최소 권한 |
| `release-packages.yml` | lane별 Version Packages plan/write | tokenless planner와 writer 분리 |
| `release-pr-validation.yml` | generated PR exact-head 검증 | checkout 없는 status writer 분리 |
| `release-publish.yml` | npm, tag, Rootage, durable receipt | OIDC와 Git write를 별도 job으로 분리 |
| `release-notification.yml` | 완료된 production receipt 알림 | publish 결과와 실패 격리 |
| `release-e2e.yml` | 로컬과 같은 read-only 검증 | production write 없음 |

파일 수보다 권한을 섞지 않는 것을 우선한다. 특히 publish, notification, validation은 합치면 실패 결과나 credential 경계가 달라지므로 독립 workflow로 유지한다. Sync의 drain, merge, alert는 동일 도메인이고 job 권한으로 안전하게 분리할 수 있어 하나로 통합한다.

## 신뢰 경계

GitHub write token, npm OIDC, 배포 credential은 서로 다른 job과 엔트리포인트에서만 사용한다. Credential을 가진 실행은 immutable trusted `dev` control SHA의 코드만 사용하며, 승인된 lane/source checkout의 lifecycle이나 설정을 실행하지 않는다.

상태 전이와 게시 입력은 PR identity, exact head/merge SHA, trusted workflow run receipt와 결속한다. 로컬 검증과 테스트에는 production credential이나 네트워크 쓰기가 필요하지 않아야 한다.

Activation operation의 이름, 대상 상태 파일과 bootstrap-readiness 요구는 `src/core/types.ts`와 `src/setup/activation.ts`의 exhaustive spec으로 관리한다. Workflow choice 목록은 계약 테스트가 같은 operation 배열과 exact 비교한다.

`dev`를 release control-plane trust root로 사용한다. `minor`·`major` source는 data/worktree로만 다루며, write credential을 가진 프로세스가 lane의 Bun 설정, lifecycle 또는 임의 source script를 실행하지 않도록 한다.

## 명령어

- `bun --filter @seed-design/release-automation doctor`: 로컬 상태 진단
- `bun --filter @seed-design/release-automation verify`: CI 상당의 credential-free 전체 검증
- `bun --filter @seed-design/release-automation test`: 단위 및 workflow 계약 테스트
- `bun --filter @seed-design/release-automation typecheck`: TypeScript 검사

루트 별칭인 `bun release:doctor`와 `bun release:verify`를 사람이 사용하는 기본 인터페이스로 유지한다. 나머지 TypeScript 파일은 workflow 전용 entrypoint이며 공개 CLI API가 아니다.
