# Seed Design Codemod

이 문서는 자동으로 생성되었습니다.

## 사용 가능한 Transforms

### replace-color-prop

실행 방법:

```bash
npx @seed-design/codemod replace-color-prop <target_path>
```

<details>
<summary>변경 예시</summary>

<table>
<tr><th>변경 전</th><th>변경 후</th></tr>
<tr><td>

```tsx
// @ts-nocheck

const Component = () => {
  return (
    <>
      <Text
        color="gray100"
        variant="subtitle2Regular"
        className="text-ellipsis-2"
      />
      <Text
        color="gray700"
        variant="subtitle2Regular"
        className="text-ellipsis-2"
      />
      <Text
        color="carrot100"
        variant="subtitle2Regular"
        className="text-ellipsis-2"
      />
      <Text
        color="carrot500"
        variant="subtitle2Regular"
        className="text-ellipsis-2"
      />
      <Text
        color="carrot700"
        variant="subtitle2Regular"
        className="text-ellipsis-2"
      />
      <Text
        color="carrot900"
        variant="subtitle2Regular"
        className="text-ellipsis-2"
      />
      <Text
        color="staticBlack"
        variant="subtitle2Regular"
        className="text-ellipsis-2"
      />
      <Text
        color="staticWhite"
        variant="subtitle2Regular"
        className="text-ellipsis-2"
      />
      <Text
        color="onPrimary"
        variant="subtitle2Regular"
        className="text-ellipsis-2"
      />
      <Text color={isSelected ? "onPrimary" : "primary"} />
      <Text color={isSelected ? "primary" : "gray900"} />
      <Text color={isSelected ? "carrot600" : "blue600"} />
    </>
  );
};
```

</td><td>

```tsx
// @ts-nocheck

const Component = () => {
  return (
    <>
      <Text
        color="palette.gray200"
        variant="subtitle2Regular"
        className="text-ellipsis-2"
      />
      <Text
        color="palette.gray800"
        variant="subtitle2Regular"
        className="text-ellipsis-2"
      />
      <Text
        color="palette.carrot200"
        variant="subtitle2Regular"
        className="text-ellipsis-2"
      />
      <Text
        color="palette.carrot600"
        variant="subtitle2Regular"
        className="text-ellipsis-2"
      />
      <Text
        color="palette.carrot700"
        variant="subtitle2Regular"
        className="text-ellipsis-2"
      />
      <Text
        color="palette.carrot800"
        variant="subtitle2Regular"
        className="text-ellipsis-2"
      />
      <Text
        color="palette.staticBlack"
        variant="subtitle2Regular"
        className="text-ellipsis-2"
      />
      <Text
        color="palette.staticWhite"
        variant="subtitle2Regular"
        className="text-ellipsis-2"
      />
      <Text
        color="palette.staticWhite"
        variant="subtitle2Regular"
        className="text-ellipsis-2"
      />
      <Text color={isSelected ? "palette.staticWhite" : "fg.brand"} />
      <Text color={isSelected ? "fg.brand" : "palette.gray1000"} />
      <Text color={isSelected ? "palette.carrot600" : "palette.blue600"} />
    </>
  );
};
```

</td></tr></table>

</details>

### replace-tailwind-typography

실행 방법:

```bash
npx @seed-design/codemod replace-tailwind-typography <target_path>
```

<details>
<summary>변경 예시</summary>

<table>
<tr><th>변경 전</th><th>변경 후</th></tr>
<tr><td>

```tsx
// @ts-nocheck

export function BasicExample() {
  return (
    <div>
      <div className="caption1Bold whitespace-pre-wrap text-center text-[--tick-color]">
        Primary Background
      </div>
      <p className="bodyL2Regular text-palette-gray-800">{formState.content}</p>
      <div className="title3Bold">Hover Primary Low Background</div>
      <div className="caption2Regular">Focus Primary Low Background</div>
      <div className="[&>section_h2]:subtitle1Bold">
        Focus Primary Low Background
      </div>
      <h3 className={cn("subtitle1Bold", className)} {...props} />
      <h3
        className={isDisabled ? "subtitle1Regular" : "subtitle1Bold"}
        {...props}
      />
      <p className="caption2Regular text-palette-gray-800">{description}</p>
    </div>
  );
}
```

</td><td>

```tsx
// @ts-nocheck

export function BasicExample() {
  return (
    <div>
      <div className="t3-bold whitespace-pre-wrap text-center text-[--tick-color]">
        Primary Background
      </div>
      <p className="t4-regular text-palette-gray-800">{formState.content}</p>
      <div className="t6-bold">Hover Primary Low Background</div>
      <div className="t2-regular">Focus Primary Low Background</div>
      <div className="[&>section_h2]:t5-bold">Focus Primary Low Background</div>
      <h3 className={cn("t5-bold", className)} {...props} />
      <h3 className={isDisabled ? "t5-regular" : "t5-bold"} {...props} />
      <p className="t2-regular text-palette-gray-800">{description}</p>
    </div>
  );
}
```

</td></tr></table>

</details>

### replace-typography-design-token

실행 방법:

```bash
npx @seed-design/codemod replace-typography-design-token <target_path>
```

<details>
<summary>변경 예시</summary>

<table>
<tr><th>변경 전</th><th>변경 후</th></tr>
<tr><td>

```tsx
// @ts-nocheck

import { classNames } from "@seed-design/design-token";

const typography = {
  one: classNames.$semantic.typography.title2Regular,
  two: classNames.$semantic.typography.label3Regular,
  three: classNames.$semantic.typography.label5Regular,
  four: classNames.$semantic.typography.label6Regular,
};
```

