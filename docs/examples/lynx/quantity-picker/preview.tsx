import "./styles";

import { QuantityPicker } from "@/components/ui/quantity-picker";

export default function Example() {
  return <QuantityPicker min={1} max={99} defaultValue={1} accessibility-label="상품 수량" />;
}
