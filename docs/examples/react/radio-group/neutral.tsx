import { RadioGroup, RadioGroupItem } from "seed-design/ui/radio-group";

export default function RadioGroupNeutral() {
  return (
    <RadioGroup defaultValue="apple" aria-label="과일 선택">
      <RadioGroupItem value="apple" label="사과" tone="neutral" size="large" />
      <RadioGroupItem value="banana" label="바나나" tone="neutral" size="large" />
      <RadioGroupItem value="orange" label="오렌지" tone="neutral" size="large" />
    </RadioGroup>
  );
}
