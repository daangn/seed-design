# replace-tailwind-color

Tailwind CSS 색상 클래스를 Seed Design V3 형식으로 변환해요.

## 변환 내용

- Seed Design V2의 색상 클래스 네이밍을 V3 형식으로 변환합니다.
- `text-`, `bg-`, `border-` 등의 접두사를 가진 Tailwind 색상 클래스를 변환합니다.
- 색상 강도(shade)에 따른 변환 매핑을 적용합니다.

## 변환 예시

- `text-carrot-500` → `text-static-orange-base`
- `bg-salmon-100` → `bg-static-red-light`
- `border-navy-900` → `border-static-blue-dark`

## 대상 파일

- `.tsx`, `.jsx`, `.ts`, `.js`, `.html`, `.css` 파일에서 Tailwind 클래스를 사용하는 부분

## 주의사항

- className 문자열, 템플릿 리터럴, 배열 형태 모두 지원합니다.
- Tailwind 동적 클래스 조합(`clsx`, `cx`, `classnames` 등)도 변환됩니다. 
