# Outdated Version

직접 설치한 `@seed-design/*` 패키지와 registry 최신 버전의 격차를 판정합니다. category: `compatibility`. 이 룰은 최신성만 보고 실제 패키지 조합의 호환 여부는 판단하지 않습니다.

## 적용 조건

워크스페이스가 `@seed-design/*` 패키지를 직접 선언하고, 선택된 플랫폼 인덱스가 현재 업그레이드·changelog 경로를 제공할 때 적용합니다. 인덱스에 공식 업그레이드 경로가 없으면 `not-applicable`, 인덱스나 registry를 읽지 못하면 `not-verified`입니다.

## 판정 방법

1. 워크스페이스가 직접 선언한 플랫폼 관련 패키지만 수집합니다. 전이 의존성은 제외합니다.
2. 선언 범위가 아니라 hoist를 고려한 실제 설치본 `package.json`의 버전을 읽습니다.
3. 대상 패키지 매니저의 registry 조회 또는 npm registry API로 각 패키지의 최신 버전을 읽습니다. 패키지 경로나 최신 버전을 다른 패키지에서 유추하지 않습니다.
4. 버전 격차는 `info`로 기록합니다. 실제 호환 오류는 [package-compatibility](./package-compatibility.md)가 별도로 판정합니다.
5. 업그레이드 영향은 플랫폼 인덱스가 현재 연결한 upgrade·changelog 문서를 읽어 안내합니다. SemVer 경계나 마이그레이션 순서를 이 룰에 복사하지 않습니다.

패키지가 여러 개면 같은 원인과 조치로 사라지는 최신성 격차를 한 finding과 `files[]`로 묶을 수 있습니다.

## 문서 풀에서 사용할 근거

- 선택된 플랫폼 인덱스가 현재 연결한 upgrade·changelog 문서
- 대상 package registry metadata
