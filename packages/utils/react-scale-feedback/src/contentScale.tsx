"use client";

import { createSlot } from "@radix-ui/react-slot";
import * as React from "react";

// Duplicated from packages/qvism-preset/src/utils/scale-feedback.ts, which emits
// the matching rule into base.css. Kept out of `@seed-design/css/scale-feedback`:
// nothing but this component needs the name, so it stays off the public surface.
// Edit both together — nothing checks, and drift leaves the box unstyled.
const CONTENT_SCALE_CLASS_NAME = "seed-content-scale";

const ContentScaleSlot = createSlot("ContentScale");

export interface ContentScaleProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Whether the element should be rendered as a child of a slot.
   * @default false
   */
  asChild?: boolean;
}

/**
 * The box that shrinks for content scale, where a pressed element keeps its
 * background fixed and only its content scales. Place it as the only in-flow child
 * of an element that opts into scale feedback, and publish the ratio from that
 * element's pressed selector rather than scaling the element itself:
 *
 *   .my-row:active {
 *     background-color: ...;
 *     --seed-content-scale: var(--seed-feedback-scale);
 *   }
 *
 *   <ScaleFeedback>
 *     <button className="my-row">
 *       <ContentScale>...</ContentScale>
 *     </button>
 *   </ScaleFeedback>
 *
 * The box inherits the element's flex layout, so the element keeps its padding and
 * its `display`, `gap` and alignment go on laying out the content. Anywhere a
 * measured element doesn't publish the ratio, the box stays at its resting scale.
 */
export const ContentScale = React.forwardRef<HTMLSpanElement, ContentScaleProps>(
  ({ asChild = false, className, ...otherProps }, ref) => {
    const Comp = asChild ? ContentScaleSlot : "span";

    return (
      <Comp
        ref={ref}
        className={
          className ? `${CONTENT_SCALE_CLASS_NAME} ${className}` : CONTENT_SCALE_CLASS_NAME
        }
        {...otherProps}
      />
    );
  },
);

ContentScale.displayName = "ContentScale";
