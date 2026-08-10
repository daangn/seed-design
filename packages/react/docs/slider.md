file: components/slider.mdx

# Slider

지정된 범위 내에서 하나 또는 두 개의 값을 선택해 입력할 수 있는 컴포넌트입니다.

사용 가능 버전: @seed-design/react@1.1.0, @seed-design/css@1.1.0

## Preview

```tsx
import { Slider } from "seed-design/ui/slider";

export default function SliderPreview() {
  return <Slider min={0} max={100} defaultValues={[50]} getAriaLabel={() => "값"} />;
}
```

## Installation \[#installation]

- npm: npx @seed-design/cli@latest add ui:slider
- pnpm: pnpm dlx @seed-design/cli@latest add ui:slider
- yarn: yarn dlx @seed-design/cli@latest add ui:slider
- bun: bun x @seed-design/cli@latest add ui:slider

<ManualInstallation name="slider" />

## Props \[#props]

- `label`
  - type: `React.ReactNode`
- `labelWeight`
  - type: `"medium" | "bold" | undefined`
  - default: `"medium"`
- `indicator`
  - type: `React.ReactNode`
- `description`
  - type: `React.ReactNode`
- `errorMessage`
  - type: `React.ReactNode`
- `showRequiredIndicator`
  - type: `boolean | undefined`
- `markers`
  - type: `(number | { value: number; label?: React.ReactNode; align?: SliderMarkerVariantProps["align"]; })[] | undefined`
  - default: `[]`
- `ticks`
  - type: `number[] | undefined`
  - default: `[]`
- `tickWeight`
  - type: `"thin" | "thick" | undefined`
  - default: `"thin"`
- `hideRange`
  - type: `boolean | undefined`
  - default: `false`
- `hideValueIndicator`
  - type: `boolean | undefined`
  - default: `false`
- `fieldRef`
  - type: `React.Ref<HTMLDivElement> | undefined`
- `disabled`
  - type: `boolean | undefined`
  - default: `false`
- `readOnly`
  - type: `boolean | undefined`
  - default: `false`
- `invalid`
  - type: `boolean | undefined`
  - default: `false`
- `name`
  - type: `string | undefined`
- `jumpMultiplier`
  - type: `number | undefined`
  - default: `10`
- `getAriaValuetext`
  - type: `((value: number) => string) | undefined`
- `getAriaLabel`
  - type: `((thumbIndex: number) => string) | undefined`
- `getAriaLabelledby`
  - type: `((thumbIndex: number) => string) | undefined`
- `getValueIndicatorLabel`
  - type: `((params: { value: number; thumbIndex: number; }) => React.ReactNode) | undefined`
  - default: `(params) => params.value`
- `valueIndicatorTrigger`
  - type: `"active" | "hover" | "auto" | undefined`
  - default: `"auto"`
- `dragStartDelayInMilliseconds`
  - type: `number | undefined`
  - default: `150`
- `min`
  - type: `number`
  - required: `true`
- `max`
  - type: `number`
  - required: `true`
- `step`
  - type: `number | undefined`
  - default: `1`
- `allowedValues`
  - type: `number[] | undefined`
  - default: `[]`
  - description: Values that the slider thumbs can snap to. If not provided, the slider will snap to every step.
- `minStepsBetweenThumbs`
  - type: `number | undefined`
  - default: `0`
- `values`
  - type: `number[] | undefined`
- `defaultValues`
  - type: `number[] | undefined`
  - default: `[(min + max) / 2]`
- `onValuesChange`
  - type: `((value: number[]) => void) | undefined`
- `onValuesCommit`
  - type: `((value: number[]) => void) | undefined`
- `dir`
  - type: `"ltr" | "rtl" | undefined`
  - default: `"ltr"`
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

## Examples \[#examples]

### Basic \[#basic]

`min`과 `max`를 설정하여 슬라이더의 값 범위를 지정합니다.

```tsx
import { VStack } from "@seed-design/react";
import { Slider } from "seed-design/ui/slider";

export default function SliderBasic() {
  return (
    <VStack gap="spacingY.componentDefault" width="full">
      <Slider min={0} max={10} defaultValues={[5]} getAriaLabel={() => "값"} />
      <Slider min={0} max={1000} defaultValues={[600]} getAriaLabel={() => "값"} />
    </VStack>
  );
}
```

