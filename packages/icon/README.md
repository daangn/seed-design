# @seed-design/icon

- [한국어](./README.md)
- [English](./README-en.md)

## 설치하기

`@seed-design/icon`는 seed icon 생성을 위한 커맨드라인 도구입니다.

```bash
npm install --dev @seed-design/icon

# or

yarn add -D @seed-design/icon
```

## 사용 방법

단 두 가지 명령어로 seed icon을 생성할 수 있습니다.

### `init` (초기화)

`init` 명령어는 seed icon 생성을 위한 기본 폴더 구조를 생성합니다.
해당 명령어를 입력하면 `icon.config.yml` 설정 파일이 생성됩니다.

```bash
# npm
npm run seed-icon init

# yarn
yarn seed-icon init
```

### `generate` (생성하기)

`generate` 명령어는 생성된 `icon.config.yml` 설정 파일 아이콘에 필요한 파일들을 생성합니다.
생성되는 파일은 **아이콘 컴포넌트**와 **sprite svg 파일**입니다.

```bash
# npm
npm run seed-icon generate
npm run seed-icon gen

# yarn
yarn seed-icon generate
yarn seed-icon gen
```

### etc (기타)

- help
- version

## Config 파일 옵션

`icon.config.yml` 설정 파일은 아래와 같은 옵션을 가집니다.

| Option          | Description                                                                                           | Default                                                               |
| --------------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `icons`         | 위 피그마 파일에서 사용되는 아이콘 이름을 추가해주세요.                                               | [icon_add_circle_fill, icon_add_circle_regular, icon_add_circle_thin] |
| `componentPath` | 아이콘 컴포넌트가 저장될 경로입니다. 프로젝트 루트 기준입니다.                                        | src/components/SeedIcon.tsx                                           |
| `spritePath`    | sprite svg 파일이 저장될 경로입니다. 프로젝트 루트 기준입니다.                                        | src/assets/sprite.svg                                                 |
| `withContext`   | 라이브러리 제공자를 위한 옵션입니다. `provider`를 노출시켜 유저에게서 `spriteUrl`을 받을 수 있습니다. | false                                                                 |
| `contextPath`   | context 파일이 저장될 경로입니다. 프로젝트 루트 기준입니다. `withContext`가 `true`일 때만 동작합니다. |                                                                       |

## sprite.svg 미리 불러오기 (preload guide)

> 현재 sprite.svg preload가 정상적으로 동작되지 않을 수 있습니다.

네트워크 탭에서 sprite.svg를 두 번 요청한다면 제대로 동작하지 않는 가능성이 있습니다.
그럴 땐 아래에 적혀있는 방법들 말고 HTML에 직접 sprite.svg를 삽입해서 사용해주세요.
자세한 가이드는 아래와 같습니다.

### preload 잘 안될 때

우선 직접 sprite.svg를 삽입해서 사용해보세요.
sprite.svg를 HTML에 직접 삽입하는 것이 프로젝트 성능에 큰 영향을 미치지 않습니다.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- head -->
  </head>
  <body>
    <svg hidden aria-hidden="true" display="none">
      <symbol id="icon_add_circle_fill"></symbol>
      <symbol id="icon_add_circle_regular"></symbol>
      <symbol id="icon_add_circle_thin"></symbol>
    </svg>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

`display` 속성을 `none`으로 설정해주세요.

그리고 사용하는 측에서는 `<use />`에 href 속성을 `#icon_add_circle_fill` 형태로 사용해주세요.

```tsx
const SeedIcon: ForwardRefRenderFunction<HTMLSpanElement, SeedIconProps> = (
  { name, className, size },
  ref,
) => {
  return (
    <span
      ref={ref}
      style={{ display: "inline-flex", width: size, height: size }}
      className={className}
      data-seed-icon={name}
      data-seed-icon-version="0.1.0-20230217.2"
    >
      <svg viewBox="0 0 24 24">
        {/* HTML에 sprite.svg를 이미 불러왔다면 # 뒤에 id 값만 적어주어도 동작합니다. */}
        <use href={`#${name}`} />
      </svg>
    </span>
  );
};
```

### Vite

> vite는 svg loader를 기본적으로 제공하고 있습니다.
> 그래서 따로 설정해줘야 하는 부분이 없고, `index.html`에 아래와 같이 `sprite.svg`를 preload 해주면 됩니다.

```html
<link
  rel="preload"
  as="image"
  type="image/svg+xml"
  href="your-sprite-svg-path"
