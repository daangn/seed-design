import { createLocalSnippetHelper } from "../../../element-factories";
import type {
  ChipProperties,
  ChipTabsTriggerProperties,
  TabsChipWrapperProperties,
  TabsLineTriggerFillProperties,
  TabsLineTriggerHugProperties,
  TabsLineWrapperProperties,
  TabsProperties,
} from "@/codegen/component-properties.archive";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/archive/component-sets";
import { camelCase } from "change-case";
import type { ComponentHandlerDeps } from "../../deps.interface";
import { handleSizeProp } from "../../size";
import { match } from "ts-pattern";
import { findAllInstances } from "@/utils/figma-node";

const { createLocalSnippetElement: createTabsLocalSnippetElement } =
  createLocalSnippetHelper("tabs");

const { createLocalSnippetElement: createChipTabsLocalSnippetElement } =
  createLocalSnippetHelper("chip-tabs");

const LINE_TABS_WRAPPER_KEY = "e114161387f800d3668d0585bed1d109e4edcbe4";
const CHIP_TABS_WRAPPER_KEY = "d7cf2983c79c8394aaab0185af83a9d1b9d10ece";

export const createTabsHandler = (_ctx: ComponentHandlerDeps) => {
  const lineHandler = createLineTabsHandler(_ctx);
  const chipHandler = createChipTabsHandler(_ctx);

  return defineComponentHandler<TabsProperties>(metadata.tabs.key, (node, traverse) => {
    const props = node.componentProperties;

    const elementNode = match(props.Variant.value)
      .with("Line", () => {
        const [wrapper] = findAllInstances<TabsLineWrapperProperties>({
          node,
          key: LINE_TABS_WRAPPER_KEY,
        });

        if (!wrapper) throw new Error("Line Tab wrapper not found");

        return lineHandler.transform(wrapper, traverse);
      })
      .with("Chip", () => {
        const [wrapper] = findAllInstances<TabsChipWrapperProperties>({
          node,
          key: CHIP_TABS_WRAPPER_KEY,
        });

        if (!wrapper) throw new Error("Chip Tab wrapper not found");

        return chipHandler.transform(wrapper, traverse);
      })
      .exhaustive();

    return elementNode;
  });
};

/*
<TabsRoot defaultValue="2" triggerLayout="fill">
  <TabsList>
    <TabsTrigger value="1">라벨1</TabsTrigger>
    <TabsTrigger value="2">라벨2</TabsTrigger>
    <TabsTrigger value="3">라벨3</TabsTrigger>
  </TabsList>
  <TabsCarousel>
    <TabsContent value="1">
      <Content>Content 1</Content>
    </TabsContent>
    <TabsContent value="2">
      <Content>Content 2</Content>
    </TabsContent>
    <TabsContent value="3">
      <Content>Content 3</Content>
    </TabsContent>
  </TabsCarousel>
</TabsRoot>
*/

const LINE_TABS_HUG_ITEM_KEY = "946cc52671ac3f46e20a8ff12fcc1c7f618da675";
const LINE_TABS_FILL_ITEM_KEY = "78039b6b86852b685a6e93e9b6743b9e577cd7db";

const createLineTabsHandler = (_ctx: ComponentHandlerDeps) => {
  const hugHandler = createLineTriggerHugHandler(_ctx);
  const fillHandler = createLineTriggerFillHandler(_ctx);

  return defineComponentHandler<TabsLineWrapperProperties>(
    LINE_TABS_WRAPPER_KEY,
    (node, traverse) => {
      const props = node.componentProperties;

      const { triggers, defaultValue } = match(props.Layout.value)
        .with("Hug", () => {
          const nodes = findAllInstances<TabsLineTriggerHugProperties>({
            node,
            key: LINE_TABS_HUG_ITEM_KEY,
          });

          return {
            triggers: nodes.map((node) => ({
              elementNode: hugHandler.transform(node, traverse),
              value: node.componentProperties["Label#4478:2"].value,
            })),
            defaultValue: nodes.find((node) => node.componentProperties.State.value === "Selected")
              ?.componentProperties["Label#4478:2"].value,
          };
        })
        .with("Fill", () => {
          const nodes = findAllInstances<TabsLineTriggerFillProperties>({
            node,
            key: LINE_TABS_FILL_ITEM_KEY,
          });

          return {
            triggers: nodes.map((node) => ({
              elementNode: fillHandler.transform(node, traverse),
              value: node.componentProperties["Label#4478:2"].value,
            })),
            defaultValue: nodes.find((node) => node.componentProperties.State.value === "Selected")
              ?.componentProperties["Label#4478:2"].value,
          };
        })
        .exhaustive();

      const rootProps = {
        triggerLayout: camelCase(props.Layout.value),
        size: handleSizeProp(props.Size.value),
        defaultValue,
      };

      const tabsCarousel = createTabsLocalSnippetElement(
        "TabsCarousel",
        undefined,
        triggers.map(({ value }) => createTabsLocalSnippetElement("TabsContent", { value }, value)),
      );

      const tabsList = createTabsLocalSnippetElement(
        "TabsList",
        undefined,
        triggers.map(({ elementNode }) => elementNode),
      );

      return createTabsLocalSnippetElement("TabsRoot", rootProps, [tabsList, tabsCarousel]);
    },
  );
};

