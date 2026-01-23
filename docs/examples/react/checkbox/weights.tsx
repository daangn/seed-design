import { Checkbox, CheckboxGroup } from "seed-design/ui/checkbox";

export default function CheckboxWeights() {
  return (
    <CheckboxGroup aria-label="Weight examples">
      <Checkbox label="Regular Label Text" weight="regular" tone="neutral" size="large" />
      <Checkbox label="Bold Label Text" weight="bold" tone="neutral" size="large" />
    </CheckboxGroup>
  );
}
