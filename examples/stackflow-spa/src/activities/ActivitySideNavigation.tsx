import type { StaticActivityComponentType } from "@stackflow/react/future";
import { SideNavigationProvider, SideNavigationInset } from "seed-design/ui/side-navigation";

import { Layout, VStack } from "@seed-design/react";
import { SideNavigation } from "../components/SideNavigation";
import {
  RadioSelectBoxRoot,
  RadioSelectBoxItem,
  RadioSelectBoxRadiomark,
} from "seed-design/ui/select-box";
import { sideNavigationVariantMap } from "@seed-design/css/recipes/side-navigation";
import { layoutVariantMap } from "@seed-design/css/recipes/layout";
import { useState } from "react";

declare module "@stackflow/config" {
  interface Register {
    ActivitySideNavigation: {};
  }
}

const ActivitySideNavigation: StaticActivityComponentType<"ActivitySideNavigation"> = () => {
  const [layoutDensity, setLayoutDensity] =
    useState<(typeof layoutVariantMap.density)[number]>("medium");
  const [sideNavigationTone, setSideNavigationTone] =
    useState<(typeof sideNavigationVariantMap.tone)[number]>("neutral");

  return (
    <>
      <Layout.Root density={layoutDensity}>
        <SideNavigationProvider
          defaultCollapsed={localStorage.getItem("sidebar-collapsed") === "true"}
          onCollapsedChange={(v) => localStorage.setItem("sidebar-collapsed", String(v))}
        >
          <SideNavigation tone={sideNavigationTone} />
          <SideNavigationInset>
            <Layout.Content>
              <VStack px="spacingX.globalGutter" py="x4" gap="spacingY.componentDefault">
                <RadioSelectBoxRoot
                  label="Side Navigation Tone"
                  value={sideNavigationTone}
                  onValueChange={(value) =>
                    setSideNavigationTone(value as typeof sideNavigationTone)
                  }
                  columns={sideNavigationVariantMap.tone.length}
                >
                  {sideNavigationVariantMap.tone.map((tone) => (
                    <RadioSelectBoxItem
                      key={tone}
                      value={tone}
                      label={tone}
                      suffix={<RadioSelectBoxRadiomark />}
                    />
                  ))}
                </RadioSelectBoxRoot>
                <RadioSelectBoxRoot
                  label="Layout Density"
                  value={layoutDensity}
                  onValueChange={(value) => setLayoutDensity(value as typeof layoutDensity)}
                  columns={layoutVariantMap.density.length}
                >
                  {layoutVariantMap.density.map((density) => (
                    <RadioSelectBoxItem
                      key={density}
                      value={density}
                      label={density}
                      suffix={<RadioSelectBoxRadiomark />}
                    />
                  ))}
                </RadioSelectBoxRoot>
              </VStack>
            </Layout.Content>
          </SideNavigationInset>
        </SideNavigationProvider>
      </Layout.Root>
      <style>
        {`body {
          height: 100vh;
        }`}
      </style>
    </>
  );
};

export default ActivitySideNavigation;
