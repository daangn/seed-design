import type * as React from "react";
import { useMemo, useRef, useState } from "react";
import { getGridColumnCount, getVariantCombination } from "../helper";
import { ComponentShowcase } from "./ComponentShowcase";
import ControlPanel from "./ControlPanel";
import { VStack } from "@seed-design/react";

type ComponentAnalyzerProviderProps<T extends Record<string, string[]>> = {
  variantsMap: T;

  initialVariants: { [K in keyof T]: T[K][number] };

  render: (props: { [K in keyof T]: T[K][number] }) => React.ReactNode;
};

export function ComponentAnalyzer<T extends Record<string, string[]>>(
  props: ComponentAnalyzerProviderProps<T>,
) {
  const { variantsMap, initialVariants, render } = props;

  const [variants, setVariants] = useState(initialVariants);

  const controlPanelRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);

  const variantCombination = useMemo(
    () => getVariantCombination(variantsMap, variants),
    [variants, variantsMap],
  );
  const gridColumns = getGridColumnCount(variantsMap, variants);

  return (
    <VStack
      gap="x2"
      justify="space-between"
      height="full"
      ref={screenRef}
      pb="safeArea"
      style={{ boxSizing: "border-box" }}
    >
      <ComponentShowcase gridColumns={gridColumns}>
        {variantCombination.map((variant) => render(variant))}
      </ComponentShowcase>
      <ControlPanel
        ref={controlPanelRef}
        variantMap={variantsMap}
        value={variants}
        onValueChange={(variant, value) => {
          setVariants({
            ...variants,
            [variant]: value,
          });
        }}
      />
    </VStack>
  );
}
