import "./styles";

import { root } from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";
import { ActionableCallout, Callout, DismissibleCallout } from "@/components/ui/callout";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="callout-preview">
        <Callout description="Aute nulla proident tempor minim eiusmod. In nostrud officia irure laborum." />
        <ActionableCallout description="Aute nulla proident tempor minim eiusmod. In nostrud officia irure laborum." />
        <DismissibleCallout description="Aute nulla proident tempor minim eiusmod. In nostrud officia irure laborum." />
      </view>
    </page>
  );
}

root.render(<Root />);
