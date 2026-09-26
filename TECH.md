# SEED Design 공통 기술 규칙

저장소 전체에 적용되는 코드·테스트·의존성·릴리스 규칙이다. 버전은 루트와 각 workspace의 `package.json`이 원천이다.

## TypeScript

- 새 코드에 `any`, `as unknown`을 쓰지 않는다. Biome은 `noExplicitAny`를 정보 수준으로만 보고하므로 직접 지킨다. 기존 예외는 무관한 변경에서 일괄 정리하지 않는다.
- 타입 import에는 `type` 키워드를 쓴다.
- 정적 import가 기본이다. lazy loading, plugin 경계, 런타임 선택이 필요할 때만 동적 import를 쓴다.
- 주석은 코드만으로 알 수 없는 워크어라운드·외부 제약에만 한국어로 남긴다. 변경 이유와 배경은 PR 본문에 쓴다.

## 테스트 작성

- 생성기·변환기가 만든 문자열은 조각(`toContain`)이 아니라 전체 일치로 검증한다. 조각 단언은 헤더나 행이 빠져도 통과한다. 배열 멤버십 검사에는 `toContain`이 맞다.
- 생성물이 아니라 동작에 딸린 문구(오류 메시지, 로그, 안내 문장)는 검증하지 않는다. 문구를 고쳐도 동작은 그대로인데 테스트만 깨진다 → 실패는 `toThrow()`로 확인하고, 호출자가 실패 종류를 구분해야 하면 오류 코드나 클래스를 검증한다.
- 생성물이나 외부 패키지 데이터를 유닛 테스트 입력으로 쓰지 않는다. 데이터가 바뀌면 검증 대상이 멀쩡해도 깨진다 → 순수 함수를 export해 합성 입력으로 검증한다. 실데이터를 지나는 테스트는 데이터에 묶이지 않는 파생값(섹션 목록 등)만 전체 일치로 본다.
- 유닛 테스트에서 네트워크를 타지 않는다. 모듈 스코프에서 비동기 초기화를 시작하면 그 모듈을 import하는 모든 테스트가 요청을 보낸다 → 초기화를 함수 안으로 옮긴다.
- `cleanup()`을 직접 호출하지 않는다. `bunfig.toml`의 `[test].preload`가 `scripts/happydom.ts`(DOM)와 `scripts/testing-library.ts`(jest-dom 매처, 전역 `afterEach(cleanup)`)를 이미 로드한다.

## 의존성

- `bunfig.toml`의 `minimumReleaseAge`가 3일이라 게시된 지 3일이 안 된 버전은 설치되지 않는다 → 더 오래된 버전을 고르거나, 꼭 필요하면 `minimumReleaseAgeExcludes`에 추가할지 사용자에게 묻는다.
- `package.json`의 script·metadata를 바꾸기 전에 해당 패키지의 기존 구조와 릴리스 설정을 확인한다.

## 릴리스

- 사용자에게 보이는 변경(기능, 버그 수정, 스타일)에는 changeset이 필요하다. `.changeset/*.md`를 직접 쓰지 않고 `seed-change` Skill의 changeset 분기로 만든다. 문서 수정·내부 리팩터링만 있으면 필요 없다.
- `bun version`과 `bun release`는 `.github/workflows/release-publish.yml`이 실행한다. 로컬에서는 changeset 작성까지만 한다.
- PR snapshot 게시·확인은 `seed-snapshot-release` Skill을 따른다. snapshot은 Rootage CDN stable 포인터를 바꾸지 않는다.
- `minor`·`major` → `dev` PR은 merge 버튼으로 합치지 않는다 → 쓰기 권한자가 `/ff-merge` 댓글을 남기면 `.github/workflows/ff-merge.yml`이 커밋·SHA를 유지한 채 `dev`를 fast-forward한다.

## Kapture workflow ownership

Kapture 지원 브랜치와 빌드 명령은 `.github/workflows/kapture-capture.yml`에서 관리한다. 캐시 보관 기간은 `KAPTURE_CACHE_RETENTION_DAYS`, CLI 버전은 각 workflow의 `KAPTURE_CLI_VERSION`이며 설치된 adapter와 같은 버전인지 계약 테스트로 확인한다. Capture, Report, Approve는 실행 이벤트와 권한 경계가 달라 분리한다.

`workflow-tests` job이 `scripts/kapture-workflows.test.ts`와 `scripts/kapture-build-cache.test.ts`를 실행한다. 캐시 조회용 sparse checkout에는 스크립트와 비교 대상 workflow가 모두 포함되어야 한다. 만료는 GitHub artifact의 retention/expired 상태를 따른다.

현재 0.10.0에는 `github restore-build`가 없어 `scripts/kapture-build-cache.mjs`를 임시 유지한다. 해당 명령이 배포되면 CLI·adapter를 함께 올리고, 별도 policy checkout과 조회·download·restored validation 단계를 CLI 호출로 대체한다. `cache-directory`가 비어 있으면 정확한 base를 빌드하고, 복원 여부와 무관하게 현재 실행의 base artifact를 게시한다. 전환 시 임시 조회 스크립트와 그 단위 테스트는 제거하고 YAML 연결 테스트는 유지한다. 빌드 명령·지원 브랜치·보관 기간은 SEED에 남는다.
