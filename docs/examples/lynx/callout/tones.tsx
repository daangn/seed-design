import "./styles";

import { root } from "@lynx-js/react";
import { Callout, useSeedClassName } from "@seed-design/lynx-react";

const tones = ["neutral", "informative", "positive", "warning", "critical", "magic"] as const;

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="callout-preview">
        {tones.map((tone) => (
          <Callout.Root key={tone} tone={tone}>
            <Callout.Content>
              <Callout.Title>{tone}</Callout.Title>
              <Callout.Description>Callout의 {tone} tone입니다.</Callout.Description>
            </Callout.Content>
          </Callout.Root>
        ))}
      </view>
    </page>
  );
}

root.render(<Root />);
