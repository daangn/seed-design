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

const PREFIX_KEYS = [
  components.componentListItemPrefixCheckbox.key,
  components.componentListItemPrefixRadiomark.key,
  components.componentListItemPrefixIcon.key,
  components.componentListItemPrefixAvatar.key,
  components.componentListItemPrefixImage.key,
  components.componentListItemPrefixCustom.key,
];

const SUFFIX_KEYS = [
  components.componentListItemSuffixCheckbox.key,
  components.componentListItemSuffixRadiomark.key,
  components.componentListItemSuffixChevron.key,
  components.componentListItemSuffixSwitch.key,
  components.componentListItemSuffixCustom.key,
  components.componentListItemSuffixIcon.key,
  components.componentListItemSuffixChevronWithText.key,
  metadata.componentListItemSuffixIconButton.key,
  metadata.componentListItemSuffixActionButton.key,
];

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

      for (const key of PREFIX_KEYS) {
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

      for (const key of SUFFIX_KEYS) {
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
