# Release Automation 기술 개요

## 구조

- `src/core`: 레인 설정, marker, GitHub 응답 타입, Changesets 및 validation status 정책
- `src/setup`: 최초 branch bootstrap과 activation 상태 변경
- `src/lane`: Version Packages read-plan과 trusted write 검증
- `src/sync`: FIFO 선택, target tree 재구성, 검증, merge와 blocker alert
- `src/promotion`: beta 주기의 squash source 선별, 코드 승격 tree와 durable 진행 상태, 게시 후 정렬
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
| `release-packages.yml` | lane별 Version Packages와 prerelease enter/exit plan/write | tokenless planner와 writer 분리 |
| `release-pr-validation.yml` | 일반·generated PR exact-head 검증과 코드 승격 projected baseline gate | checkout 없는 status writer 분리 |
| `release-publish.yml` | npm, tag, Rootage, durable receipt, 게시 후 코드·baseline 정렬 | OIDC와 Git write를 별도 job으로 분리 |
| `release-notification.yml` | 완료된 production receipt 알림 | publish 결과와 실패 격리 |
| `release-e2e.yml` | 로컬과 같은 read-only 검증 | production write 없음 |

파일 수보다 권한을 섞지 않는 것을 우선한다. 특히 publish, notification, validation은 합치면 실패 결과나 credential 경계가 달라지므로 독립 workflow로 유지한다. Sync의 drain, merge, alert는 동일 도메인이고 job 권한으로 안전하게 분리할 수 있어 하나로 통합한다.

## 신뢰 경계

GitHub write token, npm OIDC, 배포 credential은 서로 다른 job과 엔트리포인트에서만 사용한다. Credential을 가진 실행은 immutable trusted `dev` control SHA의 코드만 사용하며, 승인된 lane/source checkout의 lifecycle이나 설정을 실행하지 않는다.

상태 전이와 게시 입력은 PR identity, exact head/merge SHA, trusted workflow run receipt와 결속한다. 로컬 검증과 테스트에는 production credential이나 네트워크 쓰기가 필요하지 않아야 한다.

`minor`·`major` prerelease는 `dormant → active → exiting → dormant` 순서로 전이한다. Enter/Exit
Intent PR은 `.changeset/pre.json`만 변경하고 publish queue에 들어가지 않는다. `exiting` lane에서는
exact Exit merge에 결속된 Stable Version Packages PR 외의 일반·sync·version 작업을 거부한다.
두 prerelease lane의 상태 작업은 전역 직렬화하며, Enter도 sibling dormant, pending stable promotion,
미병합 baseline을 selection·validation·writer에서 반복 확인한다.

Non-dev stable publish는 Exit PR 번호, merge SHA, operation ID, Stable Version PR base/head와 control
SHA를 exact marker로 증명한 경우에만 허용한다. Stable Version PR merge는 npm `latest` 이동이므로
dry-run에서는 생성·검증·게시하지 않는다.

Stable Version PR을 ready로 전환하기 전에 active Enter부터 Exit 직전까지 source lane에 squash merge된
사람 PR을 first-parent 순서로 선별한다. Generated PR과 새 Changeset Markdown은 승격 입력에서 제외하고,
direct push·rebase merge·기존 Changeset 변형·version/CHANGELOG/release control 변경은 fail-closed한다.
선별한 실제 코드와 생성 산출물을 exact `dev`와 dormant sibling base에 재생해 target별 draft 코드 승격
PR 또는 no-op을 만든다. 코드 tree에 Stable Version 산출물까지 적용한 projected baseline tree에서
generator와 전체 테스트를 통과해야 Stable Version PR의 required validation을 시작한다.

이 구간의 잠금은 관리자 권한 없이 구현한 논리 잠금이다. Stable head의 durable promotion status를
진행 상태로 사용하고, 세 레인의 기존 open PR status를 pending으로 바꾸며, 새 일반·sync·Enter/Exit·Version
작업을 전역 gate에서 거부한다. Stable 게시 authorize와 npm write 직전에 source/dev/sibling exact head와
Stable squash merge base/tree를 다시 검사한다. SHA 단위 status를 다른 PR이 공유하지 못하도록 검증 시작과
결과 기록 시 exact open PR/head 유일성도 확인한다.

Durable production receipt가 기록된 뒤에만 코드 승격 PR을 ready로 전환하고 사람이 merge한다. 두 target의
exact code merge/no-op receipt가 모이면 `release-publish.yml`의 reconciliation job이 Stable Version 산출물만
적용하는 baseline PR을 아직 미완료인 target에 만든다. Baseline marker는 code merge SHA, promotion manifest,
code tree, projected baseline tree와 Stable patch digest에 결속된다. 두 baseline의 human merge와 trusted
validation receipt가 current target에 반영되면 durable promotion status를 완료하고 기존 open PR을 다시
검증한다. 이 전까지 다음 dev publish, Enter와 stable promotion을 거부하며 npm/tag/Rootage 결과는 롤백하지
않는다.

Activation operation의 이름, 대상 상태 파일과 bootstrap-readiness 요구는 `src/core/types.ts`와 `src/setup/activation.ts`의 exhaustive spec으로 관리한다. Workflow choice 목록은 계약 테스트가 같은 operation 배열과 exact 비교한다.

`dev`를 release control-plane trust root로 사용한다. `minor`·`major` source는 data/worktree로만 다루며, write credential을 가진 프로세스가 lane의 Bun 설정, lifecycle 또는 임의 source script를 실행하지 않도록 한다.

Changesets 2.29.7의 prerelease peer-dependent 자동 major는 제품의 BC 판단이 아니다. Trusted replay가
실제 CLI 결과를 먼저 계산한 뒤, Web consumer는 explicit Changeset bump를 보존하고 peer-only 전파는
최소 patch로 교정한다. Lynx allowlist의 peer-only major만 0.x minor로 교정한다. Beta 내부 peer와
devDependency는 exact version, stable peer는 caret, stable devDependency는 exact version을 사용한다.

## 명령어

- `bun --filter @seed-design/release-automation doctor`: 로컬 상태 진단
- `bun --filter @seed-design/release-automation verify`: CI 상당의 credential-free 전체 검증
- `bun --filter @seed-design/release-automation test`: 단위 및 workflow 계약 테스트
- `bun --filter @seed-design/release-automation typecheck`: TypeScript 검사

루트 별칭인 `bun release:doctor`와 `bun release:verify`를 사람이 사용하는 기본 인터페이스로 유지한다. 나머지 TypeScript 파일은 workflow 전용 entrypoint이며 공개 CLI API가 아니다.
