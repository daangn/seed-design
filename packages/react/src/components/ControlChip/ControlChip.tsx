'use client';
import { controlChip, type ControlChipVariantProps } from "@ride-developer/css/recipes/control-chip";
import { Primitive, type PrimitiveProps } from "@ride-developer/react-primitive";
import type * as React from "react";
import { createRecipeContext } from "../../utils/createRecipeContext";
import { withIconRequired } from "../Icon/Icon";

const { withContext } = createRecipeContext(controlChip);

/**
 * @deprecated ControlChipBaseProps is deprecated. Use ChipBaseProps from Chip instead.
 */
export interface ControlChipBaseProps extends PrimitiveProps, ControlChipVariantProps {}

/**
 * @deprecated ControlChipProps is deprecated. Use Chip.Toggle or Chip.Button instead.
 *
 * Migration guide:
 * ```tsx
 * // Before
 * <ControlChip size="medium">Label</ControlChip>
 *
 * // After
 * import { Chip } from "@ride-developer/react";
 * <Chip.Toggle size="medium" variant="outlineStrong">Label</Chip.Toggle>
 * ```
 */
export interface ControlChipProps
  extends ControlChipBaseProps,
    React.HTMLAttributes<HTMLButtonElement> {}

/**
 * @deprecated ControlChip is deprecated. Use Chip.Toggle or Chip.Button instead.
 */
export const ControlChip = withIconRequired(
  withContext<HTMLButtonElement, ControlChipProps>(Primitive.button),
  (props: ControlChipProps) => props.layout === "iconOnly",
);
ControlChip.displayName = "ControlChip";
