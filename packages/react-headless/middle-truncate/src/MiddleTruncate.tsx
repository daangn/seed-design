// Visual behavior is verified in Storybook: docs/stories/MiddleTruncate.stories.tsx

"use client";

import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { mergeProps } from "@seed-design/dom-utils";
import type * as React from "react";
import { forwardRef } from "react";
import { composeRefs } from "@radix-ui/react-compose-refs";
import type { UseMiddleTruncateProps } from "./useMiddleTruncate";
import { useMiddleTruncate } from "./useMiddleTruncate";

export interface MiddleTruncateProps
  extends UseMiddleTruncateProps,
    PrimitiveProps,
    Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {}

export const MiddleTruncate = forwardRef<HTMLSpanElement, MiddleTruncateProps>(
  ({ children, end, ellipsis, maxLines, onTruncate, ...otherProps }, ref) => {
    const api = useMiddleTruncate({ children, end, ellipsis, maxLines, onTruncate });

    return (
      <Primitive.span
        ref={composeRefs(ref, api.contentRef)}
        {...mergeProps(api.contentProps, otherProps)}
      />
    );
  },
);
MiddleTruncate.displayName = "MiddleTruncate";
