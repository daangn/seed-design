// Visual behavior is verified in Storybook: docs/stories/MiddleTruncate.stories.tsx

"use client";

import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { forwardRef, useEffect } from "react";
import { composeRefs } from "@radix-ui/react-compose-refs";
import type { UseMiddleTruncateProps } from "./useMiddleTruncate";
import { useMiddleTruncate } from "./useMiddleTruncate";
import { MiddleTruncateProvider, useMiddleTruncateContext } from "./useMiddleTruncateContext";

////////////////////////////////////////////////////////////////////////////////////

export interface MiddleTruncateRootProps
  extends UseMiddleTruncateProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const MiddleTruncateRoot = forwardRef<HTMLDivElement, MiddleTruncateRootProps>(
  (props, ref) => {
    const { end, ellipsis, maxLines, onTruncate, style, ...otherProps } = props;

    const api = useMiddleTruncate({ end, ellipsis, maxLines, onTruncate });

    return (
      <MiddleTruncateProvider value={api}>
        <Primitive.div
          ref={composeRefs(ref, api.rootRef)}
          style={{ ...api.rootProps.style, ...style }}
          {...otherProps}
        />
      </MiddleTruncateProvider>
    );
  },
);
MiddleTruncateRoot.displayName = "MiddleTruncateRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface MiddleTruncateContentProps
  extends PrimitiveProps,
    Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  children: string;
}

export const MiddleTruncateContent = forwardRef<HTMLSpanElement, MiddleTruncateContentProps>(
  (props, ref) => {
    const { children, ...otherProps } = props;
    const { displayText, registerText } = useMiddleTruncateContext();

    useEffect(() => {
      registerText(children);
    }, [children, registerText]);

    return (
      <Primitive.span ref={ref} {...otherProps}>
        {displayText ?? children}
      </Primitive.span>
    );
  },
);
MiddleTruncateContent.displayName = "MiddleTruncateContent";
