import { type UsePositionedFloatingProps } from "./floating.js";
export interface UsePopoverProps extends UsePositionedFloatingProps {
}
export declare function usePopover(props?: UsePopoverProps): {
    open: boolean | undefined;
    refs: {
        anchor: (instance: HTMLElement | null) => void;
        trigger: (instance: HTMLElement | null) => void;
        positioner: (instance: HTMLElement | null) => void;
        arrow: (instance: HTMLElement | null) => void;
    };
    rects: {
        arrow: {
            x: number;
            y: number;
            width: number;
            height: number;
        } | null;
        reference: import("@floating-ui/utils").Rect;
        floating: import("@floating-ui/utils").Rect;
    };
    anchorProps: {
        [x: string]: unknown;
    };
    triggerProps: {
        readonly "aria-haspopup": "dialog";
        readonly "aria-expanded": boolean | undefined;
    };
    positionerProps: {
        style: import("react").CSSProperties;
    };
    arrowProps: {
        style: {
            readonly [x: string]: number | "" | "absolute" | "rotate(90deg)" | "rotate(180deg)" | "rotate(270deg)" | "100%" | undefined;
            readonly position: "absolute";
            readonly left: number | undefined;
            readonly top: number | undefined;
            readonly transform: "" | "rotate(90deg)" | "rotate(180deg)" | "rotate(270deg)";
        };
    };
};
//# sourceMappingURL=index.d.ts.map