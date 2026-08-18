import { root } from "@lynx-js/react";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";
import {
  AppBar,
  AppBarBackButton,
  AppBarLeft,
  AppBarMain,
  AppBarRight,
} from "@/components/ui/app-bar";
import "./styles";

function goBack() {
  "background only";
}
function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <page className={seedClassName}>
      <VStack className="app-bar-preview">
        <AppBar>
          <AppBarLeft>
            <AppBarBackButton bindtap={goBack} />
          </AppBarLeft>
          <AppBarMain title="동네생활" />
          <AppBarRight />
        </AppBar>
        <view className="app-bar-preview__content">
          <text>화면 콘텐츠</text>
        </view>
      </VStack>
    </page>
  );
}
root.render(<Root />);
