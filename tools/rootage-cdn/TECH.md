# Rootage CDN 기술 개요

Rootage CDN의 저장 계약, 운영 명령, 인증·배포 경계다. 검증 명령과 코드 규칙은 같은 폴더 [`AGENTS.md`](AGENTS.md)「검증」「규칙」에 있다.

## 저장 구조

- `versions/v{version}/...`: npm 또는 npm 호환 snapshot tarball의 JSON 원본 바이트
- `manifests/v{version}.json`: 공개 가능한 버전의 완료 manifest
- `pointers/stable.json`: npm `latest`와 검증된 stable 버전 포인터

완료 manifest가 없는 버전은 Worker가 공개하지 않는다. 모든 파일의 SHA-256을 완료 manifest에, 완료 manifest 자체의 SHA-256을 stable 포인터에 기록한다.

## Stable 포인터 충돌

조건부 쓰기가 412를 반환하면:

1. 저장 상태를 즉시 다시 읽는다.
2. 목표 바이트가 이미 있으면 → 다른 실행이 적용한 것으로 보고 소유하지 않은 성공으로 끝낸다.
3. 이전 바이트가 그대로면 → 방금 관찰한 ETag로 한 번만 다시 시도한다.
4. 다른 바이트가 보이거나 두 번째 조건부 쓰기도 거부되면 → 중단한다.

## PR snapshot

- 버전은 `0.0.0-snapshot.pr-{PR 번호}.sha-{40자리 head SHA}`다.
- 기존 버전 경로와 완료 manifest 계약을 재사용하지만 stable 포인터는 갱신하지 않는다.
- snapshot 정리는 필요할 때 수동으로 한다. 전용 workflow나 CLI는 없다.

## 운영 명령

아래 명령은 `.github/workflows/`의 `release-publish.yml`, `continuous-releases.yml`, `rootage-cdn-operations.yml`이 실행한다. 로컬 실행 경계는 `AGENTS.md`「검증」을 따른다.

### `src/cli.ts`

`bun tools/rootage-cdn/src/cli.ts <명령> --<인자> <값> ...` 형식이다. 명령별 인자는 `src/cli.ts`에 있다.

- `publish`: 정확한 npm 버전을 게시하고 선택적으로 stable을 갱신한다.
- `publish-snapshot`: `pkg.pr.new` tarball의 URL·SHA-1·package identity·SHA-512를 검증하고 불변 snapshot을 게시한다.
- `set-stable`: ETag CAS로 stable을 명시적으로 되돌린다.
- `route`: 정확한 `/rootage/*` Worker route를 cutover하거나 rollback한다.
- `cleanup`: 완료 manifest가 없고 `--older-than-days <N>`일보다 오래된 객체를 다룬다. `--apply false`면 보고만 하고, `--apply true --confirm DELETE-INCOMPLETE`일 때만 삭제한다. `rootage-cdn-operations.yml`은 7일로 실행한다.

### 입력·정책 스크립트

- `PUBLISHED_PACKAGES=... ROOTAGE_SOURCE_SHA=<gitHead> GITHUB_OUTPUT=<path> bun tools/rootage-cdn/src/release-input.ts`: source의 현재 Rootage 버전을 npm의 exact `gitHead`·integrity와 대조해 재실행 가능한 workflow output으로 바꾼다. Changesets 게시 결과가 있으면 일치 여부도 검증한다.
- `bun tools/rootage-cdn/src/version-change-policy.ts`: Changesets Version 명령이 각 패키지의 `package.json`·`CHANGELOG.md`, changeset, lockfile, `packages/rootage/__generated__/**` 밖의 파일을 바꾸지 않았는지 검증한다.
- `bun tools/rootage-cdn/src/snapshot-input.ts detect ...`: exact PR diff에서 Rootage 변경을 찾는다.
- `bun tools/rootage-cdn/src/snapshot-input.ts prepare ...`: package·생성 JSON에 쓸 snapshot 버전을 준비한다.

## 인증·운영 경계

명령별 필수 환경변수(`src/cli.ts`):

- `publish`, `publish-snapshot`, `set-stable` → `CF_ACCOUNT_ID`, `ROOTAGE_R2_BUCKET`, `ROOTAGE_R2_ACCESS_KEY_ID`, `ROOTAGE_R2_SECRET_ACCESS_KEY`, `ROOTAGE_PUBLIC_BASE_URL`
- `cleanup` → `CF_ACCOUNT_ID`, `ROOTAGE_R2_BUCKET`, `ROOTAGE_R2_ACCESS_KEY_ID`, `ROOTAGE_R2_SECRET_ACCESS_KEY`
- `route` → `CF_ZONE_ID`, `CLOUDFLARE_API_TOKEN`

`ROOTAGE_R2_DIAGNOSTICS=true`면 stable 포인터 CAS 진단을 stderr에 쓴다. 접근 키와 서명 헤더는 기록하지 않는다.

- mutation job은 `rootage-production` protected environment와 workflow별 신뢰 경계를 따른다.
- release publish는 자동 workflow(`release-publish.yml`)가 실행한다.

## Worker 배포

production Worker deploy는 기존 단일 100% deployment와 exact Worker version을 확인한 뒤 smoke한다. 소유권이 확인된 경우에만 자동 rollback하고, 기존 deployment history가 없는 최초 bootstrap은 fail-closed한다. guard·workflow 계약은 `src/deployment-guard.ts`, `src/verify-deployment.ts`, `src/operations.ts`와 `.github/workflows/rootage-cdn-deploy.yml`·`rootage-cdn-operations.yml`에 있다.
