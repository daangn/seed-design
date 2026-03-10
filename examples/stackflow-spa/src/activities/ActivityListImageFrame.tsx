import { IconHouseLine } from "@karrotmarket/react-monochrome-icon";
import { ImageFrame } from "@seed-design/react";
import type { StaticActivityComponentType } from "@stackflow/react/future";
import { useFlow } from "@stackflow/react/future";
import { Fragment } from "react";
import {
  AppBar,
  AppBarBackButton,
  AppBarIconButton,
  AppBarLeft,
  AppBarMain,
  AppBarRight,
} from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { List, ListDivider, ListItem } from "seed-design/ui/list";

type ImageCase = {
  key: string;
  title: string;
  detail: string;
  width: string;
  ratio: number;
  src: string;
  height?: string;
};

const IMAGE_CASES: ImageCase[] = [
  {
    key: "square-frame-wide-image",
    title: "ratio=1, width=96",
    detail: "src 320x180",
    width: "96px",
    ratio: 1,
    src: "https://placehold.co/320x180/ff7a00/ffffff?text=16:9",
  },
  {
    key: "landscape-frame-portrait-image",
    title: "ratio=4/3, width=120",
    detail: "src 180x320",
    width: "120px",
    ratio: 4 / 3,
    src: "https://placehold.co/180x320/4c6fff/ffffff?text=9:16",
  },
  {
    key: "wide-frame-square-image",
    title: "ratio=16/9, width=160",
    detail: "src 240x240",
    width: "160px",
    ratio: 16 / 9,
    src: "https://placehold.co/240x240/00b894/ffffff?text=1:1",
  },
  {
    key: "width-height-match",
    title: "ratio=4/3, width=160, height=120",
    detail: "src 320x180",
    width: "160px",
    height: "120px",
    ratio: 4 / 3,
    src: "https://placehold.co/320x180/ffb300/ffffff?text=16:9",
  },
  {
    key: "width-height-mismatch",
    title: "ratio=1, width=120, height=80",
    detail: "src 320x180",
    width: "120px",
    height: "80px",
    ratio: 1,
    src: "https://placehold.co/320x180/8e44ad/ffffff?text=16:9",
  },
  {
    key: "portrait-frame-portrait-image",
    title: "ratio=3/4, width=120",
    detail: "src 180x320",
    width: "120px",
    ratio: 3 / 4,
    src: "https://placehold.co/180x320/2d3436/ffffff?text=9:16",
  },
];

declare module "@stackflow/config" {
  interface Register {
    ActivityListImageFrame: {};
  }
}

const ActivityListImageFrame: StaticActivityComponentType<"ActivityListImageFrame"> = () => {
  const { push } = useFlow();

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain title="ListImageFrame" />
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
        <List>
          {IMAGE_CASES.map((item, index) => (
            <Fragment key={item.key}>
              <ListItem
                alignItems="center"
                title={item.title}
                detail={item.detail}
                prefix={
                  <ImageFrame
                    src={item.src}
                    alt={item.title}
                    ratio={item.ratio}
                    width={item.width}
                    height={item.height}
                    rounded
                    stroke
                  />
                }
              />
              {index < IMAGE_CASES.length - 1 && <ListDivider />}
            </Fragment>
          ))}
        </List>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityListImageFrame;
