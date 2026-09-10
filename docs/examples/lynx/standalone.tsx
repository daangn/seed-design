import "@seed-design/lynx-css/base.css";
import "./standalone.css";

import { root, type ComponentType } from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";

interface StandaloneRootProps {
  Example: ComponentType;
}

function StandaloneRoot({ Example }: StandaloneRootProps) {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={`${seedClassName} docs-lynx-standalone-root`}>
      <Example />
    </page>
  );
}

export function renderLynxExample(Example: ComponentType): void {
  root.render(<StandaloneRoot Example={Example} />);
}
