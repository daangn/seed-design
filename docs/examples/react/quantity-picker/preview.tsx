import { QuantityPicker } from "seed-design/ui/quantity-picker";

export default function QuantityPickerPreview() {
  return (
    <QuantityPicker
      min={1}
      max={99}
      defaultValue={1}
      aria-label="상품 수량"
      getValueText={(value) => `${value}개`}
    />
  );
}
