# tools/rootage-cdn

## 디렉토리 개요

npm에 게시된 Rootage JSON을 검증해 비공개 R2에 불변 저장하고, Cloudflare Worker로 공개하는 실행형 도구다. GitHub Actions 게시기와 Worker는 같은 저장 계약을 공유한다.

## 파일 작성 컨벤션

- 실행 진입점은 운영 명령 `src/cli.ts`, 공개 읽기 `src/worker.ts`, npm 게시 결과 변환 `src/release-input.ts`로 분리한다.
- 저장 JSON 계약은 `schemas/*.schema.json`에 Draft 2020-12로 명시하고 모든 필드에 설명을 작성한다.
- 테스트는 대응하는 구현 옆에 `*.test.ts`로 둔다.

## 코드 작성 컨벤션

- S3 클라이언트는 `R2ObjectStore` 경계 밖으로 노출하지 않는다.
- 불변 객체는 `If-None-Match: *`, stable 포인터는 `If-Match`로만 갱신한다.
- 412는 재시도할 네트워크 오류가 아니라 충돌 또는 stale pointer 도메인 결과로 처리한다.
- Worker는 R2 읽기만 수행하고 외부 쓰기·삭제 API를 제공하지 않는다.
- npm 게시 결과 변환은 레지스트리를 읽고 workflow output만 기록하며 R2·Git·npm을 변경하지 않는다.
