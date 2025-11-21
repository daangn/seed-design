import { ScrollFog } from "@seed-design/react";
import {
  ChipTabsCarousel,
  ChipTabsList,
  ChipTabsRoot,
  ChipTabsTrigger,
} from "seed-design/ui/chip-tabs";

export default function ChipTabsWithScrollFog() {
  return (
    <div style={{ maxWidth: "360px" }}>
      <ChipTabsRoot variant="neutralSolid" defaultValue="1">
        <ChipTabsCarousel>
          <ScrollFog placement={["left", "right"]}>
            <ChipTabsList style={{ paddingLeft: "20px", paddingRight: "20px" }}>
              {Array.from({ length: 15 }, (_, i) => (
                <ChipTabsTrigger key={i + 1} value={String(i + 1)}>
                  라벨{i + 1}
                </ChipTabsTrigger>
              ))}
            </ChipTabsList>
          </ScrollFog>
        </ChipTabsCarousel>
      </ChipTabsRoot>
    </div>
  );
}
