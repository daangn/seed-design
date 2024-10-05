import { arrow, autoUpdate, flip, limitShift, offset, shift, useFloating, } from "@floating-ui/react";
import { useMemo, useState } from "react";
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
    return arrow({ element: arrowElement, padding: opts.arrowPadding });
}
function getOffsetMiddleware(arrowOffset, opts) {
    const offsetMainAxis = (opts.gutter ?? 0) + arrowOffset;
    return offset(offsetMainAxis);
}
function getFlipMiddleware(opts) {
    if (!opts.flip)
        return;
    return flip({
        padding: opts.overflowPadding,
        fallbackPlacements: opts.flip === true ? undefined : opts.flip,
    });
}
function getShiftMiddleware(opts) {
    if (!opts.slide)
        return;
    return shift({
        mainAxis: opts.slide,
        padding: opts.overflowPadding,
        limiter: limitShift(),
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
export function usePositionedFloating(props) {
    const options = { ...defaultPositioningOptions, ...props };
    const [uncontrolledOpen, setUncontrolledOpen] = useState(props.defaultOpen);
    const [arrowEl, setArrowEl] = useState(null);
    const arrowRect = useMemo(() => getArrowRect(arrowEl), [arrowEl]);
    const arrowOffset = arrowRect?.height ?? 0;
    const open = props.open ?? uncontrolledOpen;
    const onOpenChange = props.onOpenChange ?? setUncontrolledOpen;
    const { refs, context, floatingStyles, middlewareData } = useFloating({
        strategy: options.strategy,
        open,
        placement: options.placement,
        onOpenChange: onOpenChange,
        whileElementsMounted: autoUpdate,
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