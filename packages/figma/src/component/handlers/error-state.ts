import { camelCase } from "change-case";
import * as metadata from "../../data/__generated__/component-sets";
import { createElement } from "../../jsx";
import { findAllInstances } from "../../utils/figma-node";
import type { ActionButtonProperties, ErrorStateProperties } from "../type";
import type { ComponentHandler } from "../type-helper";
import { actionButtonHandler } from "./action-button";

export const errorStateHandler: ComponentHandler<ErrorStateProperties> = {
  key: metadata.errorState.key,
  codegen: async (node) => {
    const props = node.componentProperties;

    const [actionButtonNode] = await findAllInstances<ActionButtonProperties>({
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
          children: (await actionButtonHandler.codegen(actionButtonNode)).children[0],
        },
        secondaryActionProps: {
          children: props["Secondary Action Label#17042:0"].value,
        },
      }),
    };

    return createElement("ErrorState", commonProps);
  },
};
