# docs/app/api

## 디렉토리 개요

문서 사이트 API 라우트 계층. 검색 API와 AI 채팅 프록시 진입점을 담당한다.

## 파일 작성 컨벤션

- 라우트: `search/route.ts`처럼 HTTP 엔드포인트는 `route.ts`를 사용한다.
- 파일/폴더명: `kebab-case`

## 코드 작성 컨벤션

- `chat/route.ts`: 외부 AI 서비스로 요청을 전달하는 프록시
- 실패 케이스: 명시적 JSON 에러 본문 + 상태코드(4xx/5xx) 반환
