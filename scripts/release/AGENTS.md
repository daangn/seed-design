# scripts/release

## 디렉토리 개요

Rootage 릴리즈 레인의 검증, 동기화, 게시 승인, 승격을 구현하는 Bun TypeScript 모듈이다. `.github/workflows`는 얇은 실행 계층으로 유지하고 재사용 가능한 판단은 이 폴더에 둔다.

## 파일 작성 컨벤션

- 파일명은 역할을 나타내는 kebab-case를 사용하고 테스트는 `*.test.ts`로 같은 폴더에 둔다.
- 공통 타입은 `types.ts`, GitHub REST 경계는 `github.ts`, CLI 진입점은 역할별 파일로 분리한다.
- barrel file은 만들지 않고 필요한 모듈을 직접 import한다.

## 코드 작성 컨벤션

- 외부 입력은 config·marker parser에서 검증한 뒤 domain 타입으로 변환한다.
- PR diff 계산, queue 정렬, SemVer 비교처럼 중요한 판단은 순수 함수로 분리하고 단위 테스트를 작성한다.
- `pull_request_target`에서 fork head를 checkout하지 않으며 write 작업은 신뢰 marker와 head/base 관계를 다시 검증한다.
- npm·Rootage 쓰기는 승인된 Version Packages merge commit에서만 실행하고 dry-run은 production credential을 사용하지 않는다.
