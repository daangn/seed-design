import type {
  ListItemSuffixIconProperties,
  ListItemPrefixIconProperties,
  ListItemProperties,
} from "@/codegen/component-properties";
import { createElement, defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import * as components from "@/entities/data/__generated__/components";
import type { NormalizedTextNode } from "@/normalizer";
import { findAllInstances, findOne } from "@/utils/figma-node";
import { createLocalSnippetHelper, createSeedReactElement } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";
import { match } from "ts-pattern";

const { createLocalSnippetElement } = createLocalSnippetHelper("list");

const PREFIX_KEYS = {
  checkmark: "563275de82ea1282cece0c35c0cd8d1625bc3a9d",
  radiomark: "51f7c0917ebc559d81e63d0639cb632a792f40de",
  icon: components.componentListItemPrefixIcon.key,
  avatar: "27e33754113178be97e07195528c4ea020b3d3b7",
  image: "d06216ff143a960844799c0b8f9212628f78c69d",
  custom: "b8059f5e0f85e0745fc61ff70f04571177c2cdfc",
};

const SUFFIX_KEYS = {
  checkmark: "385ba8d607029e15e0d38ab415f783016488b185",
  radiomark: "09871d64c5c30407da586fb34425c2e83e147c81",
  chevron: components.componentListItemSuffixChevron.key,
  switch: "0c26bd64e117e168b06eea69be903e4be762a728",
  custom: "26b86c9f8965d38aa5a1181a5cdc89fa487988d1",
  icon: components.componentListItemSuffixIcon.key,
  chevronWithText: components.componentListItemSuffixChevronWithText.key,
  iconButton: metadata.componentListItemSuffixIconButton.key,
  actionButton: metadata.componentListItemSuffixActionButton.key,
};

export const createListItemHandler = (ctx: ComponentHandlerDeps) =>
  defineComponentHandler<ListItemProperties>(metadata.componentListItem.key, (node, traverse) => {
    const { componentProperties: props } = node;

    const { alignItems, title } = match(props.Variants.value)
      .with("Single Line", () => ({ alignItems: undefined, title: props["Title#28452:21"].value }))
      .with("Multi Line", () => ({
        alignItems: "flex-start",
        title: props["Title #28487:0"].value,
      }))
      .exhaustive();

    const detailNode = findOne(
      node,
      (node) => node.type === "TEXT" && node.name === "Sub Text",
    ) as NormalizedTextNode | null;

    const prefixNode = (() => {
      if (props["Has Prefix#28452:85"].value === false) return null;

      for (const key of Object.values(PREFIX_KEYS)) {
        const [found] = findAllInstances<ListItemPrefixIconProperties | {}>({ node, key });

        if (found) return found;
      }

      return null;
    })();

    const prefix = (() => {
      if (!prefixNode) return undefined;

      if ("Icon#28452:111" in prefixNode.componentProperties) {
        return createSeedReactElement("Icon", {
          svg: ctx.iconHandler.transform(prefixNode.componentProperties["Icon#28452:111"]),
        });
      }

      return traverse(prefixNode.children[0]);
    })();

    const suffixNode = (() => {
      if (props["Has Suffix#28452:64"].value === false) return null;

      for (const key of Object.values(SUFFIX_KEYS)) {
        const [found] = findAllInstances<ListItemSuffixIconProperties | {}>({ node, key });

        if (found) return found;
      }

      return null;
    })();

    const suffix = (() => {
      if (!suffixNode) return undefined;

      if ("Icon#28347:9" in suffixNode.componentProperties) {
        return createSeedReactElement("Icon", {
          svg: ctx.iconHandler.transform(suffixNode.componentProperties["Icon#28347:9"]),
        });
      }

      return traverse(suffixNode.children[0]);
    })();

    const disabled = props.State.value === "Disabled";

    const tag = (() => {
      if (suffix?.tag === "Switchmark") {
        return "ListSwitchItem";
      }

      if (prefix?.tag === "Checkmark" || suffix?.tag === "Checkmark") {
        return "ListCheckItem";
      }

      if (prefix?.tag === "Radiomark" || suffix?.tag === "Radiomark") {
        return "ListRadioItem";
      }

      // checkmark/radiomark 없는데 disabled인 경우 Button으로 추측
      if (disabled) {
        return "ListButtonItem";
      }

      return "ListItem";
    })();

    const commonProps = {
      ...(tag === "ListRadioItem" && {
        value: title,
      }),
      alignItems,
      title,
      ...(props["Has Detail#28469:1"].value &&
        detailNode && {
          detail: detailNode.characters,
        }),
      ...(prefix && { prefix }),
      ...(suffix && { suffix }),
      ...(disabled &&
        (tag === "ListButtonItem" ||
          tag === "ListCheckItem" ||
          tag === "ListRadioItem" ||
          tag === "ListSwitchItem") && {
          disabled: true,
        }),
      ...(props.Highlighted.value === "True" && {
        highlighted: true,
      }),
    };

    const comment = match(tag)
      .with("ListItem", () => "목적에 따라 ListButtonItem이나 ListLinkItem으로 바꿔 사용하세요.")
      .with("ListCheckItem", () => `<List as="fieldset">과 함께 사용하세요.`)
      .with("ListRadioItem", () => "<RadioGroup.Root>와 함께 사용하세요.")
      .otherwise(() => undefined);

    const list = createLocalSnippetElement(tag, commonProps, undefined, { comment });

    if (props["Divider#28441:0"].value) {
      return createElement("", {}, [list, createLocalSnippetElement("ListDivider")]);
    }

    return list;
  });
