import { Checkbox, CheckboxGroup } from "seed-design/ui/checkbox";

export default function CheckboxLongLabel() {
  return (
    <CheckboxGroup aria-label="Long label examples">
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
  );
}