### Steps \[#steps]

특정 간격으로만 값을 선택할 수 있도록 설정할 수 있습니다.

```tsx
import { Slider } from "seed-design/ui/slider";
import { useState } from "react";
import { VStack, Text } from "@seed-design/react";

export default function SliderSteps() {
  const [value, setValue] = useState([50]);

  return (
    <VStack gap="spacingY.componentDefault" width="full" align="center">
      <Slider
        min={0}
        max={100}
        step={10}
        values={value}
        onValuesChange={setValue}
        getAriaLabel={() => "값"}
      />
      <Text>{JSON.stringify(value)}</Text>
    </VStack>
  );
}
```

### Allowed Values \[#allowed-values]

`allowedValues` prop을 사용하여 슬라이더에서 선택할 수 있는 값을 제한할 수 있습니다. `allowedValues`가 지정된 경우 `step`과 `minStepsBetweenThumbs`은 무시됩니다.

```tsx
import { VStack, Text } from "@seed-design/react";
import { Slider } from "seed-design/ui/slider";
import { useState } from "react";

const ALLOWED_VALUES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];

export default function SliderAllowedValues() {
  const [values, setValues] = useState([ALLOWED_VALUES[0], ALLOWED_VALUES[2]]);

  return (
    <VStack gap="spacingY.componentDefault" width="full" align="center">
      <Slider
        min={0}
        max={30}
        values={values}
        onValuesChange={setValues}
        allowedValues={ALLOWED_VALUES}
        markers={ALLOWED_VALUES.map((value) => ({ label: value, value }))}
        getAriaLabel={() => "값"}
      />
      <Text>{JSON.stringify(values)}</Text>
    </VStack>
  );
}
```

### With Ticks \[#with-ticks]

슬라이더 트랙에 눈금을 표시할 수 있습니다.

#### Thin \[#thin]

continuous하다고 느껴질 만큼 step이 충분히 작을 때 주로 사용합니다.

```tsx
import { Slider } from "seed-design/ui/slider";

export default function SliderTicksThin() {
  return (
    <Slider
      min={0}
      max={100}
      step={0.1}
      defaultValues={[50]}
      ticks={[10, 20, 30, 40, 50, 60, 70, 80, 90]}
      tickWeight="thin"
      getAriaLabel={() => "값"}
    />
  );
}
```

#### Thick \[#thick]

discrete하다고 느껴질 만큼 step이 충분히 클 때 또는 tick에만 thumb이 위치할 수 있을 때 주로 사용합니다.

```tsx
import { Slider } from "seed-design/ui/slider";

export default function SliderTicksThick() {
  return (
    <Slider
      min={0}
      max={100}
      step={10}
      defaultValues={[50]}
      ticks={[10, 20, 30, 40, 50, 60, 70, 80, 90]}
      tickWeight="thick"
      getAriaLabel={() => "값"}
    />
  );
}
```

### With Markers \[#with-markers]

슬라이더 아래에 마커를 표시할 수 있습니다.

