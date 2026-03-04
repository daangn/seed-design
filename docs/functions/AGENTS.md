# docs/functions

## 디렉토리 개요

Cloudflare Pages Functions 진입점 계층이며, 정적 `docs/out`와 별도로 런타임 API를 제공한다.

## 파일 작성 컨벤션

- 경로 매핑: URL 기준으로 폴더를 구성한다 (예: `/api/chat` -> `api/chat.ts`)
- 파일명: `kebab-case`
- 배포 라우팅 제약은 `docs/public/_routes.json`에서 관리한다.

## 코드 작성 컨벤션

- 엔트리는 thin proxy만 유지하고 비즈니스 로직을 직접 구현하지 않는다.
- 가능한 한 Web 표준 API(`Request`/`Response`)로 작성해 런타임 의존을 최소화한다.
