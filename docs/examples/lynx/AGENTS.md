# Lynx 예제

## 디렉토리 개요

Lynx 컴포넌트 문서에서 실행하는 ReactLynx 예제를 둡니다. Rspeedy가 각 TSX 파일을 브라우저 미리보기용 bundle과 native Lynx bundle로 함께 빌드합니다.

## 파일 작성 컨벤션

- 경로는 `<component>/<scenario>.tsx`의 두 단계로 구성하고 두 이름 모두 kebab-case를 사용합니다.
- TSX 파일 하나가 하나의 entry입니다. 같은 컴포넌트에서 공유하는 스타일은 `styles.ts`와 `preview.css`에 둡니다.
- symlink와 컴포넌트 디렉터리 밖의 파일은 사용하지 않습니다.

## 코드 작성 컨벤션

- entry는 필요한 스타일을 import하고 `<page>`를 렌더한 뒤 `root.render()`를 직접 호출합니다.
- 새로 작성하거나 대상 컴포넌트 import를 수정하는 예제는 Lynx registry 항목이 있으면 `@/components/ui/<name>`의 registry 모듈을 사용합니다. registry가 없는 package-only 컴포넌트만 `@seed-design/lynx-react`의 공개 export를 직접 사용합니다. 기존 예제의 일괄 변경은 별도 작업으로 다룹니다.
- 사용자 이벤트는 Lynx 이벤트 prop을 사용합니다. background thread에서 실행해야 하는 handler에는 `"background only"` 지시문을 둡니다.
