import { root } from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";
import { Badge } from "@/components/ui/badge";
import "./styles";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="badge-preview">
        <Badge style={{ maxWidth: "120px" }}>
          In velit velit deserunt amet veniam incididunt consectetur incididunt Lorem.
        </Badge>
      </view>
    </page>
  );
}

root.render(<Root />);
