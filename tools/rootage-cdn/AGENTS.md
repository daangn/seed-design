# tools/rootage-cdn

npm에 게시된 Rootage JSON을 검증해 비공개 R2에 불변 저장하고 Cloudflare Worker로 공개하는 운영 도구다. GitHub Actions 게시기와 Worker가 같은 저장 계약을 공유하며, 저장 구조·운영 명령·인증 경계는 [`TECH.md`](TECH.md)에 있다.

## 검증

- `bun --filter @seed-design/rootage-cdn test`
- `bun --filter @seed-design/rootage-cdn typecheck`
- `WRANGLER_LOG_PATH=/tmp/wrangler-rootage-dry-run.log bun --filter @seed-design/rootage-cdn wrangler:dry-run`: `--env preview`로 Worker 번들만 검증하고 배포하지 않는다.

R2·Cloudflare에 쓰는 `src/cli.ts` 명령(`publish`, `publish-snapshot`, `set-stable`, `cleanup`, `route`)은 외부 서비스 쓰기다 → 검증 목적으로 실행하지 않는다. 수동 운영이 필요하면 `.github/workflows/rootage-cdn-operations.yml`과 필요한 입력을 사용자에게 알리고 확인받는다.

## 규칙

### 파일 배치

- 실행 진입점은 역할별로 나눈다: 운영 명령 `src/cli.ts`, 공개 읽기 `src/worker.ts`, npm 게시 결과 변환 `src/release-input.ts`, PR snapshot 입력 변환 `src/snapshot-input.ts`, 버전 변경 범위 검사 `src/version-change-policy.ts`.
- 저장 JSON 계약 변경 → `schemas/*.schema.json`(Draft 2020-12)을 함께 고치고 모든 필드에 `description`을 쓴다.
- 테스트는 구현 옆 `*.test.ts`에 둔다.

### 쓰기 경계

- S3 클라이언트를 `R2ObjectStore`(`src/r2-object-store.ts`) 밖으로 노출하지 않는다 → 새 R2 동작은 `R2ObjectStore` 메서드로 추가한다.
- 불변 객체는 `If-None-Match: *`, stable 포인터는 `If-Match`로만 갱신한다.
- 412 → 재시도할 네트워크 오류로 다루지 않고 충돌 또는 stale pointer라는 도메인 결과로 처리한다(`TECH.md`「Stable 포인터 충돌」).
- Worker는 R2 읽기만 한다 → 쓰기·삭제는 Worker API가 아니라 `src/cli.ts` 명령과 workflow에 둔다.
- npm 게시 결과 변환(`src/release-input.ts`)은 registry를 읽고 workflow output만 쓴다 → R2·Git·npm 변경은 다음 workflow 단계의 `src/cli.ts` 명령에 둔다.

### Snapshot

- PR 코드를 실행하는 snapshot job에는 R2 자격 증명을 넘기지 않는다 → 게시는 신뢰된 `dev` 코드의 job이 `pkg.pr.new` tarball을 다시 검증한 뒤 `publish-snapshot`으로 한다.
- snapshot 게시는 stable 포인터를 바꾸지 않는다.
