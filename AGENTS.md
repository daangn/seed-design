---
description: General instructions for agents
alwaysApply: true
---

# AGENTS.md

AI 어시스턴트가 이 저장소에서 작업할 때 참고하는 가이드.

## 프로젝트 개요

SEED Design은 당근의 디자인 시스템이다. 기술적 상세는 @TECH.md 참고.

## AGENTS.md 역할

각 폴더의 `AGENTS.md`는 **해당 폴더의 개요와 컨벤션**을 설명한다. 기술 상세는 TECH.md에, 사용자 대상 설명은 README.md에 작성한다.

### 필수 3섹션

- **디렉토리 개요**: 폴더의 역할을 1-2문장으로 설명하고 상/하위 연결만 간단히 언급한다.
- **파일 작성 컨벤션**: 파일/디렉토리 네이밍 규칙과 barrel file 사용 원칙을 적는다.
- **코드 작성 컨벤션**: 해당 폴더에 적용되는 패턴과 import/export 규칙을 정리한다.

### 계층 원칙

- **상위 AGENTS는 얕고 넓게**: 폴더군의 역할과 연결 흐름만
- **하위 AGENTS는 깊고 좁게**: 해당 폴더에 국한된 구조와 컨벤션
- 중복 없이 계층적으로 작성

### AGENTS.md가 필요한 디렉토리

핵심 도메인/패키지 폴더에는 AGENTS.md를 두고, 생성물/의존성 폴더(`node_modules`, `dist` 등)에는 두지 않는다.

## 문서 역할 분리

| 문서 | 역할 | 대상 |
|------|------|------|
| `AGENTS.md` | 폴더 개요 + 컨벤션 | AI 에이전트 |
| `TECH.md` | 기술 상세, 아키텍처, 명령어 | AI 에이전트 |
| `README.md` | 패키지 소개, 사용법, 개발 방법 | 사람 |

## Boundaries

- ✅ **Always:**
  - `bun generate:all` 실행 후 변경사항 확인
  - 테스트 실행 후 커밋 (`bun test:all`)
  - 한국어로 최종 응답
  - `forwardRef` + `displayName` 사용 (React 컴포넌트)

- ⚠️ **Ask first:**
  - 새 패키지 추가
  - tsconfig/biome.json 설정 변경
  - CI 워크플로우 수정
  - 외부 의존성 추가

- 🚫 **Never:**
  - `packages/css/vars/`, `packages/css/recipes/` 직접 수정
  - `packages/qvism-preset/src/vars/` 직접 수정
  - `.env`, API 키, 시크릿 커밋
  - `npm`/`pnpm`/`yarn` 사용 (`bun` 전용)
  - `dist/`, `node_modules/` 수정

## 응답 규칙

**반드시 한국어로 최종 응답을 할 것**
