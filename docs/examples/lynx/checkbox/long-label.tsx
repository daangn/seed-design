import "./styles";

import { VStack } from "@seed-design/lynx-react";
import { Checkbox, CheckboxGroup } from "@/components/ui/checkbox";

export default function Example() {
  return (
    <VStack className="checkbox-preview">
      <CheckboxGroup>
        <Checkbox
          size="medium"
          tone="neutral"
          label="Consequat ut veniam aliqua deserunt occaecat enim occaecat veniam et et cillum nulla officia incididunt incididunt. Sint laboris labore occaecat fugiat culpa voluptate ullamco in elit dolore exercitation nulla."
        />
        <Checkbox
          size="large"
          tone="neutral"
          label="Consequat ut veniam aliqua deserunt occaecat enim occaecat veniam et et cillum nulla officia incididunt incididunt. Sint laboris labore occaecat fugiat culpa voluptate ullamco in elit dolore exercitation nulla."
        />
      </CheckboxGroup>
    </VStack>
  );
}
