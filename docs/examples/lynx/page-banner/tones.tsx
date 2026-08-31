import "./styles";

import { root } from "@lynx-js/react";
import { PageBanner, useSeedClassName } from "@seed-design/lynx-react";

const tones = ["neutral", "informative", "positive", "warning", "critical", "magic"] as const;
const variants = ["weak", "solid"] as const;

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="page-banner-preview">
        {tones.flatMap((tone) =>
          variants.map((variant) => {
            if (tone === "magic" && variant === "solid") return null;

            return (
              <PageBanner.Root key={`${tone}-${variant}`} tone={tone} variant={variant}>
                <PageBanner.Content>
                  <PageBanner.Body>
                    <PageBanner.Title>{tone}</PageBanner.Title>
                    <PageBanner.Description>{variant} Page Banner</PageBanner.Description>
                  </PageBanner.Body>
                </PageBanner.Content>
              </PageBanner.Root>
            );
          }),
        )}
      </view>
    </page>
  );
}

root.render(<Root />);
