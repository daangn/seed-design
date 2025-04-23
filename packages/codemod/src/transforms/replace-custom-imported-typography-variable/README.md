# replace-custom-imported-typography-variable

Seed Design V2에서 V3로 마이그레이션 시 import된 타이포그래피 변수를 변환합니다.

## 기능

- 타이포그래피 관련 import 문을 찾아 변수명을 변환합니다.
- 변수가 사용된 모든 위치(템플릿 리터럴, 객체 속성 등)를 찾아 업데이트합니다.
- typography.mjs의 매핑 정보에 따라 V2 타이포그래피 변수를 V3로 변환합니다.
- 같은 V3 토큰으로 변환되는 중복 import를 제거합니다 (예: subtitle1Regular, bodyM1Regular가 모두 t5Regular로 변환되면 t5Regular는 한 번만 import).
- 별칭(alias)으로 import된 변수명은 유지합니다 (예: `bodyM1Regular as customTypo`에서 `t5Regular as customTypo`로 변환).
