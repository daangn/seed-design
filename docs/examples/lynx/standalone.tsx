import "@seed-design/lynx-css/base.css";
import "./standalone.css";

import { root, type ComponentType } from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";
import type { LynxExampleLayout } from "../../playground/lynx/layout";

interface StandaloneRootProps {
  Example: ComponentType;
  layout: LynxExampleLayout;
}

function StandaloneRoot({ Example, layout }: StandaloneRootProps) {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={`${seedClassName} docs-lynx-standalone-root`}>
      <view className={`docs-lynx-stage docs-lynx-stage--${layout}`}>
        <Example />
      </view>
    </page>
  );
}

export function renderLynxExample(Example: ComponentType, layout: LynxExampleLayout): void {
  root.render(<StandaloneRoot Example={Example} layout={layout} />);
}
