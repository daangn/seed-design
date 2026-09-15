import "./styles";

import { ScrollFog, useSeedClassName } from "@seed-design/lynx-react";

const ITEMS = Array.from({ length: 15 }, (_, index) => index + 1);

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-scroll-fog-root`}>
      <view className="scroll-fog-example scroll-fog-example--horizontal">
        <ScrollFog className="scroll-fog-example__scroll" placement={["left", "right"]}>
          <view className="scroll-fog-example__horizontal-content">
            {ITEMS.map((item) => (
              <view key={item} className="scroll-fog-example__horizontal-item">
                <text className="scroll-fog-example__row-text">항목 {item}</text>
              </view>
            ))}
          </view>
        </ScrollFog>
      </view>
    </view>
  );
}
