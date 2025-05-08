import type { ActionButtonProperties, ErrorStateProperties } from "@/codegen/component-properties";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { findAllInstances } from "@/utils/figma-node";
import { camelCase } from "change-case";
import { createLocalSnippetHelper } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";
import { createActionButtonHandler } from "./action-button";

const { createLocalSnippetElement } = createLocalSnippetHelper("error-state");

export const createErrorStateHandler = (ctx: ComponentHandlerDeps) => {
  const actionButtonHandler = createActionButtonHandler(ctx);

  return defineComponentHandler<ErrorStateProperties>(metadata.errorState.key, (node) => {
    const props = node.componentProperties;

    const [actionButtonNode] = findAllInstances<ActionButtonProperties>({
      node,
      key: actionButtonHandler.key,
    });

    const commonProps = {
      variant: camelCase(props.Variant.value),
      ...(props.Layout.value === "With Title" && {
        title: props["Title#16237:0"].value,
      }),
      description: props["Description#16237:5"].value,
      ...(actionButtonNode && {
        primaryActionProps: {
          children: actionButtonHandler.transform(actionButtonNode).children[0],
        },
        secondaryActionProps: {
          children: props["Secondary Action Label#17042:0"].value,
        },
      }),
    };

    return createLocalSnippetElement("ErrorState", commonProps);
  });
};
