# Rootage CDN 기술 개요

## 저장 구조

- `versions/v{version}/...`: npm 또는 npm 호환 snapshot tarball의 JSON 원본 바이트
- `manifests/v{version}.json`: 공개 가능한 버전의 완료 manifest
- `pointers/stable.json`: npm `latest`와 검증된 stable 버전 포인터

완료 manifest가 없는 버전은 Worker가 공개하지 않는다. 모든 파일의 SHA-256을 완료 manifest에 기록하고, 완료 manifest 자체의 SHA-256은 stable 포인터에 기록한다.

stable 포인터의 조건부 쓰기가 412를 반환하면 저장 상태를 즉시 다시 읽는다. 목표 바이트가 이미 저장되어 있으면 다른 실행의 적용을 소유하지 않은 성공으로 처리한다. 이전 바이트가 그대로면 방금 관찰한 ETag로 한 번만 다시 시도하며, 다른 바이트가 보이거나 두 번째 조건부 쓰기도 거부되면 중단한다.

PR snapshot은 `0.0.0-snapshot.pr-{PR 번호}.sha-{40자리 head SHA}` 버전을 사용한다. 기존 버전 경로와 완료 manifest 계약을 재사용하지만 stable 포인터는 갱신하지 않는다.

## 명령어

- `bun --filter @seed-design/rootage-cdn test`: 단위 테스트
- `bun --filter @seed-design/rootage-cdn typecheck`: TypeScript 검사
- `bun --filter @seed-design/rootage-cdn wrangler:dry-run`: Worker 번들 검증
- `bun tools/rootage-cdn/src/cli.ts publish ...`: 정확한 npm 버전 게시 및 선택적 stable 갱신
- `bun tools/rootage-cdn/src/cli.ts route ...`: 정확한 `/rootage/*` Worker route cutover/rollback
- `bun tools/rootage-cdn/src/cli.ts set-stable ...`: ETag CAS를 사용한 명시적 stable rollback
- `bun tools/rootage-cdn/src/cli.ts cleanup ...`: 완료 manifest가 없는 7일 이상 객체의 보고/확인 삭제
- `PUBLISHED_PACKAGES=... ROOTAGE_SOURCE_SHA=<gitHead> GITHUB_OUTPUT=<path> bun tools/rootage-cdn/src/release-input.ts`: source의 현재 Rootage 버전을 npm의 exact `gitHead`·integrity와 대조해 재실행 가능한 workflow output으로 변환하며, Changesets 게시 결과가 있으면 일치 여부를 추가 검증
- `bun tools/rootage-cdn/src/version-change-policy.ts`: Changesets Version command가 각 패키지의 `package.json`·`CHANGELOG.md`, changeset, lockfile, `packages/rootage/__generated__/**` 밖의 파일을 변경하지 않았는지 검증
- `bun tools/rootage-cdn/src/snapshot-input.ts detect|prepare`: exact PR diff에서 Rootage 변경을 찾고 package·생성 JSON에 사용할 snapshot 버전을 준비
- `bun tools/rootage-cdn/src/cli.ts publish-snapshot ...`: `pkg.pr.new` tarball의 URL·SHA-1·package identity·SHA-512를 검증하고 불변 snapshot을 게시
- `bun tools/rootage-cdn/src/cli.ts cleanup-snapshots ...`: PR이 닫힌 지 30일 지난 완료 snapshot을 manifest부터 제거

production 쓰기에는 `ROOTAGE_R2_ACCESS_KEY_ID`, `ROOTAGE_R2_SECRET_ACCESS_KEY`, `CF_ACCOUNT_ID`, `ROOTAGE_R2_BUCKET`이 필요하다.
배포·route 변경·rollback·삭제는 GitHub의 `rootage-production` environment 승인을 거친 수동 workflow에서 실행한다.
Snapshot 게시와 정기 정리도 기존 `rootage-production` environment를 재사용한다. 두 workflow 모두 `dev`의 신뢰된 코드만 실행하며 PR 빌드 job에는 R2 자격 증명을 전달하지 않는다.
production Worker 배포는 기존 단일 100% traffic deployment/version을 먼저 기록하고 `https://seed-design.io/rootage/latest/index.json`의 응답 shape와 exact Worker version header를 확인한다. smoke 실패 시 현재 deployment와 version이 방금 배포한 두 ID와 모두 일치할 때만 기록한 정확한 이전 version으로 자동 rollback한다.
성공한 배포의 지연 장애는 `Operate Rootage CDN`의 `worker-rollback`으로 복구한다. target은 history의 과거 단일 100% Worker version이어야 하고, 현재 exact version과 target history deployment를 호출 직전에 다시 확인하며, rollback 뒤 새 100% deployment가 current인지 bounded 검증한다.

현재 production처럼 기존 Worker deployment, stable pointer, route가 있는 환경의 교체만 자동화한다. deployment history가 전혀 없는 최초 bootstrap은 되돌릴 이전 version을 증명할 수 없어 fail-closed하며, 별도로 리뷰된 1회성 bootstrap 절차 없이는 이 workflow로 진행하지 않는다. 백필 검증 URL은 environment secret `ROOTAGE_WORKER_BASE_URL`로 주입한다.
