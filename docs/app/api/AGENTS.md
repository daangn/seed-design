# docs/app/api

## 디렉토리 개요

문서 사이트 API 라우트 계층, 검색 API와 AI 채팅 API 요청/응답 경계 담당

## 파일 작성 컨벤션

- 라우트: 기능 폴더(`search`, `chat`) 분리, 진입점은 `route.ts`
- 공통 상수/헬퍼: 같은 기능 폴더 유지
- 파일/폴더명: `kebab-case`

## 코드 작성 컨벤션

- 요청 본문: 스키마(zod, message validation) 선검증 후 처리
- 채팅 라우트: `clientTools + MCP tools` 합성 후 스트리밍 응답 반환
- 실패 케이스: 명시적 JSON 에러 본문 + 상태코드(4xx/5xx) 반환
