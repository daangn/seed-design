import type { AvatarProperties, ChipProperties } from "@/codegen/component-properties";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { match } from "ts-pattern";
import { createLocalSnippetHelper } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";
import { handleSizeProp } from "../size";
import { camelCase } from "change-case";
import { findAllInstances } from "@/utils/figma-node";
import { createAvatarHandler } from "@/codegen/targets/react/component/handlers/avatar";

const { createLocalSnippetElement } = createLocalSnippetHelper("chip");

export const createChipHandler = (ctx: ComponentHandlerDeps) => {
  const avatarHandler = createAvatarHandler(ctx);

  return defineComponentHandler<ChipProperties>(metadata.chip.key, (node, traverse) => {
    const props = node.componentProperties;
    const states = props.State.value.split("-");

    const prefix = match(props["Prefix Type"].value)
      .with("None", "Image", () => undefined)
      .with("Icon", () =>
        createLocalSnippetElement(
          "Chip.PrefixIcon",
          undefined,
          ctx.iconHandler.transform(props["Prefix Icon#8722:0"]),
        ),
      )
      .with("Avatar", () => {
        const [avatar] = findAllInstances<AvatarProperties>({ node, key: metadata.avatar.key });
        if (!avatar) return undefined;

        return createLocalSnippetElement(
          "Chip.PrefixAvatar",
          undefined,
          avatarHandler.transform(avatar, traverse),
        );
      })
      .exhaustive();

    const suffix = props["Has Suffix#32538:181"].value
      ? createLocalSnippetElement(
          "Chip.SuffixIcon",
          undefined,
          ctx.iconHandler.transform(props["Suffix Type#32538:0"]),
        )
      : undefined;

    const commonProps = {
      variant: camelCase(props.Variant.value),
      size: handleSizeProp(props.Size.value),
      layout: props["Label#7185:0"].value ? "withText" : "iconOnly",
      ...(states.includes("Disabled") && {
        disabled: true,
      }),
    };

    return createLocalSnippetElement(
      "Chip.Button",
      commonProps,
      [prefix, props["Label#7185:0"].value, suffix],
      { comment: "목적에 따라 Chip.Toggle, Chip.RadioItem 등으로도 사용할 수 있습니다." },
    );
  });
};
