import type {
  ActionButtonGhostProperties,
  ActionButtonProperties,
  ErrorStateProperties,
} from "@/codegen/component-properties";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { findAllInstances } from "@/utils/figma-node";
import { camelCase } from "change-case";
import { createLocalSnippetHelper } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";
import { createActionButtonGhostHandler, createActionButtonHandler } from "./action-button";

const { createLocalSnippetElement } = createLocalSnippetHelper("error-state");

export const createErrorStateHandler = (ctx: ComponentHandlerDeps) => {
  const actionButtonHandler = createActionButtonHandler(ctx);
  const ghostButtonHandler = createActionButtonGhostHandler(ctx);

  return defineComponentHandler<ErrorStateProperties>(
    metadata.templateErrorState.key,
    (node, traverse) => {
      const props = node.componentProperties;

      const [actionButton] = findAllInstances<ActionButtonProperties>({
        node,
        key: actionButtonHandler.key,
      });

      const [ghostButton] = findAllInstances<ActionButtonGhostProperties>({
        node,
        key: ghostButtonHandler.key,
      });

      const commonProps = {
        variant: camelCase(props.Variant.value),
        ...(props.Layout.value === "With Title" && {
          title: props["Title#16237:0"].value,
        }),
        description: props["Description#16237:5"].value,
        ...(actionButton && {
          primaryActionProps: {
            children: actionButtonHandler.transform(actionButton, traverse).children[0],
          },
        }),
        ...(ghostButton && {
          secondaryActionProps: {
            children: ghostButtonHandler.transform(ghostButton, traverse).children[0],
          },
        }),
      };

      return createLocalSnippetElement("ErrorState", commonProps);
    },
  );
};
