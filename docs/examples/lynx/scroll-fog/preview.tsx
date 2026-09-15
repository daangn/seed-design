import "./styles";

import { ScrollFog, useSeedClassName } from "@seed-design/lynx-react";

const ITEMS = Array.from({ length: 20 }, (_, index) => index + 1);

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-scroll-fog-root`}>
      <view className="scroll-fog-example">
        <ScrollFog className="scroll-fog-example__scroll" placement={["top", "bottom"]}>
          <view className="scroll-fog-example__content">
            {ITEMS.map((item) => (
              <view key={item} className="scroll-fog-example__row">
                <text className="scroll-fog-example__row-text">콘텐츠 {item}</text>
              </view>
            ))}
          </view>
        </ScrollFog>
      </view>
    </view>
  );
}
