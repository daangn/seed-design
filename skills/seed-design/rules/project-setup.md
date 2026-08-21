# Project Setup

앱이 선택된 플랫폼의 현재 공식 설치·스타일 계약을 실제로 연결했는지 판정합니다. category: `setup`. 확인된 필수 연결 누락은 `error`입니다.

## 적용 조건

`meta.projectKinds`에 `app`이 있을 때 적용합니다. 플랫폼 인덱스를 정상적으로 읽었는데 앱 설치 계약 문서가 없으면 `not-applicable`, 인덱스나 연결 문서를 읽지 못하면 `not-verified`입니다.

## 판정 방법

1. 플랫폼 인덱스에서 installation·styling·theming·feature flags처럼 현재 프로젝트 방식과 관련된 문서를 찾습니다. 제목을 고정 목록으로 매칭하지 말고 설명과 문서 내용을 함께 봅니다.
2. package.json, 앱 entry, 전역 스타일, TypeScript 설정, 번들러 설정에서 실제로 채택한 설치 방식을 확정합니다.
3. 선택한 방식에 해당하는 문서의 필수 단계를 실행 시점에 추출해 하나씩 대조합니다. 플러그인 이름·CSS import·테마 속성·feature flag 값을 이 룰에 복사하지 않습니다.
4. 여러 공식 설치 방식 중 하나가 완성돼 있으면 통과입니다. 한 방식을 택한 프로젝트에 다른 방식의 요구사항을 합쳐 적용하지 않습니다.
5. 앱 entry나 실제 빌드 경로를 확정할 수 없으면 실패로 바꾸지 않고 `not-verified`로 남깁니다.

## 중복 경계

설정 파일 자체의 schema와 경로 충돌은 `project-config`, 패키지 버전 조합은 `package-compatibility`가 판단합니다.

## 문서 풀에서 사용할 근거

- 선택된 플랫폼 인덱스가 현재 연결한 설치·스타일 문서
