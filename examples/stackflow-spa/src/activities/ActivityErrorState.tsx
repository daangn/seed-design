import type { StaticActivityComponentType } from "@stackflow/react/future";
import { useFlow } from "@stackflow/react/future";

import React from "react";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { ErrorState, type ErrorStateProps } from "seed-design/ui/error-state";
import {
  AppBar,
  AppBarLeft,
  AppBarMain,
  AppBarBackButton,
  AppBarIconButton,
  AppBarRight,
} from "seed-design/ui/app-bar";
import { IconHouseLine } from "@karrotmarket/react-monochrome-icon";

declare module "@stackflow/config" {
  interface Register {
    ActivityErrorState: {};
  }
}

const ActivityErrorState: StaticActivityComponentType<"ActivityErrorState"> = () => {
  const [variant, setVariant] = React.useState<ErrorStateProps["variant"]>("default");
  const [hideAppBarTitle, setHideAppBarTitle] = React.useState(false);
  const { push } = useFlow();

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>Error State</AppBarMain>
        <AppBarRight>
          <AppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent
        ptr
        onPtrRefresh={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }}
      >
        <ErrorState
          variant={variant}
          title={hideAppBarTitle ? undefined : "에러 타이틀"}
          description="에러가 발생했습니다."
          primaryActionProps={{
            children: hideAppBarTitle ? "타이틀 보이기" : "타이틀 숨기기",
            onClick: () => setHideAppBarTitle((prev) => !prev),
          }}
          secondaryActionProps={{
            children: variant === "basement" ? "default로 전환" : "basement로 전환",
            onClick: () => setVariant((prev) => (prev === "default" ? "basement" : "default")),
          }}
        />
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityErrorState;
