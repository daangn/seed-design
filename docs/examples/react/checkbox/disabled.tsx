import { Checkbox, CheckboxGroup } from "seed-design/ui/checkbox";

export default function CheckboxDisabled() {
  return (
    <CheckboxGroup aria-label="Disabled examples">
      <Checkbox
        defaultChecked
        label="Disabled Checked, Square"
        disabled
        tone="neutral"
        size="large"
      />
      <Checkbox
        checked={false}
        label="Disabled without Checked, Square"
        disabled
        tone="neutral"
        size="large"
      />
      <Checkbox
        variant="ghost"
        defaultChecked
        label="Disabled Checked, Ghost"
        disabled
        tone="neutral"
        size="large"
      />
      <Checkbox
        variant="ghost"
        checked={false}
        label="Disabled without Checked, Ghost"
        disabled
        tone="neutral"
        size="large"
      />
    </CheckboxGroup>
  );
}
