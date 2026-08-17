# No Deprecated Component

공식 문서·registry가 현재 deprecated로 표시한 컴포넌트·스니펫·토큰·옵션 사용을 판정합니다. category: `components`. severity: `warn`.

## 적용 조건

전체·플랫폼 인덱스 또는 선택된 플랫폼 registry에서 현재 유효한 deprecation 출처와 대상 버전을 확인할 수 있을 때 적용합니다. 인덱스를 정상적으로 읽었는데 출처가 없으면 `not-applicable`, 인덱스·연결 문서·registry를 읽지 못하면 `not-verified`입니다. 다른 플랫폼의 목록을 이식하지 않습니다.

## 판정 방법

1. 전체 인덱스가 연결한 Design Guidelines·migration 문서와 플랫폼 인덱스에서 현재 deprecation 문서를 찾습니다.
2. 컴포넌트 자체는 선택된 플랫폼 registry의 `deprecated` metadata를 함께 확인합니다. 대체안은 인덱스가 연결한 문서에 명시된 경우에만 사용합니다.
3. 토큰·스타일 API는 스타일 패키지 설치본, 컴포넌트·옵션은 구현 패키지 설치본과 문서가 말하는 적용 버전을 각각 대조합니다.
4. 패키지 import, 설치 스니펫, 대상 워크스페이스 코드의 토큰·옵션 사용을 검사합니다. 스니펫 내부가 패키지를 감싸는 정상 사용은 중복 finding으로 만들지 않습니다.
5. 문서가 제거 완료 이력을 제공하면 대상 설치본이 그 경계를 아직 지나지 않았을 때만 업그레이드 위험으로 판정합니다. 현재 항목·버전·대체안 목록을 이 룰에 복사하지 않습니다.

토큰은 문서 표기, 코드 API 표기, CSS 변수 표기가 다를 수 있으므로 현재 Foundations 문서와 설치본 선언에서 변환 관계를 확인합니다. 존재하지 않는 토큰과 내부 스타일 API는 [foundation-contract](./foundation-contract.md)가 소유합니다.

## 수정 방법

이번 실행에서 읽은 공식 문서의 대체안과 제거 시점을 그대로 안내합니다. 대체안이 없으면 임의의 컴포넌트나 토큰을 만들지 않고 추적해야 할 문서와 버전 경계만 남깁니다. 재설치 명령이 필요하면 현재 CLI 문서에서 찾아 제시합니다.

## 문서 풀에서 사용할 근거

- 전체·플랫폼 인덱스가 현재 연결한 deprecation·upgrade 문서
- 선택된 플랫폼의 현재 registry metadata
