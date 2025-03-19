import { mannerTemp, type MannerTempVariantProps } from "@seed-design/css/recipes/manner-temp";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { forwardRef, useMemo } from "react";
import { createRecipeContext } from "../../utils/createRecipeContext";
import { MannerTempEmotePropsProvider } from "./MannerTempEmote";

const { withContext } = createRecipeContext(mannerTemp);

export interface MannerTempProps
  extends MannerTempVariantProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

const MannerTempBase = withContext<HTMLSpanElement, MannerTempProps>(Primitive.span);

export const MannerTemp = forwardRef<HTMLSpanElement, MannerTempProps>((props, ref) => {
  const emoteProps = useMemo(() => ({ level: props.level }), [props.level]);

  return (
    <MannerTempEmotePropsProvider value={emoteProps}>
      <MannerTempBase {...props} ref={ref} />
    </MannerTempEmotePropsProvider>
  );
});
