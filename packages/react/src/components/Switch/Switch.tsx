import { Switch as SwitchPrimitive, useSwitchContext } from "@seed-design/react-switch";
import { switchStyle, type SwitchVariantProps } from "@seed-design/css/recipes/switch";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { createWithStateProps } from "../../utils/createWithStateProps";

const { withProvider, withContext } = createSlotRecipeContext(switchStyle);
const withStateProps = createWithStateProps([useSwitchContext]);

////////////////////////////////////////////////////////////////////////////////////

export interface SwitchRootProps extends SwitchVariantProps, SwitchPrimitive.RootProps {}

export const SwitchRoot = withProvider<HTMLLabelElement, SwitchRootProps>(
  SwitchPrimitive.Root,
  "root",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SwitchControlProps extends SwitchPrimitive.ControlProps {}

export const SwitchControl = withContext<HTMLDivElement, SwitchControlProps>(
  SwitchPrimitive.Control,
  "control",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SwitchThumbProps extends SwitchPrimitive.ThumbProps {}

export const SwitchThumb = withContext<HTMLDivElement, SwitchThumbProps>(
  SwitchPrimitive.Thumb,
  "thumb",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SwitchLabelProps extends PrimitiveProps, React.HTMLAttributes<HTMLSpanElement> {}

export const SwitchLabel = withContext<HTMLSpanElement, SwitchLabelProps>(
  withStateProps(Primitive.span),
  "label",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SwitchHiddenInputProps extends SwitchPrimitive.HiddenInputProps {}

export const SwitchHiddenInput = SwitchPrimitive.HiddenInput;
