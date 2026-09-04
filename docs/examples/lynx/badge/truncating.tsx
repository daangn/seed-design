import { root } from "@lynx-js/react";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";
import { Badge } from "@/components/ui/badge";
import "./styles";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="badge-preview">
        <VStack gap="x4">
          <Badge style={{ maxWidth: "120px" }}>
            In velit velit deserunt amet veniam incididunt consectetur incididunt Lorem.
          </Badge>
          <Badge style={{ maxWidth: "200px" }}>
            In velit velit deserunt amet veniam incididunt consectetur incididunt Lorem.
          </Badge>
        </VStack>
      </view>
    </page>
  );
}

root.render(<Root />);
