# replace-alpha-color

Seed Design V3에서 V3로 알파 컬러 토큰을 업데이트하는 transform입니다.
이 transform은 다음과 같은 알파 컬러 토큰들을 새로운 값으로 변경합니다:

- `staticBlackAlpha50` → `staticBlackAlpha200`
- `staticBlackAlpha200` → `staticBlackAlpha500`
- `staticBlackAlpha500` → `staticBlackAlpha700`
- `staticWhiteAlpha200` → `staticWhiteAlpha300`

## 주의사항

- 이 transform은 JavaScript/TypeScript 파일과 CSS 파일을 모두 자동으로 처리합니다.
- **한 번만 실행**: 동일한 파일에 여러 번 실행하면 연쇄 변환이 발생할 수 있습니다
- **V3 → V3 마이그레이션**: 이미 V3를 사용 중인 프로젝트에서만 사용하세요
- **백업 권장**: 변환 전에 코드를 백업하는 것을 권장합니다
- **순서 중요**: 큰 번호부터 작은 번호 순으로 변환하여 연쇄 변환을 방지합니다