const LINE_TRIGGER_HUG_KEY = "946cc52671ac3f46e20a8ff12fcc1c7f618da675";

const createLineTriggerHugHandler = (_ctx: ComponentHandlerDeps) =>
  defineComponentHandler<TabsLineTriggerHugProperties>(
    LINE_TRIGGER_HUG_KEY,
    ({ componentProperties: props }) => {
      const commonProps = {
        value: props["Label#4478:2"].value,
        ...(props.State.value === "Disabled" && {
          disabled: true,
        }),
        ...(props["Has Notification#32892:0"].value && {
          notification: true,
        }),
      };

      return createTabsLocalSnippetElement("TabsTrigger", commonProps);
    },
  );

const LINE_TRIGGER_FILL_KEY = "78039b6b86852b685a6e93e9b6743b9e577cd7db";

const createLineTriggerFillHandler = (_ctx: ComponentHandlerDeps) =>
  defineComponentHandler<TabsLineTriggerFillProperties>(
    LINE_TRIGGER_FILL_KEY,
    ({ componentProperties: props }) => {
      const commonProps = {
        value: props["Label#4478:2"].value,
        ...(props.State.value === "Disabled" && {
          disabled: true,
        }),
        ...(props["Has Notification#32904:13"].value && {
          notification: true,
        }),
      };

      return createTabsLocalSnippetElement("TabsTrigger", commonProps);
    },
  );

/*
<ChipTabsRoot
  variant="neutralOutline"
  defaultValue="1"
>
  <ChipTabsList>
    <ChipTabsTrigger value="1">라벨1</ChipTabsTrigger>
    <ChipTabsTrigger value="2">라벨2</ChipTabsTrigger>
    <ChipTabsTrigger value="3">라벨3</ChipTabsTrigger>
  </ChipTabsList>
  <ChipTabsCarousel>
    <ChipTabsContent value="1">
      <Content>Content 1</Content>
    </ChipTabsContent>
    <ChipTabsContent value="2">
      <Content>Content 2</Content>
    </ChipTabsContent>
    <ChipTabsContent value="3">
      <Content>Content 3</Content>
    </ChipTabsContent>
  </ChipTabsCarousel>
</ChipTabsRoot>
*/

const createChipTabsHandler = (_ctx: ComponentHandlerDeps) => {
  const triggerHandler = createChipTabsTriggerHandler(_ctx);

  return defineComponentHandler<TabsChipWrapperProperties>(
    CHIP_TABS_WRAPPER_KEY,
    (node, traverse) => {
      const props = node.componentProperties;

      const nodes = findAllInstances<ChipTabsTriggerProperties>({ node, key: CHIP_TRIGGER_KEY });

      const triggers = nodes.map((node) => {
        // this is redundant; can this be better?
        const [chip] = findAllInstances<ChipProperties>({ node, key: metadata.chip.key });
        if (!chip) throw new Error("Chip not found in ChipTabsTrigger");

        return {
          elementNode: triggerHandler.transform(node, traverse),
          value: chip.componentProperties["Label#7185:0"].value,
        };
      });

      const selectedTrigger = nodes.find(
        (node) => node.componentProperties.State.value === "Selected",
      );
      const [selectedChip] = selectedTrigger
        ? findAllInstances<ChipProperties>({ node: selectedTrigger, key: metadata.chip.key })
        : [undefined];
      if (!selectedChip) throw new Error("Chip not found in ChipTabsTrigger");

      const defaultValue = selectedChip.componentProperties["Label#7185:0"].value;

      const variant = match(props.Variant.value)
        .with("Outline", () => "neutralOutline")
        .with("Solid", () => "neutralSolid")
        .exhaustive();

      const rootProps = {
        size: handleSizeProp(props.Size.value),
        variant,
        defaultValue,
      };

      const tabsCarousel = createChipTabsLocalSnippetElement(
        "ChipTabsCarousel",
        { swipeable: false },
        triggers.map(({ value }) =>
          createChipTabsLocalSnippetElement("ChipTabsContent", { value }, value),
        ),
      );

      const tabsList = createChipTabsLocalSnippetElement(
        "ChipTabsList",
        undefined,
        triggers.map(({ elementNode }) => elementNode),
      );

      return createChipTabsLocalSnippetElement("ChipTabsRoot", rootProps, [tabsList, tabsCarousel]);
    },
  );
};

const CHIP_TRIGGER_KEY = "95bf31a329f9e8bba0d9aa2299d1552f1d388148";

const createChipTabsTriggerHandler = (_ctx: ComponentHandlerDeps) =>
  defineComponentHandler<ChipTabsTriggerProperties>(CHIP_TRIGGER_KEY, (node) => {
    const [chip] = findAllInstances<ChipProperties>({ node, key: metadata.chip.key });
    if (!chip) throw new Error("Chip not found in ChipTabsTrigger");

    const props = node.componentProperties;
    const chipProps = chip.componentProperties;

    const commonProps = {
      value: chipProps["Label#7185:0"].value,
      ...(chipProps.State.value === "Disabled" && {
        disabled: true,
      }),
      ...(props["Has Notification"].value === "True" && {
        notification: true,
      }),
    };

    return createChipTabsLocalSnippetElement("ChipTabsTrigger", commonProps);
  });
