# Rootage

Rootage는 디자인 토큰과 컴포넌트 디자인을 구조화된 방식으로 정의하고, 다양한 환경에서 일관된 디자인 구현을 돕기 위해 작성되었습니다.

## **리소스 종류**

Rootage에는 세 가지 주요 리소스 종류가 있습니다:

1. **Tokens**
2. **TokenCollections**
3. **ComponentSpec**

각 리소스는 다음과 같은 공통 구조를 가집니다:

- `kind`: 리소스의 종류를 나타내는 문자열입니다.
- `metadata`: 리소스에 대한 메타데이터로, `id`와 `name`을 포함합니다.
- `data`: 리소스 종류에 따라 구조화된 데이터입니다.

### **TokenCollections**

TokenCollections 리소스는 토큰이 의존하는 맥락과 맥락에 포함되는 모드를 정의합니다.

### **구조**

```yaml
kind: TokenCollections
metadata:
  id: <컬렉션 배열 식별자>
  name: <컬렉션 배열 이름>
data:
  - name: <컬렉션 이름>
    modes:
      - <모드 1>
      - <모드 2>
      # 추가 모드...
```

- `kind`: `"TokenCollections"`로 고정됩니다.
- `metadata`: 리소스의 `id`와 `name`을 포함합니다. 이 정보는 api url 등에 활용될 수 있습니다.
- `data`: 각 컬렉션 선언의 배열이며, 각 선언은 `name`과 `modes`를 포함합니다.
  - `name`: 컬렉션의 이름.
  - `modes`: 지원되는 모드의 배열.

### **예제**

```yaml
---
kind: TokenCollections
metadata:
  id: collections
  name: Collections
data:
  - name: global
    modes:
      - default
  - name: color
    modes:
      - theme-light
      - theme-dark
```

이 예제에서는 두 가지 컬렉션을 정의합니다:

- `global`: 맥락에 의존하지 않는 토큰은 global 컬렉션을 사용하고, `default` 모드에만 값을 선언할 것입니다.
- `color`: 라이트, 다크 테마 맥락에 의존하는 토큰은 color 컬렉션을 사용하고, `theme-light`와 `theme-dark` 두 가지 모드 각각에 대한 값을 선언할 것입니다.

### **Tokens**

Tokens 리소스는 디자인 토큰 집합을 정의하는 데 사용됩니다. 각 토큰은 디자인 토큰 이름과 바인딩된 값의 선언을 포함합니다.

### **구조**

```yaml
kind: Tokens
metadata:
  id: <토큰 배열 식별자>
  name: <토큰 배열 이름>
data:
  collection: <컬렉션 이름>
  tokens:
    <토큰 이름>:
      values:
        <모드>: <값>
```

- `kind`: `"Tokens"`로 고정됩니다.
- `metadata`: 리소스의 `id`와 `name`을 포함합니다. 이 정보는 api url 등에 활용될 수 있습니다.
- `data.collection`: 토큰들이 속한 컬렉션의 이름입니다.
- `data.tokens`: 토큰 이름과 그 값의 매핑들을 나열합니다.
  - `<토큰 이름>`: 토큰 이름 규칙을 따르는 이름을 선언합니다.
  - `<모드>`: 어떤 모드에 대한 값인지 정의합니다. 컬렉션에 명시된 모든 모드에 대해 작성되어야 합니다.
  - `<값>`: 디자인 값을 작성하거나 다른 토큰을 참조할 수 있습니다.

**토큰 이름 규칙**

- 시작 문자: 모든 토큰 이름은 `$`로 시작해야 합니다.
- 그룹 구분자: `.` 문자는 그룹을 나타내는 데 사용됩니다. 예를 들어, `$color.bg.brand`는 `color/bg/brand`와 같은 구조로 해석됩니다.

### **예제**

