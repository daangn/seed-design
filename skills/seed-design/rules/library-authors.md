# Library Authors

소비 가능한 패키지가 선택된 플랫폼의 현재 공식 라이브러리 저자 계약에 맞게 배포되는지 판정합니다. category: `library`. 확인된 배포 위험은 `warn`입니다.

## 적용 조건

`meta.projectKinds`에 `library`가 있을 때 플랫폼 인덱스에서 Library Authors 또는 같은 역할의 공식 배포 계약 문서를 찾습니다. 인덱스를 정상적으로 읽었는데 해당 계약이 없으면 `not-applicable`, 인덱스나 연결 문서를 읽지 못하면 `not-verified`입니다. 다른 플랫폼의 저자 정책을 이식하지 않습니다.

소비 가능 여부는 `private`나 npm 공개 여부만으로 판단하지 않습니다. package entry와 library build·publish artifact 증거를 함께 봅니다.

## 판정 방법

1. 발견한 저자 문서에서 peerDependencies, 지원 범위, bundler external, CSS 소유권, 소비자 설치·배포 문서에 관한 현재 요구사항을 추출합니다.
2. package.json의 runtime·peer·dev 의존성 역할과 문서가 요구한 범위를 대조합니다.
3. 실제 library 빌드 설정과 기존 dist에서 external이 유지되고 구현·스타일 코드가 중복 번들되지 않는지 확인합니다. Doctor가 새 빌드를 만들지는 않습니다.
4. 소스의 전역 CSS import와 README·배포 문서를 현재 저자 문서의 소비자 책임 계약에 맞춰 검사합니다.
5. 공식 문서가 요구하지 않은 범위 표기나 전환 전략을 기억으로 추가하지 않습니다. 여러 세대를 지원한다고 선언한 경우 실제 검증 증거가 있는지만 확인합니다.
6. 내부 스타일 API 의존은 [foundation-contract](./foundation-contract.md)가 소유합니다.

## 수정 방법

발견한 공식 저자 문서가 요구하는 순서와 용어로 수정안을 안내합니다. peer 이동처럼 소비자 설치 동작을 바꾸는 조치는 자동 수정하지 않습니다.

## 문서 풀에서 사용할 근거

- 선택된 플랫폼 인덱스가 현재 연결한 라이브러리 저자·배포 문서
