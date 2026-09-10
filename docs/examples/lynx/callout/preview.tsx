import "./styles";

import { useSeedClassName } from "@seed-design/lynx-react";
import { ActionableCallout, Callout, DismissibleCallout } from "@/components/ui/callout";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-callout-root`}>
      <view className="callout-preview">
        <Callout description="Aute nulla proident tempor minim eiusmod. In nostrud officia irure laborum." />
        <ActionableCallout description="Aute nulla proident tempor minim eiusmod. In nostrud officia irure laborum." />
        <DismissibleCallout description="Aute nulla proident tempor minim eiusmod. In nostrud officia irure laborum." />
      </view>
    </view>
  );
}
