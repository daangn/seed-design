# replace-custom-imported-typography-variable

Seed Design V2에서 V3로 마이그레이션 시 import된 타이포그래피 변수를 변환합니다.

## 기능

- 타이포그래피 관련 import 문을 찾아 변수명을 변환합니다.
- 변수가 사용된 모든 위치(템플릿 리터럴, 객체 속성 등)를 찾아 업데이트합니다.
- typography.mjs의 매핑 정보에 따라 V2 타이포그래피 변수를 V3로 변환합니다.

## 테스트 케이스

- **basic**: 기본적인 변환 케이스
- **enhanced**: 다양한 타이포그래피 변수 매핑 케이스
  - screenTitle 매핑 (h4 -> screenTitle)
  - 일반 매핑 (title1Bold -> t9Bold)
  - deprecated 토큰 처리 (title1Regular)
  - 별칭을 사용한 import 처리
  - 대체 토큰 처리 (bodyL2Regular -> t4Regular)
  - 객체 속성으로 사용된 토큰 처리
  - 다양한 컨텍스트에서의 변수 사용 패턴
