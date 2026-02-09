import type {
  ActionButtonGhostProperties,
  ActionButtonProperties,
  ResultSectionProperties,
} from "@/codegen/component-properties.archive";
import { createElement, defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/archive/component-sets";
import { findAllInstances } from "@/utils/figma-node";
import { createLocalSnippetHelper, createSeedReactElement } from "../../../element-factories";
import type { ComponentHandlerDeps } from "../../deps.interface";
import { createActionButtonGhostHandler, createActionButtonHandler } from "./action-button";
import { handleSizeProp } from "@/codegen/targets/react/component/size";

const { createLocalSnippetElement } = createLocalSnippetHelper("result-section");

export const createResultSectionHandler = (ctx: ComponentHandlerDeps) => {
  const actionButtonHandler = createActionButtonHandler(ctx);
  const ghostButtonHandler = createActionButtonGhostHandler(ctx);

  return defineComponentHandler<ResultSectionProperties>(
    metadata.resultSection.key,
    (node, traverse) => {
      const props = node.componentProperties;

      const [actionButton] =
        props["Show Buttons#53435:0"].value && props["ㄴShow First Button#53766:0"].value
          ? findAllInstances<ActionButtonProperties>({
              node,
              key: actionButtonHandler.key,
            })
          : [undefined];

      const [ghostButton] =
        props["Show Buttons#53435:0"].value && props["ㄴShow Second Button#53766:3"].value
          ? findAllInstances<ActionButtonGhostProperties>({
              node,
              key: ghostButtonHandler.key,
            })
          : [undefined];

      const commonProps = {
        size: handleSizeProp(props.Size.value),
        ...(props["Show Asset#45154:14"].value && {
          asset: createSeedReactElement(
            "Box",
            undefined,
            createElement("div", undefined, undefined, { comment: "Asset Placeholder" }),
          ),
        }),
        title: props["Title#16237:0"].value,
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

      return createLocalSnippetElement("ResultSection", commonProps);
    },
  );
};
