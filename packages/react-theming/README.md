# @seed-design/react-theming

> 리액트에서 다크모드를 사용할 수 있어요.

다크모드는 원래 두 가지 옵션이 아니라 세 가지 옵션이에요.
light, dark, 그리고 system.

## 설치

```console
$ npm install @seed-design/react-theming
$ yarn add @seed-design/react-theming
```

## 사용법

```ts
// Provider를 감싸줘야해요.
import { type ColorMode, ThemeContext, useThemeBehavior } from "@seed-design/react-theming";

export type Options = {
  mode: ColorMode; // "light-only" | "dark-only" | "auto",
};

export const Wrapper: React.FC<React.PropsWithChildren<Options>> = ({ mode, children }) => {
  const theme = useThemeBehavior({ mode });
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

// 변경하기
import { useTheme } from "@seed-design/react-theming";

const YourComponent = () => {
  const { setColorTheme } = useTheme();

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "light" | "dark" | "system";
    setColorTheme(value);
  };

  return null;
};
```
