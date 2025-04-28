import { createElement, defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { camelCase } from "change-case";
import type { ComponentHandlerDeps } from "../deps.interface";
import type { SkeletonProperties } from "@/codegen/component-properties";
import { match } from "ts-pattern";

export const createSkeletonHandler = (ctx: ComponentHandlerDeps) =>
  defineComponentHandler<SkeletonProperties>(metadata.skeleton.key, (node) => {
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

    return createElement("Skeleton", commonProps);
  });
