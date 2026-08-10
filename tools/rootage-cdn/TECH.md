# Rootage CDN 기술 개요

## 저장 구조

- `versions/v{version}/...`: npm tarball의 JSON 원본 바이트
- `manifests/v{version}.json`: 공개 가능한 버전의 완료 manifest
- `pointers/stable.json`: npm `latest`와 검증된 stable 버전 포인터

완료 manifest가 없는 버전은 Worker가 공개하지 않는다. 모든 파일의 SHA-256을 완료 manifest에 기록하고, 완료 manifest 자체의 SHA-256은 stable 포인터에 기록한다.

## 명령어

- `bun --filter @seed-design/rootage-cdn test`: 단위 테스트
- `bun --filter @seed-design/rootage-cdn typecheck`: TypeScript 검사
- `bun --filter @seed-design/rootage-cdn wrangler:dry-run`: Worker 번들 검증
- `bun tools/rootage-cdn/src/cli.ts publish ...`: 정확한 npm 버전 게시 및 선택적 stable 갱신
- `bun tools/rootage-cdn/src/cli.ts route ...`: 정확한 `/rootage/*` Worker route cutover/rollback
- `bun tools/rootage-cdn/src/cli.ts set-stable ...`: ETag CAS를 사용한 명시적 stable rollback
- `bun tools/rootage-cdn/src/cli.ts cleanup ...`: 완료 manifest가 없는 7일 이상 객체의 보고/확인 삭제

production 쓰기에는 `ROOTAGE_R2_ACCESS_KEY_ID`, `ROOTAGE_R2_SECRET_ACCESS_KEY`, `CF_ACCOUNT_ID`, `ROOTAGE_R2_BUCKET`이 필요하다.
배포·route 변경·rollback·삭제는 GitHub의 `rootage-production` environment 승인을 거친 수동 workflow에서 실행한다.
초기 전환은 production Worker 배포, `backfill-version`/`backfill-stable`, route cutover 순서로 수행한다. 백필 검증 URL은 environment secret `ROOTAGE_WORKER_BASE_URL`로 주입한다.
