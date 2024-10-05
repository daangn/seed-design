"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePopover = usePopover;
const react_1 = require("@floating-ui/react");
const floating_js_1 = require("./floating.js");
function usePopover(props = {}) {
    const { open, refs, context, floatingStyles, arrowStyles, rects } = (0, floating_js_1.usePositionedFloating)(props);
    const role = (0, react_1.useRole)(context);
    const click = (0, react_1.useClick)(context);
    const dismiss = (0, react_1.useDismiss)(context);
    const triggerInteractions = (0, react_1.useInteractions)([role, click, dismiss]);
    const anchorInteractions = (0, react_1.useInteractions)([role, dismiss]);
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