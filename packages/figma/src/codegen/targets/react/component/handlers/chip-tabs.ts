import type { ChipTabsItemProperties, ChipTabsProperties } from "@/codegen/component-properties";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { findAllInstances } from "@/utils/figma-node";
import { camelCase } from "change-case";
import { createLocalSnippetHelper } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";

const { createLocalSnippetElement } = createLocalSnippetHelper("chip-tabs");

const CHIP_TABS_ITEM_KEY = "fa80168b02051fbb0ba032238bd76d840dbe2e15";
const createChipTabsItemHandler = (_ctx: ComponentHandlerDeps) =>
  defineComponentHandler<ChipTabsItemProperties>(
    CHIP_TABS_ITEM_KEY,
    ({ componentProperties: props }) => {
      const states = props.State.value.split("-");

      const commonProps = {
        value: props["Label#8876:0"].value,
        ...(states.includes("Disabled") && {
          disabled: true,
        }),
      };

      return createLocalSnippetElement("ChipTabsTrigger", commonProps, props["Label#8876:0"].value);
    },
  );

export const createChipTabsHandler = (ctx: ComponentHandlerDeps) => {
  const chipTabsItemHandler = createChipTabsItemHandler(ctx);

  return defineComponentHandler<ChipTabsProperties>(metadata.chipTablist.key, (node) => {
    const chipTabsItems = findAllInstances<ChipTabsItemProperties>({
      node,
      key: chipTabsItemHandler.key,
    });

    const selectedChipTabsItem = chipTabsItems.find((chipTabsItem) =>
      chipTabsItem.componentProperties.State.value.split("-").includes("Selected"),
    );

    const chipTabsList = createLocalSnippetElement(
      "ChipTabsList",
      undefined,
      chipTabsItems.map(chipTabsItemHandler.transform),
    );

    const commonProps = {
      variant: camelCase(node.componentProperties.Variant.value),
      ...(selectedChipTabsItem && {
        defaultValue: selectedChipTabsItem.componentProperties["Label#8876:0"].value,
      }),
    };

    return createLocalSnippetElement("ChipTabs", commonProps, chipTabsList);
  });
};
