"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePositionedFloating = usePositionedFloating;
const react_1 = require("@floating-ui/react");
const react_2 = require("react");
const defaultPositioningOptions = {
    strategy: "absolute",
    placement: "bottom",
    flip: true,
    slide: true,
    overflowPadding: 8,
    arrowPadding: 4,
};
function getArrowRect(arrowElement) {
    return arrowElement?.getClientRects().item(0) ?? null;
}
function getArrowMiddleware(arrowElement, opts) {
    if (!arrowElement)
        return;
    return (0, react_1.arrow)({ element: arrowElement, padding: opts.arrowPadding });
}
function getOffsetMiddleware(arrowOffset, opts) {
    const offsetMainAxis = (opts.gutter ?? 0) + arrowOffset;
    return (0, react_1.offset)(offsetMainAxis);
}
function getFlipMiddleware(opts) {
    if (!opts.flip)
        return;
    return (0, react_1.flip)({
        padding: opts.overflowPadding,
        fallbackPlacements: opts.flip === true ? undefined : opts.flip,
    });
}
function getShiftMiddleware(opts) {
    if (!opts.slide)
        return;
    return (0, react_1.shift)({
        mainAxis: opts.slide,
        padding: opts.overflowPadding,
        limiter: (0, react_1.limitShift)(),
    });
}
const rectMiddleware = {
    name: "rects",
    fn({ rects }) {
        return {
            data: rects,
        };
    },
};
const ARROW_FLOATING_STYLE = {
    top: "",
    right: "rotate(90deg)",
    bottom: "rotate(180deg)",
    left: "rotate(270deg)",
};
function usePositionedFloating(props) {
    const options = { ...defaultPositioningOptions, ...props };
    const [uncontrolledOpen, setUncontrolledOpen] = (0, react_2.useState)(props.defaultOpen);
    const [arrowEl, setArrowEl] = (0, react_2.useState)(null);
    const arrowRect = (0, react_2.useMemo)(() => getArrowRect(arrowEl), [arrowEl]);
    const arrowOffset = arrowRect?.height ?? 0;
    const open = props.open ?? uncontrolledOpen;
    const onOpenChange = props.onOpenChange ?? setUncontrolledOpen;
    const { refs, context, floatingStyles, middlewareData } = (0, react_1.useFloating)({
        strategy: options.strategy,
        open,
        placement: options.placement,
        onOpenChange: onOpenChange,
        whileElementsMounted: react_1.autoUpdate,
        middleware: [
            getOffsetMiddleware(arrowOffset, options),
            getFlipMiddleware(options),
            getShiftMiddleware(options),
            getArrowMiddleware(arrowEl, options),
            rectMiddleware,
        ],
    });
    const side = context.placement.split("-")[0];
    const arrowStyles = {
        position: "absolute",
        left: middlewareData.arrow?.x,
        top: middlewareData.arrow?.y,
        [side]: "100%",
        transform: ARROW_FLOATING_STYLE[side],
    };
    return {
        open,
        refs: {
            ...refs,
            arrow: arrowEl,
            setArrow: setArrowEl,
        },
        rects: {
            ...middlewareData.rects,
            arrow: arrowRect,
        },
        context,
        floatingStyles,
        arrowStyles,
    };
}
//# sourceMappingURL=floating.js.map