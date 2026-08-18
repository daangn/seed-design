import { root } from "@lynx-js/react";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";
import { AppBar, AppBarMain } from "@/components/ui/app-bar";
import "./styles";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <page className={seedClassName}>
      <VStack className="app-bar-preview">
        <AppBar theme="cupertino">
          <AppBarMain title="Cupertino" />
        </AppBar>
        <AppBar theme="android">
          <AppBarMain title="Android" />
        </AppBar>
        <view className="app-bar-preview__content">
          <text>플랫폼별 레이아웃 비교</text>
        </view>
      </VStack>
    </page>
  );
}
root.render(<Root />);
