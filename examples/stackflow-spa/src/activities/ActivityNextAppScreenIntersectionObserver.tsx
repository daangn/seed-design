import { IconBellFill } from "@karrotmarket/react-monochrome-icon";
import { Flex } from "@seed-design/react";
import type { StaticActivityComponentType } from "@stackflow/react/future";
import { useEffect, useRef, useState } from "react";
import {
  NextAppBar,
  NextAppBarCloseButton,
  NextAppBarIconButton,
  NextAppBarLeft,
  NextAppBarMain,
  NextAppBarRight,
} from "seed-design/ui/next-app-bar";
import {
  NextAppScreen,
  NextAppScreenContent,
  type NextAppScreenProps,
} from "seed-design/ui/next-app-screen";

declare module "@stackflow/config" {
  interface Register {
    ActivityNextAppScreenIntersectionObserver: {};
  }
}

const ActivityNextAppScreenIntersectionObserver: StaticActivityComponentType<
  "ActivityNextAppScreenIntersectionObserver"
> = () => {
  const [tone, setTone] = useState<NextAppScreenProps["tone"]>("transparent");
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
    <NextAppScreen theme="cupertino" contentOffsetTop="none" tone={tone}>
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarCloseButton aria-label="Close" />
        </NextAppBarLeft>
        <NextAppBarMain>Next Preview</NextAppBarMain>
        <NextAppBarRight>
          <NextAppBarIconButton aria-label="Notification">
            <IconBellFill />
          </NextAppBarIconButton>
        </NextAppBarRight>
      </NextAppBar>
      <NextAppScreenContent>
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
      </NextAppScreenContent>
    </NextAppScreen>
  );
};

export default ActivityNextAppScreenIntersectionObserver;
