import { root, useState } from "@lynx-js/react";
import { ActionableCallout } from "../../../registry/lynx/ui/callout";
import { useSeedClassName, VStack } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [count, setCount] = useState(0);

  function handleTap() {
    "background only";
    setCount((value) => value + 1);
  }

  return (
    <page className={seedClassName}>
      <VStack gap="x3" className="p-x4">
        <ActionableCallout
          tone="positive"
          title="Actionable Callout"
          description={count === 0 ? "탭해서 동작을 실행해 보세요." : `${count}번 실행했어요.`}
          bindtap={handleTap}
        />
      </VStack>
    </page>
  );
}

root.render(<Root />);
