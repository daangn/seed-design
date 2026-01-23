import { Checkbox, CheckboxGroup } from "seed-design/ui/checkbox";

export default function CheckboxBrand() {
  return (
    <CheckboxGroup aria-label="Brand tone examples">
      <Checkbox
        label="Square (default)"
        variant="square"
        tone="brand"
        size="large"
        defaultChecked
      />
      <Checkbox label="Ghost" variant="ghost" tone="brand" size="large" defaultChecked />
    </CheckboxGroup>
  );
}
