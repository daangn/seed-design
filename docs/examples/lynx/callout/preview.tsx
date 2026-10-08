import "./styles";

import { ActionableCallout, Callout, DismissibleCallout } from "@/components/ui/callout";

export default function Example() {
  return (
    <view className="callout-preview">
      <Callout description="Aute nulla proident tempor minim eiusmod. In nostrud officia irure laborum." />
      <ActionableCallout description="Aute nulla proident tempor minim eiusmod. In nostrud officia irure laborum." />
      <DismissibleCallout description="Aute nulla proident tempor minim eiusmod. In nostrud officia irure laborum." />
    </view>
  );
}
