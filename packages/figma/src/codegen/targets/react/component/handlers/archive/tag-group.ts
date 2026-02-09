import type { TagGroupItemProperties, TagGroupProperties } from "@/codegen/component-properties.archive";
import { defineComponentHandler, type ElementNode } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/archive/component-sets";
import { createLocalSnippetHelper } from "../../../element-factories";
import type { ComponentHandlerDeps } from "../../deps.interface";
import { camelCase } from "change-case";
import { match } from "ts-pattern";
import { findAllInstances } from "@/utils/figma-node";

const { createLocalSnippetElement } = createLocalSnippetHelper("tag-group");

export const createTagGroupHandler = (ctx: ComponentHandlerDeps) => {
  const itemHandler = createTagGroupItemHandler(ctx);

  return defineComponentHandler<TagGroupProperties>(metadata.tagGroup.key, (node, traverse) => {
    const itemNodes = findAllInstances<TagGroupItemProperties>({ node, key: TAG_GROUP_ITEM_KEY });

    const items = itemNodes.map((itemNode) =>
      itemHandler.transform(itemNode, traverse),
    ) as (ElementNode & {
      props: { size?: string; weight?: string; tone?: string };
    })[];

    if (items.length === 0) {
      return createLocalSnippetElement("TagGroupRoot");
    }

    // if size/weight/tone are all the same among item[n].props, lift them up to TagGroupRoot

    const consistent = {
      size: items.map((item) => item.props.size).every((size) => size === items[0].props.size),
      weight: items
        .map((item) => item.props.weight)
        .every((weight) => weight === items[0].props.weight),
      tone: items.map((item) => item.props.tone).every((tone) => tone === items[0].props.tone),
    };

    return createLocalSnippetElement(
      "TagGroupRoot",
      {
        // lift up consistent props
        ...(consistent.size && { size: items[0].props.size }),
        ...(consistent.weight && { weight: items[0].props.weight }),
        ...(consistent.tone && { tone: items[0].props.tone }),
      },
      items.map((item) => ({
        ...item,
        props: {
          // remove lifted props
          ...item.props,
          size: consistent.size ? undefined : item.props.size,
          weight: consistent.weight ? undefined : item.props.weight,
          tone: consistent.tone ? undefined : item.props.tone,
        },
      })),
      { comment: "`truncate` prop을 통해 한 줄로 표시되도록 할 수 있습니다." },
    );
  });
};

const TAG_GROUP_ITEM_KEY = "a7bbc318919053f96be00e509469f6294d6bb6bb";

export const createTagGroupItemHandler = (ctx: ComponentHandlerDeps) =>
  defineComponentHandler<TagGroupItemProperties>(
    TAG_GROUP_ITEM_KEY,
    ({ componentProperties: props }) => {
      const size = match(props.Size.value)
        .with("t2(12pt)", () => "t2")
        .with("t3(13pt)", () => "t3")
        .with("t4(14pt)", () => "t4")
        .exhaustive();

      return createLocalSnippetElement("TagGroupItem", {
        size,
        weight: camelCase(props["Weight"].value),
        tone: camelCase(props["Tone"].value),
        label: props["Label#5409:0"].value,
        ...(props.Layout.value === "Icon First" && {
          prefixIcon: ctx.iconHandler.transform(props["Prefix Icon#47948:0"]),
        }),
        ...(props.Layout.value === "Icon Last" && {
          suffixIcon: ctx.iconHandler.transform(props["Suffix Icon#47948:55"]),
        }),
      });
    },
  );
