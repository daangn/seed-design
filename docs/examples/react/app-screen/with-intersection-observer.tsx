import { IconBellFill } from "@karrotmarket/react-monochrome-icon";
import { Flex } from "@seed-design/react";
import type { ActivityComponentType } from "@stackflow/react/future";
import { useEffect, useRef, useState } from "react";
import {
  AppBar,
  AppBarCloseButton,
  AppBarIconButton,
  AppBarLeft,
  AppBarMain,
  AppBarProps,
  AppBarRight,
} from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";

declare module "@stackflow/config" {
  interface Register {
    "react/app-screen/with-intersection-observer": unknown;
  }
}

const AppScreenWithIntersectionObserverActivity: ActivityComponentType<
  "react/app-screen/with-intersection-observer"
> = () => {
  const [tone, setTone] = useState<AppBarProps["tone"]>("transparent");
  const whiteImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (!entry.isIntersecting) {
          // 이미지 영역을 벗어나면 tone을 layer로 변경
          setTone("layer");
        } else {
          // 이미지 영역을 포함하면 tone을 transparent로 변경
          setTone("transparent");
        }
      },
      {
        threshold: [0, 0.1, 0.5, 1],
        rootMargin: "0px",
      },
    );

    if (whiteImageRef.current) {
      observer.observe(whiteImageRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <AppScreen theme="cupertino" layerOffsetTop="none" tone={tone}>
      <AppBar>
        <AppBarLeft>
          <AppBarCloseButton aria-label="Close" />
        </AppBarLeft>
        <AppBarMain>Preview</AppBarMain>
        <AppBarRight>
          <AppBarIconButton aria-label="Notification">
            <IconBellFill />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
        <Flex
          ref={whiteImageRef}
          justifyContent="center"
          alignItems="center"
          bg="palette.staticWhite"
          height="400px"
          width="full"
        >
          하얀 이미지
        </Flex>
        <Flex
          height="1000px"
          justify="center"
          align="center"
          bg="palette.gray800"
          color="fg.neutralInverted"
        >
          컨텐츠 영역
        </Flex>
      </AppScreenContent>
    </AppScreen>
  );
};

export default AppScreenWithIntersectionObserverActivity;
