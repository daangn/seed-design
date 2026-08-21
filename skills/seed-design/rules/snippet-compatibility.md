# Snippet Compatibility

설치된 스니펫의 요구 범위와 현재 패키지 버전이 맞는지 현재 공식 CLI의 호환 검사 결과로 판정합니다. category: `compatibility`. 확인된 비호환은 `error`입니다.

## 적용 조건

유효한 snippet path 아래에 `@file` 헤더가 있는 설치 스니펫이 있을 때 적용합니다. 설정·스니펫이 없으면 `not-applicable`, 헤더가 없어 설치 항목을 식별할 수 없으면 `not-verified`입니다.

## 판정 방법

1. 전체·플랫폼 인덱스에서 현재 CLI 또는 Commands 문서를 찾아 호환 검사 명령과 옵션을 읽습니다. 명령 형식과 framework flag를 이 룰에 고정하지 않습니다.
2. 대상 lockfile로 패키지 매니저를 판별하고 그 프로젝트의 실행기를 사용합니다.
3. 문서가 현재 선택된 플랫폼을 지원한다고 명시한 방식으로 읽기 전용 호환 검사를 실행합니다.
4. 명령이 검사한 항목·출력·종료 코드를 evidence로 보존해 pass/fail을 정합니다. 네트워크·실행기·registry 접근 문제는 `not-verified`입니다.

호환 검사는 읽기 전용으로만 실행합니다. 패키지 설치, snippet add·upgrade 같은 변경 명령은 실행하지 않습니다.

## 중복 경계

- 최신 registry와 설치 세대의 차이는 [snippet-generation](./snippet-generation.md)만 판단합니다.
- 구현·스타일 패키지끼리의 호환은 [package-compatibility](./package-compatibility.md)만 판단합니다.

## 문서 풀에서 사용할 근거

- 전체·플랫폼 인덱스가 연결하거나 현재 플랫폼 지원을 명시한 CLI 문서
