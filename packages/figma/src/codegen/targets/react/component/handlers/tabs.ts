import type {
  TabsFillItemProperties,
  TabsHugItemProperties,
  TabsProperties,
} from "@/codegen/component-properties";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import type { NormalizedInstanceNode } from "@/normalizer";
import { camelCase } from "change-case";
import { createLocalSnippetHelper } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";
import { handleSizeProp } from "../size";

const { createLocalSnippetElement } = createLocalSnippetHelper("tabs");

const TABS_HUG_ITEM_KEY = "c242492543b327ceb84fa9933841512fc62a898c";
const createTabsHugItemHandler = (_ctx: ComponentHandlerDeps) =>
  defineComponentHandler<TabsHugItemProperties>(
    TABS_HUG_ITEM_KEY,
    ({ componentProperties: props }) => {
      const states = props.State.value.split("-");

      const commonProps = {
        value: props["Label#4478:2"].value,
        ...(props.Notification.value === "True" && {
          alert: true,
        }),
        ...(states.includes("Disabled") && {
          disabled: true,
        }),
      };

      return createLocalSnippetElement("TabsTrigger", commonProps, props["Label#4478:2"].value);
    },
  );

const TABS_FILL_ITEM_KEY = "7275293344efb40ee9a3f5248ba2659b94a0b305";
const createTabsFillItemHandler = (_ctx: ComponentHandlerDeps) =>
  defineComponentHandler<TabsFillItemProperties>(
    TABS_FILL_ITEM_KEY,
    ({ componentProperties: props }) => {
      const states = props.State.value.split("-");

      const commonProps = {
        value: props["Label#4478:2"].value,
        ...(props.Notification.value === "True" && {
          alert: true,
        }),
        ...(states.includes("Disabled") && {
          disabled: true,
        }),
      };

      return createLocalSnippetElement("TabsTrigger", commonProps, props["Label#4478:2"].value);
    },
  );

export const createTabsHandler = (ctx: ComponentHandlerDeps) => {
  const tabsHugItemHandler = createTabsHugItemHandler(ctx);
  const tabsFillItemHandler = createTabsFillItemHandler(ctx);

  return defineComponentHandler<TabsProperties>(metadata.tablist.key, (node) => {
    const { componentProperties: props, children } = node;

    const mappedItems = children.map(
      (
        child,
      ): {
        triggerLayout: "hug" | "fill";
        node: NormalizedInstanceNode & {
          componentProperties: TabsHugItemProperties | TabsFillItemProperties;
        };
      } | null => {
        if (child.type !== "INSTANCE") return null;

        const componentKey = child.componentSetKey ? child.componentSetKey : child.componentKey;

        if (componentKey === tabsHugItemHandler.key)
          return {
            triggerLayout: "hug" as const,
            node: child as NormalizedInstanceNode & { componentProperties: TabsHugItemProperties },
          };

        if (componentKey === tabsFillItemHandler.key)
          return {
            triggerLayout: "fill" as const,
            node: child as NormalizedInstanceNode & { componentProperties: TabsFillItemProperties },
          };

        return null;
      },
    );

    const tabsItems = mappedItems.filter(
      (item): item is NonNullable<(typeof mappedItems)[number]> => item !== null,
    );

    const selectedTabsItem = tabsItems.find(({ node: { componentProperties } }) =>
      componentProperties.State.value.split("-").includes("Selected"),
    )?.node;

    const tabTriggerList = createLocalSnippetElement(
      "TabsList",
      undefined,
      tabsItems.map(({ triggerLayout, node }) => {
        switch (triggerLayout) {
          case "hug":
            return tabsHugItemHandler.transform(node);
          case "fill":
            return tabsFillItemHandler.transform(node);
        }
      }),
    );

    const tabContents = tabsItems.map(({ node }) => {
      const value = node.componentProperties["Label#4478:2"].value;

      return createLocalSnippetElement("TabsContent", { value }, "{/* TODO: 컨텐츠 추가 */}");
    });

    const commonProps = {
      triggerLayout: camelCase(props.Layout.value),
      size: handleSizeProp(props.Size.value),
      ...(selectedTabsItem && {
        defaultValue: selectedTabsItem.componentProperties["Label#4478:2"].value,
      }),
    };

    return createLocalSnippetElement("TabsRoot", commonProps, [tabTriggerList, ...tabContents]);
  });
};
