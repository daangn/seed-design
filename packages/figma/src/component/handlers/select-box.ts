import * as metadata from "../../data/__generated__/component-sets";
import { createElement } from "../../jsx";
import { findAllInstances } from "../../utils/figma-node";
import type { ComponentHandler } from "../type-helper";
import type { SelectBoxGroupProperties, SelectBoxProperties } from "../type";

export const selectBoxGroupHandler: ComponentHandler<SelectBoxGroupProperties> = {
  key: metadata.templateSelectBoxGroup.key,
  codegen: async (node) => {
    const props = node.componentProperties;

    const tag = (() => {
      switch (props.Control.value) {
        case "Checkbox":
          return "CheckSelectBoxGroup";
        case "Radio":
          return "RadioSelectBoxGroup";
      }
    })();

    const selectBoxes = findAllInstances<SelectBoxProperties>({
      node,
      key: selectBoxHandler.key,
    });

    const selectedSelectBox = selectBoxes.find((selectBox) =>
      selectBox.componentProperties.State.value.split("-").includes("Selected"),
    );

    const stack = createElement(
      "Stack",
      { gap: "spacingY.componentDefault" },
      await Promise.all(selectBoxes.map(selectBoxHandler.codegen)),
    );

    const commonProps = {
      ...(tag === "RadioSelectBoxGroup" && {
        defaultValue: selectedSelectBox?.componentProperties["Label#3635:0"].value,
      }),
    };

    return createElement(tag, commonProps, stack);
  },
};

export const selectBoxHandler: ComponentHandler<SelectBoxProperties> = {
  key: metadata.selectBox.key,
  codegen: async ({ componentProperties: props }) => {
    const tag = (() => {
      switch (props.Control.value) {
        case "Checkbox":
          return "CheckSelectBox";
        case "Radio":
          return "RadioSelectBox";
      }
    })();

    const states = props.State.value.split("-");

    const commonProps = {
      label: props["Label#3635:0"].value,
      ...(props["Show Description#3033:0"].value && {
        description: props["Description #3033:5"].value,
      }),
      ...(tag === "RadioSelectBox" && {
        value: props["Label#3635:0"].value,
      }),
      ...(tag === "CheckSelectBox" &&
        states.includes("Selected") && {
          defaultChecked: true,
        }),
    };

    return createElement(tag, commonProps);
  },
};
