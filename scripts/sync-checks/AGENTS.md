# scripts/sync-checks

## 디렉토리 개요

크로스 패키지 동기화 체크 스크립트. PR에서 변경된 파일을 기반으로 관련 패키지가
동기화되었는지 확인하고, 누락 시 PR 코멘트로 경고한다.

빌드를 실패시키지 않는 "소프트 경고" 방식으로 동작한다.

상위: `scripts/` — 프로젝트 유틸리티 스크립트
워크플로우: `.github/workflows/cross-package-check.yml`

## 아키텍처

- **checks/**: 체크 정의 (`PairSyncCheck` 또는 `CustomCheck`)
- **run-checks.ts**: 순수 함수 엔진 (DI로 `fileExists`/`isNewDirectory` 주입)
- **utils/**: git, 이름 변환, 리포트 포맷 유틸리티
- **index.ts**: 엔트리포인트 (환경변수 → 체크 실행 → PR 코멘트)

같은 출발점(source)의 체크는 하나의 체크 파일에 다중 타겟으로 묶는다.
예: `new-component.ts`는 storybook, react-docs, design-docs, recipe, example 5개 타겟.

## 파일 작성 컨벤션

- 체크 파일: `checks/{check-id}.ts` (kebab-case)
- 테스트 파일: `__tests__/{check-id}.test.ts`
- 새 체크 추가: `checks/` 에 파일 생성 → `checks/index.ts`에 추가
- 기존 체크에 타겟 추가: 해당 체크 파일의 `targets` 배열에 추가

## 코드 작성 컨벤션

- `PairSyncCheck`: "A 바뀌면 B도 바뀌어야" 패턴 (다중 타겟 지원)
- `CustomCheck`: 커스텀 로직 (generation-stale 등)
- 엔진 함수는 순수 함수: `fileExists`, `isNewDirectory`를 인자로 주입
- 예외 목록은 각 체크 파일 상단에 상수로 관리
- 테스트는 mock 데이터로, git/파일시스템에 의존하지 않음
