import { root } from "@lynx-js/react";
import { Callout } from "../../../registry/lynx/ui/callout";
import { useSeedClassName, VStack } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <VStack gap="x3" className="p-x4">
        <Callout
          tone="informative"
          title="새로운 기능"
          description="새로운 기능을 확인해 보세요."
        />
      </VStack>
    </page>
  );
}

root.render(<Root />);
