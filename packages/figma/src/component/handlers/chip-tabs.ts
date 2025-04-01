import { camelCase } from "change-case";
import * as metadata from "../../data/__generated__/component-sets";
import { createElement } from "../../jsx";
import { findAllInstances } from "../../utils/figma-node";
import type { ChipTabsItemProperties, ChipTabsProperties } from "../type";
import type { ComponentHandler } from "../type-helper";

export const chipTabsHandler: ComponentHandler<ChipTabsProperties> = {
  key: metadata.chipTablist.key,
  codegen: async (node) => {
    const chipTabsItems = findAllInstances<ChipTabsItemProperties>({
      node,
      key: chipTabsItemHandler.key,
    });

    const selectedChipTabsItem = chipTabsItems.find((chipTabsItem) =>
      chipTabsItem.componentProperties.State.value.split("-").includes("Selected"),
    );

    const chipTabsList = createElement(
      "ChipTabsList",
      undefined,
      await Promise.all(chipTabsItems.map(chipTabsItemHandler.codegen)),
    );

    const commonProps = {
      variant: camelCase(node.componentProperties.Variant.value),
      ...(selectedChipTabsItem && {
        defaultValue: selectedChipTabsItem.componentProperties["Label#8876:0"].value,
      }),
    };

    return createElement("ChipTabs", commonProps, chipTabsList);
  },
};

const chipTabsItemHandler: ComponentHandler<ChipTabsItemProperties> = {
  key: "fa80168b02051fbb0ba032238bd76d840dbe2e15",
  codegen: async ({ componentProperties: props }) => {
    const states = props.State.value.split("-");

    const commonProps = {
      value: props["Label#8876:0"].value,
      ...(states.includes("Disabled") && {
        disabled: true,
      }),
    };

    return createElement("ChipTabsTrigger", commonProps, props["Label#8876:0"].value);
  },
};
