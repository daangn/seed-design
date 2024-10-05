import { type Placement, type Rect } from "@floating-ui/react";
export interface PositioningOptions {
    /**
     * The strategy to use for positioning
     * @default "absolute"
     */
    strategy?: "absolute" | "fixed";
    /**
     * The initial placement of the floating element
     * @default "bottom"
     */
    placement?: Placement;
    /**
     * The gutter between the floating element and the reference element
     */
    gutter?: number;
    /**
     * Whether to flip the placement
     * @default true
     */
    flip?: boolean | Placement[];
    /**
     * Whether the popover should slide when it overflows.
     * @default true
     */
    slide?: boolean;
    /**
     * The virtual padding around the viewport edges to check for overflow
     * @default 8
     */
    overflowPadding?: number;
    /**
     * The minimum padding between the arrow and the floating element's corner.
     * @default 4
     */
    arrowPadding?: number;
}
export interface UsePositionedFloatingProps extends PositioningOptions {
    /**
     * Whether the floating element is initially open
     */
    defaultOpen?: boolean;
    /**
     * Whether the floating element is open
     */
    open?: boolean;
    /**
     * Callback when the floating element is opened or closed
     */
    onOpenChange?: (open: boolean) => void;
}
export declare function usePositionedFloating(props: UsePositionedFloatingProps): {
    open: boolean | undefined;
    refs: {
        arrow: HTMLElement | null;
        setArrow: import("react").Dispatch<import("react").SetStateAction<HTMLElement | null>>;
        reference: import("react").MutableRefObject<import("@floating-ui/react-dom").ReferenceType | null> & import("react").MutableRefObject<import("@floating-ui/react").ReferenceType | null>;
        floating: import("react").MutableRefObject<HTMLElement | null>;
        setReference: ((node: import("@floating-ui/react-dom").ReferenceType | null) => void) & ((node: import("@floating-ui/react").ReferenceType | null) => void);
        setFloating: ((node: HTMLElement | null) => void) & ((node: HTMLElement | null) => void);
        domReference: import("react").MutableRefObject<Element | null>;
        setPositionReference(node: import("@floating-ui/react").ReferenceType | null): void;
    };
    rects: {
        arrow: {
            x: number;
            y: number;
            width: number;
            height: number;
        } | null;
        reference: Rect;
        floating: Rect;
    };
    context: {
        x: number;
        y: number;
        placement: Placement;
        strategy: import("@floating-ui/utils").Strategy;
        middlewareData: import("@floating-ui/core").MiddlewareData;
        isPositioned: boolean;
        update: () => void;
        floatingStyles: import("react").CSSProperties;
        open: boolean;
        onOpenChange: (open: boolean, event?: Event, reason?: import("@floating-ui/react").OpenChangeReason) => void;
        events: import("@floating-ui/react").FloatingEvents;
        dataRef: import("react").MutableRefObject<import("@floating-ui/react").ContextData>;
        nodeId: string | undefined;
        floatingId: string;
        refs: import("@floating-ui/react").ExtendedRefs<import("@floating-ui/react").ReferenceType>;
        elements: import("@floating-ui/react").ExtendedElements<import("@floating-ui/react").ReferenceType>;
    };
    floatingStyles: import("react").CSSProperties;
    arrowStyles: {
        readonly [x: string]: number | "" | "absolute" | "rotate(90deg)" | "rotate(180deg)" | "rotate(270deg)" | "100%" | undefined;
        readonly position: "absolute";
        readonly left: number | undefined;
        readonly top: number | undefined;
        readonly transform: "" | "rotate(90deg)" | "rotate(180deg)" | "rotate(270deg)";
    };
};
//# sourceMappingURL=floating.d.ts.map