```yaml
---
kind: Tokens
metadata:
  id: color
  name: Color
data:
  collection: color
  tokens:
    $color.palette.gray-00:
      values:
        theme-light: "#ffffff"
        theme-dark: "#121212"
    $color.palette.gray-100:
      values:
        theme-light: "#f7f8f9"
        theme-dark: "#1a1c20"
    $color.palette.gray-200:
      values:
        theme-light: "#f3f4f5"
        theme-dark: "#25272c"
    $color.bg.layer-default:
      values:
        theme-light: "$color.palette.gray-00"
        theme-dark: "$color.palette.gray-00"
    $color.bg.neutral-weak:
      values:
        theme-light: "$color.palette.gray-200"
        theme-dark: "$color.palette.gray-300"
```

이 예제에서는 `color` 컬렉션 내에서 색상을 토큰으로 정의합니다.

### **ComponentSpec**

ComponentSpec 리소스는 컴포넌트의 디자인 스펙을 정의합니다.

### **구조**

```yaml
kind: ComponentSpec
metadata:
  id: <컴포넌트 식별자>
  name: <컴포넌트 이름>
data:
  base:
    <상태 이름>:
      <슬롯 이름>:
        <속성>: <값>
  <Variant 키>=<Variant 이름>:
    <상태 이름>:
      <슬롯 이름>:
        <속성>: <값>
  <Variant 키>=<Variant 이름>,<Variant 키>=<Variant 이름>:
    <상태 이름>,<상태 이름>:
      <슬롯 이름>:
        <속성>: <값>
```

- `kind`: `"ComponentSpec"`로 고정됩니다.
- `metadata`: 리소스의 `id`와 `name`을 포함합니다. 이 정보는 api url 등에 활용될 수 있습니다.
- `data`: 컴포넌트의 디자인 사양을 정의하는 객체입니다.
  - `base`: 모든 Variant에 적용되는 기본 디자인을 정의합니다.
  - `<Variant 키>=<Variant 이름>`: Variant를 정의하는 문자열입니다(예: `size=small`).
  - `<상태 이름>`: 상호 작용 상태(예: `enabled`, `hover`, `pressed`).
  - `<슬롯 이름>`: 디자인 속성을 적용할 요소나 슬롯(예: `root`, `icon`).
  - `<속성>`: 디자인 속성(예: `color`, `size`, `borderRadius`).
  - `<값>`: 속성에 대한 값으로, 디자인 값을 작성하거나 다른 토큰을 참조할 수 있습니다.

**Variant 표현**

- Variant는 `<키>=<값>` 형태로 표현되며, 여러 Variant의 조합을 선언할 수도 있습니다.
- 여러 Variant를 조합할 때는 쉼표로 구분합니다. 예: `size=medium,shape=circle`
- Variant 표현은 Array<{ key, value }>의 직렬화입니다.

**상태 표현**

- 상태는 단일 상태(예: enabled)로 표현될 수 있으며, 여러 상태의 조합(예: enabled,selected)으로도 표현될 수 있습니다.
- 여러 상태의 조합을 나타낼 때는 쉼표로 구분합니다.
- 상태 표현은 Array<string>의 직렬화입니다.

**상태 우선순위**

- 여러 상태가 동시에 유효한 경우, 아래에 선언된 상태가 높은 우선순위를 가집니다.

### **예제**

```yaml
---
kind: ComponentSpec
metadata:
  id: fab
  name: Fab
data:
  base:
    enabled:
      root:
        color: $color.bg.layer-floating
        borderRadius: $radius.full
      icon:
        color: $color.fg.neutral
    pressed:
      root:
        color: $color.bg.layer-floating-pressed
  size=small:
    enabled:
      root:
        size: $dimension.x10
      icon:
        size: $dimension.x5
  size=medium:
    enabled:
      root:
        size: $dimension.x12
      icon:
        size: $dimension.x6
```

이 예제에서는 Floating Action Button (`Fab`) 컴포넌트의 디자인 사양을 정의합니다.

- `base` 디자인은 모든 Variant에 적용되는 속성을 정의합니다.
  - `enabled` 상태에서:
    - `root` 슬롯은 layer-floating 배경 색상과 full radius를 가집니다.
    - `icon` 슬롯은 neutral 전경 색상을 가집니다.
  - `pressed` 상태에서:
    - `root` 슬롯은 눌린 상태의 배경 색상으로 변경됩니다.
