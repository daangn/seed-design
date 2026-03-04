# Docs TECH

## AI Chat

문서 사이트 AI Chat은 외부 AI 서비스로 요청을 전달하는 프록시로 동작한다.

### 실행 진입점

| 환경 | 파일 |
|------|------|
| 프로덕션 (Cloudflare) | `docs/functions/api/chat.ts` |
| 개발 (Next.js) | `docs/app/api/chat/route.ts` |

### 필요 환경 변수

| 변수 | 설명 | 필수 |
|------|------|------|
| `SEED_DOCS_AGENT_URL` | AI chat 서비스 엔드포인트 | ✅ |
| `SEED_DOCS_AGENT_HMAC_SECRET` | 서버 간 인증 secret | ✅ |

## Tool Contract 스키마

파일: `docs/lib/ai/tool-contract.ts`

AI Agent가 반환하는 tool result의 타입 정의. UI 렌더러(`tool-result-renderer.tsx`)가 이 타입을 기반으로 결과를 표시한다.

## 장애 대응

### AI Chat 응답 없음

- 증상: 60초 타임아웃
- 대응: `SEED_DOCS_AGENT_URL` 환경 변수 설정 확인

### 텍스트 과억제

- 증상: 텍스트가 거의 사라지고 툴만 노출
- 대응: `tool-contract.ts` 억제 regex, `chat-message.tsx` fenced code 제거 로직 확인
