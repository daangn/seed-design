# Rootage CDN 기술 개요
저장소 전체 구조와 이 도구의 릴리스 경로는 루트 [`ARCHITECTURE.md`](../../ARCHITECTURE.md)를 먼저 참고한다.

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
- `bun tools/rootage-cdn/src/snapshot-input.ts detect ...`: exact PR diff에서 Rootage 변경을 찾는다.
- `bun tools/rootage-cdn/src/snapshot-input.ts prepare ...`: package·생성 JSON에 사용할 snapshot 버전을 준비한다.
- `bun tools/rootage-cdn/src/cli.ts publish-snapshot ...`: `pkg.pr.new` tarball의 URL·SHA-1·package identity·SHA-512를 검증하고 불변 snapshot을 게시
- `bun tools/rootage-cdn/src/cli.ts cleanup-snapshots ...`: PR이 닫힌 지 30일 지난 완료 snapshot을 manifest부터 제거

## 인증·운영 경계

명령에 필요한 환경변수는 작업을 실행하는 경로에 따라 다르다.

| 작업 | 필요한 환경변수 |
|---|---|
| `publish`, `publish-snapshot`, `set-stable` | `CF_ACCOUNT_ID`, `ROOTAGE_R2_BUCKET`, `ROOTAGE_R2_ACCESS_KEY_ID`, `ROOTAGE_R2_SECRET_ACCESS_KEY`, `ROOTAGE_PUBLIC_BASE_URL` |
| `cleanup` | `CF_ACCOUNT_ID`, `ROOTAGE_R2_BUCKET`, `ROOTAGE_R2_ACCESS_KEY_ID`, `ROOTAGE_R2_SECRET_ACCESS_KEY` |
| `cleanup-snapshots` | 위 R2 변수와 `ROOTAGE_GITHUB_TOKEN` |
| `route` | `CF_ZONE_ID`, `CLOUDFLARE_API_TOKEN` |

`ROOTAGE_R2_DIAGNOSTICS=true`를 설정하면 stable pointer CAS 진단을 stderr에 기록한다. 접근 키와 서명 헤더는 기록하지 않는다.

mutation job은 `rootage-production` protected environment와 workflow별 신뢰 경계를 따른다. release publish는 자동 workflow에서 실행되고, snapshot cleanup은 schedule 또는 수동 dispatch로 실행된다. PR build에는 R2 자격 증명을 전달하지 않으며, snapshot은 stable pointer를 변경하지 않는다.

production Worker deploy는 기존 단일 100% deployment와 exact Worker version을 확인한 뒤 smoke한다. 소유권이 확인된 경우에만 자동 rollback하며, 기존 deployment history가 없는 최초 bootstrap은 fail-closed한다. 상세 guard·workflow 계약은 `src/deployment-guard.ts`, `src/verify-deployment.ts`, `src/operations.ts`와 `.github/workflows/`를 함께 확인한다.
