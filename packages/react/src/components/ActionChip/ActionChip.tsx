import { actionChip, type ActionChipVariantProps } from "@seed-design/css/recipes/action-chip";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { createRecipeContext } from "../../utils/createRecipeContext";
import { withIconRequired } from "../Icon/Icon";

const { withContext } = createRecipeContext(actionChip);

export interface ActionChipProps
  extends ActionChipVariantProps,
    PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const ActionChip = withIconRequired(
  withContext<HTMLButtonElement, ActionChipProps>(Primitive.button),
  (props: ActionChipProps) => props.layout === "iconOnly",
);
ActionChip.displayName = "ActionChip";