/>
```

`init`에는 `-t` 혹은 `--template` 옵션에 `vite`를 입력해서 config를 생성할 수 있습니다.

```bash
# npm
npm run seed-icon init -t vite
npm run seed-icon init --template vite

# yarn
yarn seed-icon init -t vite
yarn seed-icon init --template vite
```

그럼 `vite`프로젝트에 맞는 `icon.config.yml` 설정 파일이 생성됩니다.

### Next.js (Webpack)

> CRA, Next.js는 svg loader를 기본적으로 제공하고 있지 않습니다.

CRA는 eject 혹은 override를 통해 svg loader를 설정해줘야 합니다.

Next.js는 `next.config.js`에 svg loader를 설정해줘야 합니다.

```bash
# npm
npm install --dev file-loader

# or

yarn add -D file-loader
```

그리고 `next.config.js`에 아래와 같이 svg loader를 설정해줍니다.

```js
// next.config.js
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(svg)$/i,
      use: [
        {
          loader: "file-loader",
          options: {
            name: "sprite-[contenthash].svg", // -> ex) sprite-1a2b3c4d5e6f7g8h9i0j.svg
            outputPath: "static/",
          },
        },
      ],
    });

    return config;
  },
};

module.exports = nextConfig;
```

`file-loader`를 사용해서 `sprite.svg`를 `static` 폴더에 저장하고, preload가 필요한 페이지에서 `sprite.svg`를 `<Head>` 태그안에서 preload 해주면 됩니다.

```jsx
import Head from "next/head";
import sprite from "@/assets/sprite.svg";

export default function Home() {
  return (
    <>
      <Head>
        <link rel="preload" as="image" type="image/svg+xml" href={sprite} />
        {/**/}
      </Head>
      <main className={styles.main}>{/**/}</main>
    </>
  );
}
```

### CRA (Webpack)

> CRA는 svg loader를 기본적으로 제공하고 있지 않습니다.

CRA는 eject 혹은 override를 통해 svg loader를 설정해줘야 합니다.
그 이후에는 Next.js와 동일하게 `sprite.svg`를 preload 해주면 됩니다.

## 라이브러리 제공자 (provider)

`withContext` 옵션을 `true`로 설정하면 라이브러리 제공자를 위한 context 파일이 생성됩니다.
context 파일은 `contextPath` 옵션에 설정한 경로에 생성됩니다.

생성되는 `context`는 아래와 같이 생겼습니다.

```tsx
import { createContext, type PropsWithChildren } from "react";

interface SeedIconProviderProps {
  spriteUrl: string; // 유저가 입력 할 sprite.svg 파일의 경로, 필수 값 입니다.
}

export const SeedIconContext = createContext("");

export const SeedIconProvider = ({
  children,
  spriteUrl,
}: PropsWithChildren<SeedIconProviderProps>) => {
  return (
    <SeedIconContext.Provider value={spriteUrl}>
      {children}
    </SeedIconContext.Provider>
  );
};

// 혹은

export const YourLibraryProvider = ({
  children,
  spriteUrl,
  ...etc
}: PropsWithChildren<SeedIconProviderProps>) => {
  return (
    <YourOtherContext.Provider value={...etc}>
      <SeedIconContext.Provider value={spriteUrl}>
        {children}
      </SeedIconContext.Provider>
    </YourOtherContext.Provider>
  );
};
```

`spriteUrl`은 유저가 입력 할 `sprite.svg` 파일의 경로입니다.
라이브러리 제공자는 해당 Provider를 노출시켜 유저에게서 `spriteUrl`을 받아서 사용할 수 있습니다.

```tsx
import { SeedIconProvider } from "your-library";
import { YourLibraryProvider } from "your-library";

export default function App() {
  return (
    <SeedIconProvider spriteUrl="유저가 입력한 sprite.svg 경로">
      {/**/}
    </SeedIconProvider>
  );
}

// 혹은

export default function App() {
  return (
    <YourLibraryProvider spriteUrl="유저가 입력한 sprite.svg 경로">
      {/**/}
    </YourLibraryProvider>
  );
}
```

만약 라이브러리 개발 모드에서 아이콘을 확인하고 싶다면 `spriteUrl`에 `sprite.svg` 파일의 경로를 직접 입력해주면 됩니다.

```tsx
import { SeedIconProvider } from "./context/SeedIconContext";
import sprite from "./assets/sprite.svg";

export default function App({ children }) {
  return <SeedIconProvider spriteUrl={sprite}>{children}</SeedIconProvider>;
}
```
