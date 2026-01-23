---
"@seed-design/react-radio-group": minor
"@seed-design/rootage-artifacts": patch
"@seed-design/react": minor
"@seed-design/css": minor
---

[Checkbox](/react/components/checkbox) 관련 컴포넌트를 추가합니다.

- **1.1 → 1.2 업그레이드 시 snippet 업데이트 권장**: `CheckboxGroup` snippet 컴포넌트가 추가되었습니다. 사용하려면 snippet을 다시 내려받아 주세요.
  - `npx @seed-design/cli@latest add ui:checkbox`
  - `CheckboxGroup`은 자체적으로 gap과 100% width를 갖습니다. `VStack`을 사용하여 `Checkbox`를 묶지 않아도 됩니다.
    - 기존 `Checkbox`를 `CheckboxGroup`으로 감쌀 필요는 없습니다. `CheckboxGroup`은 선택적으로 사용할 수 있습니다.
  - `label`, `description`, `errorMessage`, `indicator`, `showRequiredIndicator`, `labelWeight` prop을 사용할 수 있습니다.

[Radio Group](/react/components/radio-group) 관련 컴포넌트를 업데이트합니다.

- **1.1 → 1.2 업그레이드 시 snippet 업데이트 필요**: `RadioGroup` snippet의 내부 구조가 변경되었습니다. snippet을 다시 내려받아 주세요.
  - `npx @seed-design/cli@latest add ui:radio-group`
  - `RadioGroup`이 자체적으로 gap과 100% width를 갖습니다. `VStack`을 사용하여 `RadioGroupItem`을 묶는 코드를 제거합니다.
    - **1.1 → 1.2 업그레이드 시 변경 필요**: `RadioGroupItem`을 묶어서 사용하던 `VStack`을 제거하여 `RadioGroupItem`이 `RadioGroup`의 direct child가 되도록 변경하세요.
  - `label`, `description`, `errorMessage`, `indicator`, `showRequiredIndicator`, `labelWeight` prop을 사용할 수 있습니다.

  ```tsx
  // 전
  import { VStack } from "@seed-design/react";
  import { RadioGroup, RadioGroupItem } from "seed-design/ui/radio-group";

  <RadioGroup defaultValue="apple" aria-label="Fruit selection">
    <VStack>
      <RadioGroupItem value="apple" label="Apple" />
      <RadioGroupItem value="banana" label="Banana" />
    </VStack>
  </RadioGroup>;
  ```

  ```tsx
  // 후
  import { RadioGroup, RadioGroupItem } from "seed-design/ui/radio-group";

  {
    /* aria-label 대신 label을 사용하여 시각적으로 레이블을 표시할 수도 있습니다. */
  }
  <RadioGroup defaultValue="apple" aria-label="Fruit selection">
    <RadioGroupItem value="apple" label="Apple" />
    <RadioGroupItem value="banana" label="Banana" />
  </RadioGroup>;
  ```

- **1.1 → 1.2 업그레이드 시 확인 필요**
  - `@seed-design/react`의 `RadioGroup.Root`를 레이아웃 컴포넌트로 변경합니다.
    - `@seed-design/react`에서 직접 import해서 사용하는 코드가 있다면 `RadioGroup.Root`를 `@seed-design/react/primitive`의 `RadioGroup.Root`로 변경해주세요.

  ```tsx
  // 전
  import { RadioGroup } from "@seed-design/react";
  import { ListRadioItem } from "seed-design/ui/list";

  <RadioGroup.Root
    value={value}
    onValueChange={onValueChange}
    aria-label="옵션 선택"
  >
    <ListRadioItem
      value="option1"
      title="옵션 1"
      detail="첫 번째 선택지"
      suffix={<Radiomark tone="neutral" size="large" />}
    />
  </RadioGroup.Root>;
  ```

  ```tsx
  // 후
  import { RadioGroup } from "@seed-design/react/primitive";
  import { ListRadioItem } from "seed-design/ui/list";

  <RadioGroup.Root
    value={value}
    onValueChange={onValueChange}
    aria-label="옵션 선택"
  >
    <ListRadioItem
      value="option1"
      title="옵션 1"
      detail="첫 번째 선택지"
      suffix={<Radiomark tone="neutral" size="large" />}
    />
  </RadioGroup.Root>;
  ```

RadioGroupItem, RadioChipItem, RadioSelectBoxItem, ListRadioItem에서 `invalid` prop이 제거되었습니다.

- **1.1 → 1.2 업그레이드 시 변경 필요**: `invalid` 상태는 group/field 레벨에서 설정해주세요. 각 항목을 `data-invalid` 속성으로 스타일링하는 경우 확인이 필요합니다.
