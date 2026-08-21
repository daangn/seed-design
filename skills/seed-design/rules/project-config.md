# Project Config

현재 공식 CLI 설정 계약과 실제 프로젝트 경로 연결을 판정합니다. category: `config`.

## 적용 조건

선택된 워크스페이스마다 실행합니다. 설정 파일이 없어도 직접 `@seed-design/*` 의존성이 있으면 Doctor는 계속하며, 이 룰이 설정 부재의 영향을 판정합니다.

## 판정 방법

1. 전체·플랫폼 인덱스에서 현재 `Configuration` 또는 같은 역할의 CLI 문서를 찾습니다. 설치한 CLI 소스의 설정 schema를 읽을 수 있으면 함께 대조합니다. 필드 목록과 기본값을 이 룰에 복사하지 않습니다.
2. 현재 schema가 허용한 키·타입·필수값으로 `seed-design.json`을 검사합니다. CLI 실행을 막는 schema 오류는 `error`입니다.
3. 사용자 명시 → 설정의 framework → 직접 의존성 순으로 정한 플랫폼과 설정·직접 의존성을 대조합니다. 충돌하면 높은 순위 단서를 유지하고 충돌한 파일·패키지를 근거로 `error`를 냅니다.
4. 설정의 snippet path를 설정 파일 위치 기준으로 해석하고 실제 사용처와 연결합니다. 디렉토리가 없더라도 snippet import·`@file` 헤더·alias처럼 그 경로를 사용한다는 증거가 없다면 finding을 만들지 않고 evidence에만 기록합니다. 사용 증거가 있는데 디렉토리가 없으면 `error`입니다.
5. TypeScript paths와 번들러/runtime alias가 snippet path와 같은 디렉토리를 가리키는지 확인합니다. alias 자체가 필요한지는 [project-setup](./project-setup.md)이 현재 설치 문서에서 판단하고, 이 룰은 존재하는 연결끼리의 불일치만 판정합니다.

설정이 없을 때는 다음처럼 나눕니다.

- 스니펫 import 또는 `@file` 헤더가 있으면 CLI가 위치를 확정할 수 없으므로 `warn`.
- 직접 패키지만 사용하고 스니펫 증거가 없으면 finding을 만들지 않습니다. 설정이 전제인 스니펫 check에는 `not-applicable` 이유를 남깁니다.

## 중복 경계

- 설치 절차가 완성됐는지는 `project-setup`이 판단합니다.
- 설치 패키지끼리 맞는지는 `package-compatibility`, 스니펫과 패키지가 맞는지는 `snippet-compatibility`가 판단합니다.
- 설정이 유효하면 최신 버전이 아니더라도 이 룰은 통과입니다.

## 문서 풀에서 사용할 근거

- 전체·플랫폼 인덱스가 현재 연결한 CLI 설정 문서
