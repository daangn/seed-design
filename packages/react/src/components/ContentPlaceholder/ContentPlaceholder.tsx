import {
  contentPlaceholder,
  type ContentPlaceholderVariantProps,
} from "@seed-design/css/recipes/content-placeholder";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import * as React from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { InternalIcon } from "../private/Icon";
import { contentPlaceholderAssetPresetMap, type ContentPlaceholderAssetType } from "./presets";

const { withProvider, withContext } = createSlotRecipeContext(contentPlaceholder);

export interface ContentPlaceholderRootProps
  extends ContentPlaceholderVariantProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const ContentPlaceholderRoot = withProvider<HTMLDivElement, ContentPlaceholderRootProps>(
  Primitive.div,
  "root",
);

ContentPlaceholderRoot.displayName = "ContentPlaceholderRoot";

export interface ContentPlaceholderContainerProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const ContentPlaceholderContainer = withContext<
  HTMLDivElement,
  ContentPlaceholderContainerProps
>(Primitive.div, "container");

type ContentPlaceholderAssetCommonProps = Omit<React.HTMLAttributes<SVGSVGElement>, "children">;

export type ContentPlaceholderAssetProps =
  | (ContentPlaceholderAssetCommonProps & {
      type?: ContentPlaceholderAssetType;
      svg?: never;
    })
  | (ContentPlaceholderAssetCommonProps & {
      svg: React.ReactNode;
      type?: never;
    });

export type { ContentPlaceholderAssetType };

export type ContentPlaceholderProps = Omit<ContentPlaceholderRootProps, "children"> &
  (
    | {
        type?:
          | "default"
          | "coupon"
          | "car"
          | "realty"
          | "food"
          | "image"
          | "group"
          | "post"
          | "localProfile"
          | "buySell"
          | "jobs";
        svg?: never;
      }
    | { svg: React.ReactNode; type?: never }
  );

const ContentPlaceholderAssetBase = React.forwardRef<SVGSVGElement, ContentPlaceholderAssetProps>(
  ({ type, svg, ...props }, ref) => {
    if (process.env.NODE_ENV !== "production" && type !== undefined && svg !== undefined) {
      throw new Error("ContentPlaceholder.Asset: `type` and `svg` cannot be used together.");
    }

    const resolvedType: ContentPlaceholderAssetType = type ?? "default";
    const resolvedSvg = svg ?? contentPlaceholderAssetPresetMap[resolvedType];

    return <InternalIcon ref={ref} svg={resolvedSvg} {...props} />;
  },
);

ContentPlaceholderAssetBase.displayName = "ContentPlaceholderAssetBase";

export const ContentPlaceholderAsset = withContext<SVGSVGElement, ContentPlaceholderAssetProps>(
  ContentPlaceholderAssetBase,
  "asset",
);

ContentPlaceholderAsset.displayName = "ContentPlaceholderAsset";
