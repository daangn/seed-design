import { camelCase } from "change-case";
import * as metadata from "../../data/__generated__/component-sets";
import { createElement } from "../../jsx";
import type { NormalizedInstanceNode } from "../../normalizer/types";
import { handleSize } from "../properties";
import type { TabsFillItemProperties, TabsHugItemProperties, TabsProperties } from "../type";
import type { ComponentHandler } from "../type-helper";

export const tabsHandler: ComponentHandler<TabsProperties> = {
  key: metadata.tablist.key,
  codegen: async ({ componentProperties: props, children }) => {
    const tabsItems = children
      .map((child) => {
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
      })
      .filter((tabsItem) => tabsItem !== null);

    const selectedTabsItem = tabsItems.find(({ node: { componentProperties } }) =>
      componentProperties.State.value.split("-").includes("Selected"),
    )?.node;

    const tabTriggerList = createElement(
      "TabsList",
      undefined,
      await Promise.all(
        tabsItems.map(({ triggerLayout, node }) => {
          switch (triggerLayout) {
            case "hug":
              return tabsHugItemHandler.codegen(node);
            case "fill":
              return tabsFillItemHandler.codegen(node);
          }
        }),
      ),
    );

    const tabContents = tabsItems.map(({ node }) => {
      const value = node.componentProperties["Label#4478:2"].value;

      return createElement("TabsContent", { value }, "{/* TODO: 컨텐츠 추가 */}");
    });

    const commonProps = {
      triggerLayout: camelCase(props.Layout.value),
      size: handleSize(props.Size.value),
      ...(selectedTabsItem && {
        defaultValue: selectedTabsItem.componentProperties["Label#4478:2"].value,
      }),
    };

    return createElement("TabsRoot", commonProps, [tabTriggerList, ...tabContents]);
  },
};

const tabsHugItemHandler: ComponentHandler<TabsHugItemProperties> = {
  key: "c242492543b327ceb84fa9933841512fc62a898c",
  codegen: async ({ componentProperties: props }) => {
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
};

const tabsFillItemHandler: ComponentHandler<TabsFillItemProperties> = {
  key: "7275293344efb40ee9a3f5248ba2659b94a0b305",
  codegen: async ({ componentProperties: props }) => {
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
};
