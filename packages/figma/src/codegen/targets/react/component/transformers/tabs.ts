import { createElement, defineComponentTransformer } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import type { NormalizedInstanceNode } from "@/normalizer";
import { camelCase } from "change-case";
import type { SeedComponentTransformerDeps } from "../deps.interface";
import type {
  TabsFillItemProperties,
  TabsHugItemProperties,
  TabsProperties,
} from "../properties.type";
import { handleSizeProp } from "../size";

const TABS_HUG_ITEM_KEY = "c242492543b327ceb84fa9933841512fc62a898c";
const createTabsHugItemTransformer = (_ctx: SeedComponentTransformerDeps) =>
  defineComponentTransformer<TabsHugItemProperties>(
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

      return createElement("TabsTrigger", commonProps, props["Label#4478:2"].value);
    },
  );

const TABS_FILL_ITEM_KEY = "7275293344efb40ee9a3f5248ba2659b94a0b305";
const createTabsFillItemTransformer = (_ctx: SeedComponentTransformerDeps) =>
  defineComponentTransformer<TabsFillItemProperties>(
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

      return createElement("TabsTrigger", commonProps, props["Label#4478:2"].value);
    },
  );

export const createTabsTransformer = (ctx: SeedComponentTransformerDeps) => {
  const tabsHugItemTransformer = createTabsHugItemTransformer(ctx);
  const tabsFillItemTransformer = createTabsFillItemTransformer(ctx);

  return defineComponentTransformer<TabsProperties>(metadata.tablist.key, (node) => {
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

        if (componentKey === tabsHugItemTransformer.key)
          return {
            triggerLayout: "hug" as const,
            node: child as NormalizedInstanceNode & { componentProperties: TabsHugItemProperties },
          };

        if (componentKey === tabsFillItemTransformer.key)
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

    const tabTriggerList = createElement(
      "TabsList",
      undefined,
      tabsItems.map(({ triggerLayout, node }) => {
        switch (triggerLayout) {
          case "hug":
            return tabsHugItemTransformer.transform(node);
          case "fill":
            return tabsFillItemTransformer.transform(node);
        }
      }),
    );

    const tabContents = tabsItems.map(({ node }) => {
      const value = node.componentProperties["Label#4478:2"].value;

      return createElement("TabsContent", { value }, "{/* TODO: 컨텐츠 추가 */}");
    });

    const commonProps = {
      triggerLayout: camelCase(props.Layout.value),
      size: handleSizeProp(props.Size.value),
      ...(selectedTabsItem && {
        defaultValue: selectedTabsItem.componentProperties["Label#4478:2"].value,
      }),
    };

    return createElement("TabsRoot", commonProps, [tabTriggerList, ...tabContents]);
  });
};
