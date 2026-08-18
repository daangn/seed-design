import { root } from "@lynx-js/react";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";
import { AppBar, AppBarMain } from "@/components/ui/app-bar";
import "./styles";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <page className={seedClassName}>
      <VStack className="app-bar-preview">
        <AppBar>
          <AppBarMain title="관심 목록" subtitle="3개의 새 소식" />
        </AppBar>
        <view className="app-bar-preview__content">
          <text>화면 콘텐츠</text>
        </view>
      </VStack>
    </page>
  );
}
root.render(<Root />);