</td><td>

```tsx
// @ts-nocheck

import { text } from "@seed-design/css/recipes/text";

const typography = {
  one: text({ textStyle: "t7Regular" }),
  two: text({ textStyle: "t4Regular" }),
  three: text({ textStyle: "t1Regular" }),
  four: text({ textStyle: "t1Regular" }),
};
```

</td></tr></table>

</details>

### replace-text-component

실행 방법:

```bash
npx @seed-design/codemod replace-text-component <target_path>
```

<details>
<summary>변경 예시</summary>

<table>
<tr><th>변경 전</th><th>변경 후</th></tr>
<tr><td>

```tsx
// @ts-nocheck

import Text from "components/Base/Text";

const Component = () => {
  return (
    <div>
      <Text variant="title2Bold">광고 노출 기준</Text>
      <Text variant="subtitle1Regular">
        앱 내 최근 활동 이력을 분석하여 이용자의 관심사와 관련성이 높은 게시글을
        노출해요.
      </Text>
    </div>
  );
};
```

</td><td>

```tsx
// @ts-nocheck

import { Text } from "@seed-design/react";

const Component = () => {
  return (
    <div>
      <Text textStyle="t7Bold">광고 노출 기준</Text>
      <Text textStyle="t5Regular">
        앱 내 최근 활동 이력을 분석하여 이용자의 관심사와 관련성이 높은 게시글을
        노출해요.
      </Text>
    </div>
  );
};
```

</td></tr></table>

</details>

### migrate-icons

실행 방법:

```bash
npx @seed-design/codemod migrate-icons <target_path>
```

### replace-css-typography-variable

실행 방법:

```bash
npx @seed-design/codemod replace-css-typography-variable <target_path>
```

### replace-color-design-token

실행 방법:

```bash
npx @seed-design/codemod replace-color-design-token <target_path>
```

<details>
<summary>변경 예시</summary>

<table>
<tr><th>변경 전</th><th>변경 후</th></tr>
<tr><td>

```tsx
import { vars } from "@seed-design/design-token";

const color = vars.$scale.color.gray500;
```

</td><td>

```tsx
import { vars } from "@seed-design/css/vars";

const color = vars.$color.palette.gray600;
```

</td></tr></table>

</details>

### replace-css-color-variable

실행 방법:

```bash
npx @seed-design/codemod replace-css-color-variable <target_path>
```

### replace-tailwind-color

실행 방법:

```bash
npx @seed-design/codemod replace-tailwind-color <target_path>
```

<details>
<summary>변경 예시</summary>

<table>
<tr><th>변경 전</th><th>변경 후</th></tr>
<tr><td>

```tsx
// @ts-nocheck

export function BackgroundExample() {
  return (
    <div>
      <div className="bg-primary">Primary Background</div>
      <div className="bg-primaryLow">Primary Low Background</div>
      <div className="hover:bg-primaryLow">Hover Primary Low Background</div>
      <div className="focus:bg-primaryLow">Focus Primary Low Background</div>
      <div className="active:bg-primaryLow">Active Primary Low Background</div>
      <div className="bg-gray500">Scale Background</div>
      <div className="bg-carrot100">Scale Carrot Low Background</div>
      <div className="bg-carrot200">Scale Carrot Mid Background</div>
      <div className="bg-carrot300">Scale Carrot High Background</div>
      <div className="bg-carrot400">Scale Carrot High Background</div>
      <div className="bg-carrot500">Scale Carrot High Background</div>
      <div className="bg-carrot600">Scale Carrot High Background</div>
      <div className="bg-carrot700">Scale Carrot High Background</div>
      <div className="bg-carrot800">Scale Carrot High Background</div>
      <div className="bg-carrot900">Scale Carrot High Background</div>
      <div className="!bg-carrot900">Scale Carrot High Background</div>
      <div className="bg-staticBlack">Static Black Background</div>
      <div className="bg-staticWhite">Static White Background</div>
      <div className="bg-staticGray900">Static Gray900 Background</div>
    </div>
  );
}
```

</td><td>

```tsx
// @ts-nocheck

export function BackgroundExample() {
  return (
    <div>
      <div className="bg-bg-brand-solid">Primary Background</div>
      <div className="bg-palette-carrot-100">Primary Low Background</div>
      <div className="hover:bg-palette-carrot-100">
        Hover Primary Low Background
      </div>
      <div className="focus:bg-palette-carrot-100">
        Focus Primary Low Background
      </div>
      <div className="active:bg-palette-carrot-100">
        Active Primary Low Background
      </div>
      <div className="bg-palette-gray-600">Scale Background</div>
      <div className="bg-palette-carrot-200">Scale Carrot Low Background</div>
      <div className="bg-palette-carrot-300">Scale Carrot Mid Background</div>
      <div className="bg-palette-carrot-400">Scale Carrot High Background</div>
      <div className="bg-palette-carrot-500">Scale Carrot High Background</div>
      <div className="bg-palette-carrot-600">Scale Carrot High Background</div>
      <div className="bg-palette-carrot-600">Scale Carrot High Background</div>
      <div className="bg-palette-carrot-700">Scale Carrot High Background</div>
      <div className="bg-palette-carrot-700">Scale Carrot High Background</div>
      <div className="bg-palette-carrot-800">Scale Carrot High Background</div>
      <div className="!bg-palette-carrot-800">Scale Carrot High Background</div>
      <div className="bg-palette-static-black">Static Black Background</div>
      <div className="bg-palette-static-white">Static White Background</div>
      <div className="bg-staticGray900">Static Gray900 Background</div>
    </div>
  );
}
```

</td></tr></table>

</details>
