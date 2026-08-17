# Foundation Contract

선택된 플랫폼의 토큰·스타일 API가 현재 공개 계약 안에서 사용되는지 판정합니다. category: `foundations`.

## 적용 조건

SEED 토큰 import, vars 접근, SEED CSS 변수 또는 스타일 패키지 import가 코드에 있을 때 적용합니다. 대상이 없으면 `not-applicable`입니다.

## 판정 방법

1. 전체 인덱스의 Foundations 진입점과 선택된 플랫폼 인덱스에서 관련 문서를 찾습니다.
2. 선택된 플랫폼의 설치본 package exports, 타입 선언, 생성된 공개 변수 목록을 읽습니다.
3. 코드의 import path·vars 접근·CSS 변수 이름이 현재 설치본에 존재하고 공식 문서 또는 package exports에서 공개됐는지 확인합니다. 해석되지 않는 사용은 `error`입니다.
4. 존재하더라도 문서·exports가 공개하지 않은 component 전용 변수나 내부 경로 의존은 `warn`입니다. 특정 예외 경로나 변수 이름을 이 룰에 유지하지 않고 현재 exports와 문서로 판단합니다.
5. deprecated·제거 예정 토큰은 현재 공식 deprecation 출처가 있을 때 [no-deprecated-component](./no-deprecated-component.md)가 소유합니다.

다른 플랫폼의 토큰 표기나 exports를 이식하지 않습니다. `--seed-` 같은 접두사만으로 공개·내부를 추측하지 않습니다.

## 하지 않는 판단

- 하드코딩 값이 나쁜지
- semantic token 선택이 디자인 맥락에 적절한지
- 토큰 값 자체가 화면 의도에 맞는지

Doctor는 존재·공개성·제거·내부 API 의존 같은 계약 위반만 판정합니다.

## 문서 풀에서 사용할 근거

- 전체 인덱스가 연결한 Foundations 인덱스
- 선택된 플랫폼 인덱스가 연결한 스타일·토큰 문서
- 대상의 실제 설치본 package exports
