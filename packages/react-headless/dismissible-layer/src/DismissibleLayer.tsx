"use client";

import { composeRefs } from "@radix-ui/react-compose-refs";
import { Slot } from "@radix-ui/react-slot";
import { forwardRef } from "react";
import { useDismissibleLayer, type UseDismissibleLayerOptions } from "./useDismissibleLayer";
import { DismissibleParentContext } from "./layer-stack";

export interface DismissibleLayerProps extends UseDismissibleLayerOptions {
  children: React.ReactNode;
}

export const DismissibleLayer = forwardRef<HTMLElement, DismissibleLayerProps>((props, ref) => {
  const { children, ...options } = props;
  const { dismissibleRef, dismissibleProps, layerNode } = useDismissibleLayer(options);

  return (
    <DismissibleParentContext.Provider value={layerNode}>
      <Slot ref={composeRefs(ref, dismissibleRef)} {...dismissibleProps}>
        {children}
      </Slot>
    </DismissibleParentContext.Provider>
  );
});
DismissibleLayer.displayName = "DismissibleLayer";
