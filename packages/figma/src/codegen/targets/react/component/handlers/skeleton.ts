import type { SkeletonProperties } from "@/codegen/component-properties";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { camelCase } from "change-case";
import { match } from "ts-pattern";
import { createSeedReactElement } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";

export const createSkeletonHandler = (ctx: ComponentHandlerDeps) =>
  defineComponentHandler<SkeletonProperties>(metadata.componentSkeleton.key, (node) => {
    const { componentProperties: props, layoutSizingHorizontal, layoutSizingVertical } = node;

    const commonProps = {
      radius: camelCase(props.Radius.value),
      width: match(layoutSizingHorizontal)
        .with("FIXED", () => ctx.valueResolver.getFormattedValue.width(node))
        .with("FILL", () => "full")
        .otherwise(() => "full"),
      height: match(layoutSizingVertical)
        .with("FIXED", () => ctx.valueResolver.getFormattedValue.height(node))
        .with("FILL", () => "full")
        .otherwise(() => "full"),
    };

    return createSeedReactElement("Skeleton", commonProps);
  });
