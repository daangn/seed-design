# docs/components/ai-panel

## 디렉토리 개요

AI 패널 채팅 UI 계층, 메시지 구성/툴 결과 렌더링/마크다운 정리 담당

## 파일 작성 컨벤션

- 렌더러(`*renderer*`), 파서(`parse-*`), 섹션/라벨 유틸(`assistant-*`, `tool-*`) 역할별 분리
- 테스트: 같은 폴더 `*.test.ts`, 대상 파일과 1:1 대응
- 패널 조립(`chat-interface`, `chat-message`)과 표시 단위(`tool-result-renderer`, `chat-markdown`) 분리

## 코드 작성 컨벤션

- 툴 결과 1차 출력 우선, 텍스트는 보조 설명만 유지
- 메시지 파트: `dynamic-tool`, `tool-*` 형식 모두 처리
- 툴 섹션 분류/중복 제거 기준: `docs/lib/ai/tool-contract.ts` 단일 기준
