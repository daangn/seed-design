import { defineComponentTransformer } from "@/codegen/core";
import { camelCase } from "change-case";
import * as metadata from "../../../data/__generated__/component-sets";
import { createElement } from "../../../core/jsx";
import { findAllInstances } from "../../../../utils/figma-node";
import type { ChipTabsItemProperties, ChipTabsProperties } from "../properties.type";
import type { SeedComponentTransformerDeps } from "../deps.interface";

const CHIP_TABS_ITEM_KEY = "fa80168b02051fbb0ba032238bd76d840dbe2e15";
const createChipTabsItemTransformer = (_ctx: SeedComponentTransformerDeps) =>
  defineComponentTransformer<ChipTabsItemProperties>(
    CHIP_TABS_ITEM_KEY,
    ({ componentProperties: props }) => {
      const states = props.State.value.split("-");

      const commonProps = {
        value: props["Label#8876:0"].value,
        ...(states.includes("Disabled") && {
          disabled: true,
        }),
      };

      return createElement("ChipTabsTrigger", commonProps, props["Label#8876:0"].value);
    },
  );

export const createChipTabsTransformer = (ctx: SeedComponentTransformerDeps) => {
  const chipTabsItemTransformer = createChipTabsItemTransformer(ctx);

  return defineComponentTransformer<ChipTabsProperties>(metadata.chipTablist.key, (node) => {
    const chipTabsItems = findAllInstances<ChipTabsItemProperties>({
      node,
      key: chipTabsItemTransformer.key,
    });

    const selectedChipTabsItem = chipTabsItems.find((chipTabsItem) =>
      chipTabsItem.componentProperties.State.value.split("-").includes("Selected"),
    );

    const chipTabsList = createElement(
      "ChipTabsList",
      undefined,
      chipTabsItems.map(chipTabsItemTransformer.transform),
    );

    const commonProps = {
      variant: camelCase(node.componentProperties.Variant.value),
      ...(selectedChipTabsItem && {
        defaultValue: selectedChipTabsItem.componentProperties["Label#8876:0"].value,
      }),
    };

    return createElement("ChipTabs", commonProps, chipTabsList);
  });
};
