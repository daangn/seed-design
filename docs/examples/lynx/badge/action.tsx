import { root } from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";
import { Badge } from "@/components/ui/badge";
import "./styles";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="badge-preview">
        <Badge
          action={{
            "accessibility-label": "도움말",
            bindtap: () => console.log("도움말 열기"),
          }}
        >
          판매 완료
        </Badge>
      </view>
    </page>
  );
}

root.render(<Root />);
