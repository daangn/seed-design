"use client";

import { Slot } from "@radix-ui/react-slot";
import { useDismissibleLayer, type UseDismissibleLayerOptions } from "./useDismissibleLayer";
import { DismissibleParentContext } from "./layer-stack";

export interface DismissibleLayerProps extends UseDismissibleLayerOptions {
  children: React.ReactNode;
}

export const DismissibleLayer = (props: DismissibleLayerProps) => {
  const { children, ...options } = props;
  const { dismissibleRef, dismissibleProps, layerNode } = useDismissibleLayer(options);

  return (
    <DismissibleParentContext.Provider value={layerNode}>
      <Slot ref={dismissibleRef} {...dismissibleProps}>
        {children}
      </Slot>
    </DismissibleParentContext.Provider>
  );
};
DismissibleLayer.displayName = "DismissibleLayer";
