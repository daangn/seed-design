# packages/figma

## 디렉토리 개요

**Figma 연동 라이브러리**. Figma에서 디자인 토큰과 컴포넌트 정보를 추출하고 코드를 생성한다. `bun figma:sync`로 Figma 변수를 `rootage` YAML로 동기화한다.

## 파일 작성 컨벤션

- `src/normalizer/`: Figma 데이터 정규화
- `src/codegen/`: 코드 생성 로직
- `src/entities/`: 도메인 엔티티 (interface, repository, service 패턴)

## 코드 작성 컨벤션

- `FIGMA_ACCESS_TOKEN` 환경변수 필요
- Entity 파일: `{entity}.interface.ts`, `{entity}.repository.ts`, `{entity}.service.ts`
- `tools/figma-*` 플러그인과 달리 라이브러리로 import해서 사용
