import { root } from "@lynx-js/react";
import { Badge, useSeedClassName, VStack } from "@seed-design/lynx-react";
import "./styles";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="badge-preview">
        <VStack gap="x4">
          <Badge size="medium">
            In velit velit deserunt amet veniam incididunt consectetur incididunt Lorem.
          </Badge>
          <Badge size="large">
            In velit velit deserunt amet veniam incididunt consectetur incididunt Lorem.
          </Badge>
        </VStack>
      </view>
    </page>
  );
}

root.render(<Root />);
