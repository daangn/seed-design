# Rootage CDN

`@seed-design/rootage-artifacts`의 생성 JSON을 npm tarball에서 검증해 R2에 불변 버전으로 저장하고, Cloudflare Worker로 제공한다.

## 공개 경로

- `/rootage/v{version}/{resource}.json`: 1년 immutable 캐시를 사용하는 정확한 버전
- `/rootage/latest/{resource}.json`: 검증된 npm `latest` 포인터
- `/rootage/{resource}.json`: 기존 소비자를 위한 stable 별칭

Worker는 완료 manifest에 기록된 파일만 제공한다. 업로드가 중단되어 완료 manifest가 없거나 실제 객체가 누락되면 부분 결과를 반환하지 않는다.

## 개발

```sh
bun --filter @seed-design/rootage-cdn test
bun --filter @seed-design/rootage-cdn typecheck
WRANGLER_LOG_PATH=/tmp/wrangler-rootage.log bun --filter @seed-design/rootage-cdn wrangler:dry-run
```

저장 형식은 [`schemas/completion-manifest.schema.json`](./schemas/completion-manifest.schema.json)과 [`schemas/stable-pointer.schema.json`](./schemas/stable-pointer.schema.json)에서 필드 설명과 함께 관리한다.
