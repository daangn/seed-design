import { root, useState } from "@lynx-js/react";
import { DismissibleCallout } from "../../../registry/lynx/ui/callout";
import { useSeedClassName, VStack } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [dismissed, setDismissed] = useState(false);

  return (
    <page className={seedClassName}>
      <VStack gap="x3" className="p-x4">
        <text>{dismissed ? "닫힘" : "닫기 버튼을 눌러 보세요."}</text>
        {!dismissed ? (
          <DismissibleCallout
            tone="warning"
            title="Dismissible Callout"
            description="닫기 버튼으로 메시지를 숨길 수 있어요."
            onDismiss={() => setDismissed(true)}
          />
        ) : null}
      </VStack>
    </page>
  );
}

root.render(<Root />);
