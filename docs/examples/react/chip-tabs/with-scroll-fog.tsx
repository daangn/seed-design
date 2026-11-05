import { ScrollFog } from "@seed-design/react";
import {
  ChipTabsContent,
  ChipTabsList,
  ChipTabsRoot,
  ChipTabsTrigger,
} from "seed-design/ui/chip-tabs";

const tabs = Array.from({ length: 15 }, (_, i) => String(i + 1));

export default function ChipTabsWithScrollFog() {
  return (
    <div style={{ width: "100%", maxWidth: "360px" }}>
      <ChipTabsRoot variant="neutralSolid" defaultValue="1">
        <ScrollFog placement={["left", "right"]}>
          <ChipTabsList style={{ paddingLeft: "20px", paddingRight: "20px" }}>
            {tabs.map((value) => (
              <ChipTabsTrigger key={value} value={value}>
                라벨{value}
              </ChipTabsTrigger>
            ))}
          </ChipTabsList>
        </ScrollFog>
        {tabs.map((value) => (
          <ChipTabsContent key={value} value={value}>
            <Content>Content {value}</Content>
          </ChipTabsContent>
        ))}
      </ChipTabsRoot>
    </div>
  );
}

const Content = (props: React.PropsWithChildren) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "180px",
        backgroundColor: "var(--seed-color-bg-layer-default)",
      }}
    >
      {props.children}
    </div>
  );
};
