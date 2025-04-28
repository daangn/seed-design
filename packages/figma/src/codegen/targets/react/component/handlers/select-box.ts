import { createElement, defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { findAllInstances } from "@/utils/figma-node";
import type { SeedComponentHandlerDeps } from "../deps.interface";
import type { SelectBoxGroupProperties, SelectBoxProperties } from "@/codegen/component-properties";

export const createSelectBoxHandler = (_ctx: SeedComponentHandlerDeps) =>
  defineComponentHandler<SelectBoxProperties>(
    metadata.selectBox.key,
    ({ componentProperties: props }) => {
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
  );

export const createSelectBoxGroupHandler = (ctx: SeedComponentHandlerDeps) => {
  const selectBoxHandler = createSelectBoxHandler(ctx);

  return defineComponentHandler<SelectBoxGroupProperties>(
    metadata.templateSelectBoxGroup.key,
    (node) => {
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
        selectBoxes.map(selectBoxHandler.transform),
      );

      const commonProps = {
        ...(tag === "RadioSelectBoxGroup" && {
          defaultValue: selectedSelectBox?.componentProperties["Label#3635:0"].value,
        }),
      };

      return createElement(tag, commonProps, stack);
    },
  );
};
