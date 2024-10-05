import { useClick, useDismiss, useInteractions, useRole } from "@floating-ui/react";
import { usePositionedFloating } from "./floating.js";
export function usePopover(props = {}) {
    const { open, refs, context, floatingStyles, arrowStyles, rects } = usePositionedFloating(props);
    const role = useRole(context);
    const click = useClick(context);
    const dismiss = useDismiss(context);
    const triggerInteractions = useInteractions([role, click, dismiss]);
    const anchorInteractions = useInteractions([role, dismiss]);
    return {
        open,
        refs: {
            anchor: refs.setReference,
            trigger: refs.setReference,
            positioner: refs.setFloating,
            arrow: refs.setArrow,
        },
        rects,
        anchorProps: {
            ...anchorInteractions.getReferenceProps(),
        },
        triggerProps: {
            "aria-haspopup": "dialog",
            "aria-expanded": open,
            ...triggerInteractions.getReferenceProps(),
        },
        positionerProps: {
            ...triggerInteractions.getFloatingProps(),
            style: floatingStyles,
        },
        arrowProps: {
            style: arrowStyles,
        },
    };
}
//# sourceMappingURL=index.js.map