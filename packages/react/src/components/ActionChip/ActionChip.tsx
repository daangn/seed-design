import { actionChip, type ActionChipVariantProps } from "@seed-design/css/recipes/action-chip";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { createRecipeContext } from "../../utils/createRecipeContext";
import { withIconRequired } from "../Icon/Icon";

const { withContext } = createRecipeContext(actionChip);

/**
 * @deprecated ActionChip is deprecated. Use Chip.Button with variant="solid" instead.
 * 
 * Migration guide:
 * ```tsx
 * // Before
 * <ActionChip size="medium">Label</ActionChip>
 * 
 * // After
 * import { Chip } from "@seed-design/react";
 * <Chip.Button size="medium" variant="solid">Label</Chip.Button>
 * ```
 */
export interface ActionChipProps
  extends ActionChipVariantProps,
    PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

/**
 * @deprecated ActionChip is deprecated. Use Chip.Button with variant="solid" instead.
 */
export const ActionChip = withIconRequired(
  withContext<HTMLButtonElement, ActionChipProps>(Primitive.button),
  (props: ActionChipProps) => props.layout === "iconOnly",
);
ActionChip.displayName = "ActionChip";
