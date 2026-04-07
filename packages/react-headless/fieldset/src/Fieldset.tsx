"use client";

import { composeRefs } from "@radix-ui/react-compose-refs";
import { mergeProps } from "@ride-developer/dom-utils";
import { Primitive, type PrimitiveProps } from "@ride-developer/react-primitive";
import type * as React from "react";
import { forwardRef } from "react";
import { useFieldset } from "./useFieldset";
import { FieldsetProvider, useFieldsetContext } from "./useFieldsetContext";

export interface FieldsetRootProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const FieldsetRoot = forwardRef<HTMLDivElement, FieldsetRootProps>((props, ref) => {
  const api = useFieldset();
  const mergedProps = mergeProps(api.rootProps, props);

  return (
    <FieldsetProvider value={api}>
      <Primitive.div ref={ref} {...mergedProps} />
    </FieldsetProvider>
  );
});
FieldsetRoot.displayName = "FieldsetRoot";

export interface FieldsetLabelProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const FieldsetLabel = forwardRef<HTMLDivElement, FieldsetLabelProps>((props, ref) => {
  const { refs, labelProps } = useFieldsetContext();
  const mergedProps = mergeProps(labelProps, props);

  return <Primitive.div ref={composeRefs(refs.label, ref)} {...mergedProps} />;
});
FieldsetLabel.displayName = "FieldsetLabel";

export interface FieldsetDescriptionProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const FieldsetDescription = forwardRef<HTMLSpanElement, FieldsetDescriptionProps>(
  (props, ref) => {
    const { refs, descriptionProps } = useFieldsetContext();
    const mergedProps = mergeProps(descriptionProps, props);

    return <Primitive.span ref={composeRefs(refs.description, ref)} {...mergedProps} />;
  },
);
FieldsetDescription.displayName = "FieldsetDescription";

export interface FieldsetErrorMessageProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const FieldsetErrorMessage = forwardRef<HTMLDivElement, FieldsetErrorMessageProps>(
  (props, ref) => {
    const { refs, errorMessageProps } = useFieldsetContext();
    const mergedProps = mergeProps(errorMessageProps, props);

    return <Primitive.div ref={composeRefs(refs.errorMessage, ref)} {...mergedProps} />;
  },
);
FieldsetErrorMessage.displayName = "FieldsetErrorMessage";
