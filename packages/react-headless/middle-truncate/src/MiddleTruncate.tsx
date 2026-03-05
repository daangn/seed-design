"use client";

import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { forwardRef } from "react";
import { composeRefs } from "@radix-ui/react-compose-refs";
import type { UseMiddleTruncateProps } from "./useMiddleTruncate";
import { useMiddleTruncate } from "./useMiddleTruncate";
import { MiddleTruncateProvider, useMiddleTruncateContext } from "./useMiddleTruncateContext";
import { mergeProps } from "@seed-design/dom-utils";

export interface MiddleTruncateRootProps
  extends UseMiddleTruncateProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const MiddleTruncateRoot = forwardRef<HTMLDivElement, MiddleTruncateRootProps>(
  ({ text, end, ellipsis, maxLines, onTruncate, ...otherProps }, ref) => {
    const api = useMiddleTruncate({ text, end, ellipsis, maxLines, onTruncate });

    return (
      <MiddleTruncateProvider value={api}>
        <Primitive.div
          ref={composeRefs(ref, api.rootRef)}
          {...mergeProps(api.rootProps, otherProps)}
        />
      </MiddleTruncateProvider>
    );
  },
);
MiddleTruncateRoot.displayName = "MiddleTruncateRoot";

export interface MiddleTruncateContentProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const MiddleTruncateContent = forwardRef<HTMLSpanElement, MiddleTruncateContentProps>(
  (props, ref) => {
    const { contentProps } = useMiddleTruncateContext();

    return <Primitive.span ref={ref} {...mergeProps(contentProps, props)} />;
  },
);
MiddleTruncateContent.displayName = "MiddleTruncateContent";
