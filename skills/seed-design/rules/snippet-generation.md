# Snippet Generation

설치된 스니펫이 현재 canonical registry와 같은 세대의 요구 범위를 갖는지 판정합니다. category: `compatibility`. 세대 격차는 `info`입니다.

## 적용 조건

유효한 snippet path 아래에 설치 스니펫이 있고, 현재 CLI·registry 문서가 설치 세대와 canonical registry를 대조할 근거를 제공할 때 적용합니다. 설정·스니펫·세대 근거 중 하나가 없으면 `not-applicable`, 필요한 문서나 registry를 읽지 못하면 `not-verified`입니다.

## 판정 방법

1. snippet root에서 파일 헤더의 `@file`과 `@requires`를 수집합니다.
2. 선택된 플랫폼의 현재 registry 전체 인덱스에서 같은 `(registryId, itemId, snippetPath)`의 canonical dependencies를 찾습니다.
3. 현재 공식 CLI·registry 문서가 설치 세대 registry를 제공하면 같은 키로 요구 범위를 비교합니다. 세대 URL이나 지원 버전 목록을 이 룰에 복사하지 않습니다.
4. `@file` 헤더가 없거나 세대 원본을 식별할 수 없으면 경로로 추측하지 않고 `not-verified`로 남깁니다.
5. 로컬 코드 해시 차이는 변환·커스터마이징과 구별할 수 없으므로 이 룰에서 판정하지 않습니다.

현재 설치 패키지와 스니펫의 실제 호환은 [snippet-compatibility](./snippet-compatibility.md)가 소유합니다. 스니펫 전건이 같은 이유로 뒤졌다면 한 finding과 `files[]`로 묶습니다.

## 수정 방법

전체·플랫폼 인덱스에서 현재 CLI 문서를 찾아 그 문서가 안내하는 backup·diff 보존 방식으로 재설치를 제안합니다. 명령과 옵션을 이 룰에 고정하지 않습니다.

## 문서 풀에서 사용할 근거

- 전체·플랫폼 인덱스가 현재 연결한 CLI·registry·upgrade 문서
