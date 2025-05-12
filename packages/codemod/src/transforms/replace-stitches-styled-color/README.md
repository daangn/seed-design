# replace-stitches-styled-color

Stitches로 스타일링된 컴포넌트의 색상을 V3 형식으로 변환해요.

## 변환 내용

- Stitches `styled()` 함수에서 사용된 Seed Design V2 색상 토큰을 V3 색상 토큰으로 변환합니다.
- 모든 색상 관련 스타일 속성(color, backgroundColor, borderColor 등)을 지원합니다.
- 상태 변이(variants)에 적용된 색상 변경도 함께 변환합니다.

## 대상 파일

- `.tsx`, `.jsx`, `.ts`, `.js` 파일에서 Stitches 스타일링 사용 부분

## 주의사항

- 기존 코드의 구조와 포맷을 최대한 유지하면서 색상 값만 변경합니다.
- 커스텀 색상 값이나 CSS 변수는 변환하지 않습니다. 
