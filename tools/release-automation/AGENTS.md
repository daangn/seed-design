# tools/release-automation

## 디렉토리 개요

`dev`, `minor`, `major` 릴리즈 레인의 검증·동기화·게시를 담당하는 private 실행 도구다. GitHub Actions는 권한별 엔트리포인트를 호출하고, 사람은 루트의 `release:doctor`와 `release:verify` 명령을 사용한다.

## 파일 작성 컨벤션

- 공통 타입과 정책은 `src/core/`, 최초 설정은 `src/setup/`, 레인·동기화·게시는 각각 `src/lane/`, `src/sync/`, `src/publish/`, generated PR 검증은 `src/validation/`, 로컬 명령은 `src/local/`에 둔다.
- 테스트는 대응하는 구현 옆에 `*.test.ts`로 둔다.
- 하나의 거대한 CLI나 barrel file을 만들지 않고, workflow 권한 경계마다 독립된 얇은 엔트리포인트를 둔다.

## 코드 작성 컨벤션

- GitHub·Git·파일 시스템·프로세스 실행 같은 입출력은 엔트리 레이어에 한정하고 정책과 파서는 순수 함수로 분리한다.
- credential을 사용하는 엔트리포인트는 lane/source checkout의 실행 코드나 lifecycle을 호출하지 않는다.
- 영속 상태와 marker는 schema 및 exact SHA 결속을 fail-closed로 검증한다.
- 공용 타입과 파서는 `core`에서 재사용하고, 도메인 간 import 방향을 명시해 순환 참조를 만들지 않는다.
