import { createElement, defineComponentTransformer } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { findAllInstances } from "@/utils/figma-node";
import { camelCase } from "change-case";
import type { SeedComponentTransformerDeps } from "../deps.interface";
import type { ActionButtonProperties, ErrorStateProperties } from "@/codegen/component-properties";
import { createActionButtonTransformer } from "./action-button";

export const createErrorStateTransformer = (ctx: SeedComponentTransformerDeps) => {
  const actionButtonTransformer = createActionButtonTransformer(ctx);

  return defineComponentTransformer<ErrorStateProperties>(metadata.errorState.key, (node) => {
    const props = node.componentProperties;

    const [actionButtonNode] = findAllInstances<ActionButtonProperties>({
      node,
      key: actionButtonTransformer.key,
    });

    const commonProps = {
      variant: camelCase(props.Variant.value),
      ...(props.Layout.value === "With Title" && {
        title: props["Title#16237:0"].value,
      }),
      description: props["Description#16237:5"].value,
      ...(actionButtonNode && {
        primaryActionProps: {
          children: actionButtonTransformer.transform(actionButtonNode).children[0],
        },
        secondaryActionProps: {
          children: props["Secondary Action Label#17042:0"].value,
        },
      }),
    };

    return createElement("ErrorState", commonProps);
  });
};
