import { VStack } from "@seed-design/react";
import { Checkbox } from "seed-design/ui/checkbox";

export default function CheckboxLongLabel() {
  return (
    <VStack gap="x2">
      <Checkbox
        size="medium"
        label="Consequat ut veniam aliqua deserunt occaecat enim occaecat veniam et et cillum nulla officia incididunt incididunt. Sint laboris labore occaecat fugiat culpa voluptate ullamco in elit dolore exercitation nulla."
      />
      <Checkbox
        size="large"
        label="Consequat ut veniam aliqua deserunt occaecat enim occaecat veniam et et cillum nulla officia incididunt incididunt. Sint laboris labore occaecat fugiat culpa voluptate ullamco in elit dolore exercitation nulla."
      />
    </VStack>
  );
}
