# AGENTS.md — packages/lynx-react

## 디렉토리 개요

Lynx 플랫폼용 스타일드 React 컴포넌트 패키지. `@seed-design/react`의 Lynx 대응 버전으로, Lynx 런타임 제약에 맞춘 구현을 제공한다.

## Lynx 런타임 주의사항

### style prop은 string으로 전달

Lynx는 style object를 빌드 타임에 정적 CSS로 컴파일한다. 동적 CSS custom property 값을 설정하려면 **string literal**로 전달해야 한다.

```tsx
// ❌ 동적 값 무시됨
<view style={{ "--seed-box-background": value }} />

// ✅ dynamicStyle() 유틸 사용
import { dynamicStyle } from "../../utils/dynamic-style";
<view style={dynamicStyle({ "--seed-box-background": value })} />
```

### children은 nativeProps와 분리

`{...nativeProps}`로 spread하면 `children`이 포함되어 Lynx의 `commitPatchUpdate`에서 circular reference 에러 발생. 항상 children을 별도로 추출해서 JSX children으로 전달한다.

```tsx
const { children, ...nativeProps } = restProps;
<view {...nativeProps}>{children}</view>
```

### ref null 가드

Lynx의 `applyRef`는 null ref에 `.current`를 설정하려고 에러를 던진다. `forwardRef` 사용 시 ref가 null이면 전달하지 않는다.

```tsx
const mergedProps = {
  ...(ref ? { ref } : {}),
  className,
  style,
};
```

### inherit 키워드 미지원

Lynx는 CSS `inherit` 키워드를 지원하지 않는다. CSS variable을 `inherit`로 초기화하는 패턴(웹의 `.seed-text`)은 Lynx에서 동작하지 않으므로, 스타일을 요소에 직접 적용해야 한다.

## 파일 작성 컨벤션

- 컴포넌트: `src/components/<ComponentName>/<ComponentName>.tsx` + `index.ts`
- 유틸리티: `src/utils/<util-name>.ts`
- 빌드: `tsc`로 `lib/`에 출력
