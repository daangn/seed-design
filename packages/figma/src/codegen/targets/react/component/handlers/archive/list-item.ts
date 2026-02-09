import type {
  ListItemSuffixIconProperties,
  ListItemPrefixIconProperties,
  ListItemProperties,
} from "@/codegen/component-properties.archive";
import { createElement, defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/archive/component-sets";
import type { NormalizedTextNode } from "@/normalizer";
import { findAllInstances, findOne } from "@/utils/figma-node";
import { createLocalSnippetHelper, createSeedReactElement } from "../../../element-factories";
import type { ComponentHandlerDeps } from "../../deps.interface";
import { match } from "ts-pattern";

const { createLocalSnippetElement } = createLocalSnippetHelper("list");

const PREFIX_KEYS = {
  checkmark: "f24c9ef42ef08df79483fbae0fa7d9037e566748",
  radiomark: "5a77ad37a2291989dfe77c44ddee9aa39e447f90",
  icon: "0e4c05f097d3fa2dc0cbfdbf8db2662bcf8439ca",
  avatar: "ef0e8bd6c2f92e620acf204bb9a8079ef25a1e5c",
  image: "82239325aa1cb65af7c649fc71a8f2b48fb9b9f3",
  custom: "81f201fc876e38f016ab7427a6b3da000ee919a2",
} as const;

const SUFFIX_KEYS = {
  checkmark: "abf9810103ae6e6afe8fa253ec5f05d6a7304b38",
  radiomark: "0a9464ad270bfd7f56438f62bb0155a25ca146a9",
  chevron: "8c52207687ffed15cd5931d71ed9d196b3358a68",
  switch: "1e933f75dd6bb4b21c3289b5c3b4402d2c623125",
  custom: "3a70bf5bb9856c13893931b7a0df652bcf0be895",
  icon: "4cc7e9b84a8388a36cb3898c6c02e6110a3281b9",
  chevronWithText: "fe0e25f4fecda59d0a3730ead7c5bc0a66a41e7e",
  iconButton: "5636566f6de6f58200dce388f7b1ac9f517b30e1",
  actionButton: "3d788f28c785d1c60b937b253c39ce582dbe1ed3",
} as const;

export const createListItemHandler = (ctx: ComponentHandlerDeps) =>
  defineComponentHandler<ListItemProperties>(metadata.listItem.key, (node, traverse) => {
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