- Variant는 `size` 키를 기반으로 `small`과 `medium`을 각각 정의합니다:
  - 각 Variant는 `enabled` 상태의 속성을 재정의합니다.
  - `root`와 `icon` 슬롯은 Variant에 따라 특정 크기를 가집니다.

### **상태 표현 및 우선순위 예시**

```yaml
---
kind: ComponentSpec
metadata:
  id: toggle-button
  name: Toggle Button
data:
  base:
    enabled:
      root:
        color: $color.bg.neutral-weak
        borderRadius: $radius.medium
      label:
        color: $color.fg.neutral
    pressed:
      root:
        color: $color.bg.neutral-weak-pressed
    enabled,selected:
      root:
        color: $color.bg.neutral-solid
    pressed,selected:
      root:
        color: $color.bg.neutral-solid-pressed
    disabled:
      root:
        color: $color.bg.disabled
      label:
        color: $color.fg.disabled
```

- 컴포넌트가 `enabled` 상태인 경우:
  - `enabled` 스타일이 적용됩니다.
- 컴포넌트가 `enabled`이면서 `pressed` 상태인 경우:
  - `enabled,pressed` 스타일이 적용됩니다.
- 컴포넌트가 `enabled`, `pressed`, `selected` 상태인 경우:
  - 아래에 선언된 `pressed,selected` 스타일이 `enabled,selected`보다 우선하여 적용됩니다.
- 컴포넌트가 `disabled` 상태인 경우:
  - 모든 `enabled` 관련 스타일보다 `disabled` 스타일이 우선하여 적용됩니다.

## **허용되는 값**

`<값>` 에는 아래와 같은 유형이 대입될 수 있습니다.

- **Color**
  - 16진수 색상 코드:
    - `#rrggbb` (24비트 RGB)
    - `#rrggbbaa` (24비트 RGB + 8비트 알파)
- **Dimension**
  - https://tr.designtokens.org/format/#dimension
  - px: `${number}px` (예: `16px`)
    - Android에서 대응되는 단위는 dp, iOS에서는 pt입니다.
  - rem: `${number}rem` (예: `1rem`)
    - 사용자가 설정한 시스템 기본 폰트 크기의 배수를 나타냅니다. Android에서 1rem에 해당하는 값은 16sp입니다.
- **Duration**
  - 밀리초: `${number}ms` (예: `200ms`)
  - 초: `${number}s` (예: `0.5s`)
- **Number**
  - 단위 없는 숫자 (예: `0.5`, `1`, `100`)
- **Cubic-bezier**
  - `{ type: "cubicBezier", value: [p1x, p1y, p2x, p2y] }` 형태로 `type`을 명시해야 합니다.
- **Shadow**
  - `{ type: "shadow", value: [{ color, offsetX, offsetY, blur, spread }] }` 형태로 `type`을 명시해야 합니다.
- **Gradient**
  - `{ type: "gradient", value: [{ color, position }] }` 형태로 `type` 을 명시해야 합니다.
  - position은 [0, 1] 범위의 실수입니다.
- **Reference**
  - `$`로 시작하는 토큰 이름, 예: `$token-name`

### **값 작성 방법**

- **Shorthand 값**은 문자열로 작성할 수 있습니다. 예를 들어, `#FFFFFF`, `16px`, `1rem`, `200ms` 등은 그대로 사용할 수 있습니다.
- **Cubic-bezier**와 **Shadow** 타입은 반드시 `type`을 명시하고, 해당 구조에 맞게 값을 작성해야 합니다.

### **Cubic-bezier 예제**

```yaml
$animation.ease-in-out:
  values:
    default:
      type: cubicBezier
      value: [0.42, 0, 0.58, 1]
```

### **Shadow 예제**

```yaml
$shadow.default:
  values:
    default:
      type: shadow
      value:
        - color: "#000000"
          offsetX: 0px
          offsetY: 2px
          blur: 4px
          spread: 0px
```