<Callout type="warning" title="주의">
  스크린 리더는 marker를 읽지 않습니다. 특정 값을 선택했을 때 사용자에게 알려야 하는 경우 [`getAriaValuetext` prop](#getariavaluetext)을 사용하여 현재 선택된 값을 설명하는 문구를 함께 제공하세요.
</Callout>

```tsx
import { VStack } from "@seed-design/react";
import { Slider } from "seed-design/ui/slider";

export default function SliderMarkers() {
  return (
    <VStack gap="spacingY.componentDefault" width="full">
      <Slider
        min={0}
        max={100}
        defaultValues={[50]}
        markers={[
          { value: 0, label: "0°C" },
          { value: 25, label: "25°C" },
          { value: 50, label: "50°C" },
          { value: 75, label: "75°C" },
          { value: 100, label: "100°C" },
        ]}
        getAriaValuetext={(value) => `${value}°C`}
        getValueIndicatorLabel={({ value }) => `${value}°C`}
        getAriaLabel={() => "온도"}
      />
      <Slider
        min={0}
        max={100}
        defaultValues={[30]}
        markers={[0, 20, 40, 60, 80, 100]}
        getAriaLabel={() => "값"}
      />
    </VStack>
  );
}
```

### Controlled \[#controlled]

`values`와 `onValuesChange` props를 사용하여 슬라이더의 상태를 외부에서 제어합니다.

```tsx
import { VStack, HStack, Text } from "@seed-design/react";
import { Slider } from "seed-design/ui/slider";
import { ActionButton } from "seed-design/ui/action-button";
import { useState } from "react";

const DEFAULT_VALUE = [50];

export default function SliderControlled() {
  const [value, setValue] = useState(DEFAULT_VALUE);

  return (
    <VStack gap="spacingY.componentDefault" width="full" align="center">
      <Slider
        min={0}
        max={100}
        values={value}
        onValuesChange={setValue}
        getAriaLabel={() => "값"}
      />
      <Text>{JSON.stringify(value)}</Text>
      <HStack gap="spacingY.componentDefault">
        <ActionButton type="button" onClick={() => setValue([0])} variant="neutralWeak">
          Set Min
        </ActionButton>
        <ActionButton type="button" onClick={() => setValue(DEFAULT_VALUE)} variant="neutralWeak">
          Reset
        </ActionButton>
        <ActionButton type="button" onClick={() => setValue([100])} variant="neutralWeak">
          Set Max
        </ActionButton>
      </HStack>
    </VStack>
  );
}
```

### Listening to Value Changes \[#listening-to-value-changes]

- `onValuesChange`
  - 슬라이더의 값이 변경될 때마다 호출됩니다. 이 prop을 사용하여 슬라이더의 값을 실시간으로 추적할 수 있습니다.
- `onValuesCommit`
  - 슬라이더의 값 변경이 완료되었을 때 호출됩니다. 사용자가 슬라이더 조작을 마치고 손을 뗄 때 값을 확정하는 데 유용합니다.

```tsx
import { VStack, Text, HStack } from "@seed-design/react";
import { Slider } from "seed-design/ui/slider";
import { useState } from "react";

export default function SliderOnValuesCommit() {
  const [value, setValue] = useState([20]);
  const [committedValue, setCommittedValue] = useState([20]);

  return (
    <VStack gap="x4" width="full" align="center">
      <Slider
        min={0}
        max={100}
        values={value}
        onValuesChange={setValue}
        onValuesCommit={setCommittedValue}
        getAriaLabel={() => "값"}
      />
      <HStack gap="x4">
        <Text>Current value: {JSON.stringify(value)}</Text>
        <Text>Committed value: {JSON.stringify(committedValue)}</Text>
      </HStack>
    </VStack>
  );
}
```

### Disabled \[#disabled]

```tsx
import { VStack } from "@seed-design/react";
import { Slider } from "seed-design/ui/slider";

export default function SliderDisabled() {
  return (
    <VStack width="full" gap="spacingY.componentDefault">
      <Slider min={0} max={100} defaultValues={[50]} disabled getAriaLabel={() => "값"} />
      <Slider
        min={0}
        max={100}
        defaultValues={[25, 75]}
        disabled
        getAriaLabel={(thumbIndex) => (thumbIndex === 0 ? "최소값" : "최대값")}
      />
    </VStack>
  );
}
```

### Hide Range \[#hide-range]

`hideRange` prop을 사용하여 기본 range 색상을 숨기고 커스텀 스타일을 적용할 수 있습니다.

```tsx
import { VStack } from "@seed-design/react";
import { Slider } from "seed-design/ui/slider";

export default function SliderHideRange() {
  return (
    <VStack gap="spacingY.componentDefault" width="full">
      <Slider min={0} max={100} defaultValues={[60]} hideRange getAriaLabel={() => "값"} />
      <Slider
        min={0}
        max={100}
        defaultValues={[20, 80]}
        hideRange
        getAriaLabel={(thumbIndex) => (thumbIndex === 0 ? "최소값" : "최대값")}
      />
    </VStack>
  );
}
```

### Customizing Value Indicator \[#customizing-value-indicator]

#### Value Indicator Label \[#value-indicator-label]

`getValueIndicatorLabel` prop을 사용하여 thumb 위에 표시되는 툴팁의 내용을 커스텀할 수 있습니다.

<Callout type="warning" title="주의">
  Value Indicator는 thumb을 누르고 있을 때만 표시되며 스크린 리더는 Value Indicator의 내용을 읽지 않습니다. Value Indicator에 의미가 있는 내용을 포함하는 경우, [`getAriaValuetext` prop](#getariavaluetext)을 함께 사용하는 것을 권장합니다.
</Callout>

```tsx
import { Slider } from "seed-design/ui/slider";

const formatter = new Intl.NumberFormat("ko-KR", { style: "decimal" });

export default function SliderCustomValueIndicatorLabel() {
  return (
    <Slider
      min={0}
      max={1_000_000}
      defaultValues={[20_000, 500_000]}
      getValueIndicatorLabel={({ value, thumbIndex }) => (
        <>
          thumb {thumbIndex}
          <br />
          {formatter.format(value)}
        </>
      )}
      getAriaValuetext={formatter.format}
      getAriaLabel={() => "값"}
    />
  );
}
```

#### Value Indicator Trigger \[#value-indicator-trigger]

`valueIndicatorTrigger` prop으로 value indicator가 표시되는 조건을 설정할 수 있습니다. 기본값은 `"auto"`로, 디바이스 환경에 따라 Value Indicator 표시 조건이 달라집니다.

- **마우스 환경**: thumb hover 시 Value Indicator가 표시됩니다. `valueIndicatorTrigger="hover"`로 설정하면 항상 이렇게 동작합니다.
- **터치 환경**: thumb active 시 Value Indicator가 표시됩니다. `valueIndicatorTrigger="active"`로 설정하면 항상 이렇게 동작합니다.

키보드를 통해 thumb을 포커스하면 `valueIndicatorTrigger` 값에 관계없이 항상 Value Indicator가 표시됩니다.

```tsx
import { VStack } from "@seed-design/react";
import { Slider } from "seed-design/ui/slider";

export default function SliderValueIndicatorTrigger() {
  return (
    <VStack gap="spacingY.componentDefault" width="full">
      <Slider
        label="auto (default)"
        min={0}
        max={100}
        defaultValues={[50]}
        valueIndicatorTrigger="auto"
        getAriaLabel={() => "값"}
      />
      <Slider
        label="hover"
        min={0}
        max={100}
        defaultValues={[50]}
        valueIndicatorTrigger="hover"
        getAriaLabel={() => "값"}
      />
      <Slider
        label="active"
        min={0}
        max={100}
        defaultValues={[50]}
        valueIndicatorTrigger="active"
        getAriaLabel={() => "값"}
      />
    </VStack>
  );
}
```

#### Hide Value Indicator \[#hide-value-indicator]

`hideValueIndicator` prop을 사용하여 thumb 위에 표시되는 Value Indicator 툴팁을 숨길 수 있습니다.

```tsx
import { Slider } from "seed-design/ui/slider";

export default function SliderHideValueIndicator() {
  return (
    <Slider min={0} max={100} defaultValues={[50]} hideValueIndicator getAriaLabel={() => "값"} />
  );
}
```

### Range Slider \[#range-slider]

두 개의 thumb를 사용하여 범위를 선택할 수 있습니다.

```tsx
import { VStack } from "@seed-design/react";
import { Slider } from "seed-design/ui/slider";
import { useState } from "react";

export default function SliderRange() {
  const [priceRange, setPriceRange] = useState([20, 80]);

  return (
    <VStack gap="spacingY.componentDefault" width="full">
      <Slider
        min={0}
        max={100}
        values={priceRange}
        onValuesChange={setPriceRange}
        getAriaLabel={(thumbIndex) => (thumbIndex === 0 ? "최소값" : "최대값")}
      />
    </VStack>
  );
}
```

#### Minimum Steps Between Thumbs \[#minimum-steps-between-thumbs]

두 thumb 사이의 최소 간격을 설정할 수 있습니다.

```tsx
import { VStack, Text } from "@seed-design/react";
import { Slider } from "seed-design/ui/slider";
import { useState } from "react";

export default function SliderRangeMinSteps() {
  const [values, setValues] = useState([20, 80]);

  return (
    <VStack gap="spacingY.componentDefault" width="full" align="center">
      <Slider
        min={0}
        max={100}
        values={values}
        onValuesChange={setValues}
        step={5}
        minStepsBetweenThumbs={6} // step이 5이므로, value의 최소 간격은 30이 됩니다.
        getAriaLabel={(thumbIndex) => (thumbIndex === 0 ? "최소값" : "최대값")}
      />
      <Text>{JSON.stringify(values)}</Text>
    </VStack>
  );
}
```

### Accessibility \[#accessibility]

#### `getAriaValuetext` \[#getariavaluetext]

스크린 리더는 기본적으로 각 thumb이 가리키는 숫자 값(value)을 읽습니다. 숫자 값만으로 정보를 충분히 전달할 수 없는 경우 `getAriaValuetext` prop을 사용하여 인간 친화적인 설명을 제공하세요. 단위를 추가하거나, 값의 의미를 설명하는 문구를 포함할 수 있습니다.

```tsx
import { VStack, Text } from "@seed-design/react";
import { useState } from "react";
import { Slider } from "seed-design/ui/slider";

const days = ["일", "월", "화", "수", "목", "금", "토"];

function getHumanReadableDayOfWeek(value: number) {
  if (days[value] === undefined) throw new Error("Invalid day value");

  return `${days[value]}요일`;
}

export default function SliderGetAriaValuetext() {
  const [values, setValues] = useState([1, 3]);

  return (
    <VStack gap="spacingY.componentDefault" width="full" align="center">
      <Slider
        min={0}
        max={days.length - 1}
        minStepsBetweenThumbs={1}
        markers={days.map((label, value) => ({ label, value }))}
        ticks={days.slice(1, -1).map((_, index) => index + 1)}
        tickWeight="thick"
        values={values}
        onValuesChange={setValues}
        getAriaLabel={(thumbIndex) => (thumbIndex === 0 ? "시작" : "종료")}
        getAriaValuetext={getHumanReadableDayOfWeek}
        getValueIndicatorLabel={({ value }) => getHumanReadableDayOfWeek(value)}
      />
      <Text>values: {JSON.stringify(values)}</Text>
      <Text>aria-valuetext: {JSON.stringify(values.map(getHumanReadableDayOfWeek))}</Text>
    </VStack>
  );
}
```

#### `getAriaLabel` and `getAriaLabelledby` \[#getarialabel-and-getarialabelledby]

`getAriaLabel` 또는 `getAriaLabelledby` prop을 사용하여 각 thumb에 대한 설명을 제공하세요. 스크린 리더 사용자가 각 thumb의 용도를 이해하는 데 도움을 줍니다.

**특히, 범위를 선택하는 슬라이더의 경우 각 thumb이 범위에서 어떤 역할을 하는지 설명해야 합니다. (최소-최대, 시작-종료 등)**

```tsx
import { VStack, Text, type SliderRootProps } from "@seed-design/react";
import { useState } from "react";
import { Slider } from "seed-design/ui/slider";

const getAriaLabel: NonNullable<SliderRootProps["getAriaLabel"]> = (thumbIndex) =>
  thumbIndex === 0 ? "최소값" : "최대값";

export default function SliderGetAriaLabel() {
  const [values, setValues] = useState([10, 30]);

  return (
    <VStack gap="spacingY.componentDefault" width="full" align="center">
      <Slider
        min={0}
        max={100}
        values={values}
        onValuesChange={setValues}
        getAriaLabel={getAriaLabel}
      />
      <Text>values: {JSON.stringify(values)}</Text>
      <Text>aria-label: {JSON.stringify(values.map((_, index) => getAriaLabel(index)))}</Text>
    </VStack>
  );
}
```

### Field Integration \[#field-integration]

`label`, `description`, `errorMessage` 등의 Field 관련 prop을 사용할 수 있습니다.

```tsx
import { Divider, VStack } from "@seed-design/react";
import { Slider } from "seed-design/ui/slider";

const markers = [
  { value: 0, label: "매우 동의하지 않음" },
  { value: 14, label: "매우 동의함" },
];

export default function SliderField() {
  return (
    <VStack gap="x8" width="full">
      <Slider
        label="내일 날씨가 좋을 것 같다고 생각한다."
        min={0}
        max={14}
        defaultValues={[7]}
        ticks={[2, 4, 6, 8, 10, 12]}
        markers={markers}
        hideRange
        description="내일 날씨에 대한 당신의 기대감을 0~14 사이 숫자로 나타내 주세요."
        getAriaValuetext={(value) =>
          `${value} ${markers.find((marker) => marker.value === value)?.label ?? ""}`.trim()
        }
      />
      <Divider />
      <Slider
        label="Invalid Slider"
        labelWeight="bold"
        min={0}
        max={1000}
        defaultValues={[500]}
        invalid
        errorMessage="올바르지 않은 값입니다."
      />
    </VStack>
  );
}
```

### Use Cases \[#use-cases]

#### Form (Uncontrolled) \[#form-uncontrolled]

```tsx
import { HStack, VStack } from "@seed-design/react";
import { useCallback, useState, type FormEvent } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { Slider } from "seed-design/ui/slider";

type FieldErrors = {
  rating?: string;
  priceRange?: string;
};

export default function SliderForm() {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const rating = Number(formData.get("rating"));
    const priceRangeValues = formData.getAll("price-range").map(Number);

    const newFieldErrors: FieldErrors = {};

    if (rating < 3) {
      newFieldErrors.rating = "평점은 최소 3점 이상이어야 합니다";
    }

    const [min, max] = priceRangeValues;

    if (max - min < 20) {
      newFieldErrors["priceRange"] = "가격 범위는 최소 20만원 이상 차이가 나야 합니다";
    }

    setFieldErrors(newFieldErrors);

    if (Object.keys(newFieldErrors).length > 0) return;

    window.alert(JSON.stringify({ rating, "price-range": priceRangeValues }, null, 2));
  }, []);

  return (
    <VStack asChild gap="x3" width="full">
      <form onSubmit={handleSubmit}>
        <HStack gap="x3">
          <Slider
            label="최소 평점"
            description="원하는 최소 평점을 선택하세요"
            name="rating"
            min={0}
            max={5}
            step={0.5}
            defaultValues={[2.5]}
            markers={[
              { value: 0, label: "0점" },
              { value: 5, label: "5점" },
            ]}
            getValueIndicatorLabel={({ value }) => `${value}점`}
            getAriaValuetext={(value) => `${value}점`}
            showRequiredIndicator
            {...(fieldErrors.rating && {
              invalid: true,
              errorMessage: fieldErrors.rating,
            })}
          />
          <Slider
            label="가격 범위"
            description="원하는 가격 범위를 선택하세요"
            name="price-range"
            min={0}
            max={100}
            defaultValues={[20, 80]}
            markers={[
              { value: 0, label: "0만원" },
              { value: 100, label: "100만원" },
            ]}
            getValueIndicatorLabel={({ value }) => `${value}만원`}
            getAriaValuetext={(value) => `${value}만원`}
            getAriaLabel={(index) => (index === 0 ? "최소 가격" : "최대 가격")}
            showRequiredIndicator
            {...(fieldErrors["priceRange"] && {
              invalid: true,
              errorMessage: fieldErrors["priceRange"],
            })}
          />
        </HStack>
        <ActionButton type="submit" variant="neutralSolid">
          제출
        </ActionButton>
      </form>
    </VStack>
  );
}
```

#### React Hook Form \[#react-hook-form]

```tsx
import { HStack, VStack } from "@seed-design/react";
import { useCallback, type FormEvent } from "react";
import { useController, useForm } from "react-hook-form";
import { ActionButton } from "seed-design/ui/action-button";
import { Slider } from "seed-design/ui/slider";

interface FormValues {
  rating: number;
  priceRange: [number, number];
}

export default function SliderReactHookForm() {
  const { handleSubmit, reset, control } = useForm<FormValues>({
    reValidateMode: "onSubmit",
    defaultValues: {
      rating: 2.5,
      priceRange: [20, 80],
    },
  });

  const {
    field: { value: ratingValue, onChange: ratingOnChange, onBlur: __ratingOnBlur, ...ratingField },
    fieldState: ratingFieldState,
  } = useController({
    name: "rating",
    control,
    rules: {
      validate: (value) => value >= 3 || "평점은 최소 3점 이상이어야 합니다",
    },
  });

  const {
    field: {
      value: priceRangeValue,
      onChange: priceRangeOnChange,
      onBlur: __priceRangeOnBlur,
      ...priceRangeField
    },
    fieldState: priceRangeFieldState,
  } = useController({
    name: "priceRange",
    control,
    rules: {
      validate: (value) => {
        const [min, max] = value;

        return max - min >= 20 || "가격 범위는 최소 20만원 이상 차이가 나야 합니다";
      },
    },
  });

  const onValid = useCallback(
    (data: FormValues) => window.alert(JSON.stringify(data, null, 2)),
    [],
  );

  const onReset = useCallback(
    (event: FormEvent) => {
      event.preventDefault();

      reset();
    },
    [reset],
  );

  return (
    <VStack gap="x3" width="full" as="form" onSubmit={handleSubmit(onValid)} onReset={onReset}>
      <HStack gap="x3">
        <Slider
          label="최소 평점"
          description="원하는 최소 평점을 선택하세요"
          min={0}
          max={5}
          step={0.5}
          invalid={ratingFieldState.invalid}
          errorMessage={ratingFieldState.error?.message}
          values={[ratingValue]}
          onValuesChange={([values]) => ratingOnChange(values)}
          markers={[
            { value: 0, label: "0점" },
            { value: 5, label: "5점" },
          ]}
          getValueIndicatorLabel={({ value }) => `${value}점`}
          getAriaValuetext={(value) => `${value}점`}
          showRequiredIndicator
          {...ratingField}
        />
        <Slider
          label="가격 범위"
          description="원하는 가격 범위를 선택하세요"
          min={0}
          max={100}
          markers={[
            { value: 0, label: "0만원" },
            { value: 100, label: "100만원" },
          ]}
          invalid={priceRangeFieldState.invalid}
          errorMessage={priceRangeFieldState.error?.message}
          values={priceRangeValue}
          onValuesChange={priceRangeOnChange}
          getValueIndicatorLabel={({ value }) => `${value}만원`}
          getAriaValuetext={(value) => `${value}만원`}
          getAriaLabel={(index) => (index === 0 ? "최소 가격" : "최대 가격")}
          minStepsBetweenThumbs={2}
          showRequiredIndicator
          {...priceRangeField}
        />
      </HStack>
      <HStack gap="x2">
        <ActionButton type="reset" variant="neutralWeak">
          초기화
        </ActionButton>
        <ActionButton type="submit" variant="neutralSolid" flexGrow={1}>
          제출
        </ActionButton>
      </HStack>
    </VStack>
  );
}
```

### RTL Support \[#rtl-support]

```tsx
import { VStack } from "@seed-design/react";
import { Slider } from "seed-design/ui/slider";

export default function SliderRtl() {
  return (
    <VStack gap="spacingY.componentDefault" width="full">
      <Slider
        dir="rtl"
        min={0}
        max={100}
        step={0.5}
        defaultValues={[36.5]}
        ticks={[36.5]}
        tickWeight="thick"
        markers={[
          { value: 0, label: "0°C" },
          { value: 36.5, label: "36.5°C" },
          { value: 100, label: "100°C" },
        ]}
        getAriaValuetext={(value) => `${value}°C`}
        getValueIndicatorLabel={({ value }) => `${value}°C`}
        getAriaLabel={() => "온도"}
      />
      <Slider
        dir="rtl"
        min={0}
        max={100}
        defaultValues={[30, 50]}
        ticks={[20, 40, 60, 80]}
        markers={[0, 20, 40, 60, 80, 100]}
        getAriaLabel={() => "값"}
      />
    </VStack>
  );
}
```