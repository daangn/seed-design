import { composeRefs } from "@radix-ui/react-compose-refs";
import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { forwardRef } from "react";
import { useHideEffectCoordinator } from "../../hooks/useHideEffectCoordinator";
import { useGlobalInteraction } from "./useGlobalInteraction";
import { GlobalInteractionProvider } from "./useGlobalInteractionContext";

export interface GlobalInteractionProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const GlobalInteraction = forwardRef<HTMLDivElement, GlobalInteractionProps>(
  (props, ref) => {
    const api = useGlobalInteraction();
    useHideEffectCoordinator();
    return (
      <GlobalInteractionProvider value={api}>
        <Primitive.div
          ref={composeRefs(api.stackRef, ref)}
          {...mergeProps(api.stackProps, props)}
        />
      </GlobalInteractionProvider>
    );
  },
);
GlobalInteraction.displayName = "GlobalInteraction";
