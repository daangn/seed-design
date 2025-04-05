import { defineComponentTransformer } from "@/codegen/core";
import * as metadata from "../../../data/__generated__/component-sets";
import { createElement } from "../../../core/jsx";
import { findAllInstances } from "../../../../utils/figma-node";
import type { SelectBoxGroupProperties, SelectBoxProperties } from "../properties.type";
import type { SeedComponentTransformerDeps } from "../deps.interface";

export const createSelectBoxTransformer = (_ctx: SeedComponentTransformerDeps) =>
  defineComponentTransformer<SelectBoxProperties>(
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

export const createSelectBoxGroupTransformer = (ctx: SeedComponentTransformerDeps) => {
  const selectBoxTransformer = createSelectBoxTransformer(ctx);

  return defineComponentTransformer<SelectBoxGroupProperties>(
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
        key: selectBoxTransformer.key,
      });

      const selectedSelectBox = selectBoxes.find((selectBox) =>
        selectBox.componentProperties.State.value.split("-").includes("Selected"),
      );

      const stack = createElement(
        "Stack",
        { gap: "spacingY.componentDefault" },
        selectBoxes.map(selectBoxTransformer.transform),
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
