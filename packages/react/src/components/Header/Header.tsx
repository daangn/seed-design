import type * as React from "react";

import { header, type HeaderVariantProps } from "@seed-design/css/recipes/header";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";

const { withContext, withProvider } = createSlotRecipeContext(header);

export interface HeaderRootProps
  extends HeaderVariantProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLElement> {}

export const HeaderRoot = withProvider<HTMLElement, HeaderRootProps>(Primitive.header, "root");
HeaderRoot.displayName = "HeaderRoot";

export interface HeaderLeftProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const HeaderLeft = withContext<HTMLDivElement, HeaderLeftProps>(Primitive.div, "left");
HeaderLeft.displayName = "HeaderLeft";

export interface HeaderCenterProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const HeaderCenter = withContext<HTMLDivElement, HeaderCenterProps>(Primitive.div, "center");
HeaderCenter.displayName = "HeaderCenter";

export interface HeaderRightProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const HeaderRight = withContext<HTMLDivElement, HeaderRightProps>(Primitive.div, "right");
HeaderRight.displayName = "HeaderRight";
