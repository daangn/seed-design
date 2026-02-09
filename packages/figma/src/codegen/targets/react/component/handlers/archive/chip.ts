import type {
  AvatarProperties,
  ChipIconSuffixProperties,
  ChipProperties,
} from "@/codegen/component-properties.archive";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/archive/component-sets";
import { match } from "ts-pattern";
import { createLocalSnippetHelper, createSeedReactElement } from "../../../element-factories";
import type { ComponentHandlerDeps } from "../../deps.interface";
import { handleSizeProp } from "../../size";
import { camelCase } from "change-case";
import { findAllInstances } from "@/utils/figma-node";
import { createAvatarHandler } from "@/codegen/targets/react/component/handlers/archive/avatar";

const { createLocalSnippetElement } = createLocalSnippetHelper("chip");

const CHIP_ICON_SUFFIX_KEY = "27343e0e5ab2c66948e9b10fde03d58b5e037212";
const createChipIconSuffixHandler = (ctx: ComponentHandlerDeps) => {
  return defineComponentHandler<ChipIconSuffixProperties>(
    CHIP_ICON_SUFFIX_KEY,
    ({ componentProperties }) => {
      return createLocalSnippetElement(
        "Chip.SuffixIcon",
        undefined,
        createSeedReactElement("Icon", {
          svg: ctx.iconHandler.transform(componentProperties["Icon#33203:0"]),
        }),
      );
    },
  );
};

export const createChipHandler = (ctx: ComponentHandlerDeps) => {
  const avatarHandler = createAvatarHandler(ctx);
  const iconSuffixHandler = createChipIconSuffixHandler(ctx);

  return defineComponentHandler<ChipProperties>(metadata.chip.key, (node, traverse) => {
    const props = node.componentProperties;

    const prefix = match(props["Prefix Type"].value)
      .with("None", "Image", () => undefined)
      .with("Icon", () =>
        createLocalSnippetElement(
          "Chip.PrefixIcon",
          undefined,
          createSeedReactElement("Icon", {
            svg: ctx.iconHandler.transform(props["Prefix Icon#8722:0"]),
          }),
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

    const label = createLocalSnippetElement("Chip.Label", undefined, props["Label#7185:0"].value);

    const [suffixIcon] = findAllInstances<ChipIconSuffixProperties>({
      node,
      key: CHIP_ICON_SUFFIX_KEY,
    });

    const commonProps = {
      variant: camelCase(props.Variant.value),
      size: handleSizeProp(props.Size.value),
      layout: props["Label#7185:0"].value ? "withText" : "iconOnly",
      ...(props.Selected.value === "True" && {
        defaultChecked: true,
      }),
      ...(props.State.value === "Disabled" && {
        disabled: true,
      }),
    };

    return createLocalSnippetElement(
      "Chip.Toggle",
      commonProps,
      [prefix, label, suffixIcon ? iconSuffixHandler.transform(suffixIcon, traverse) : undefined],
      { comment: "목적에 따라 Chip.Button, Chip.RadioItem 등으로 바꿔 사용하세요." },
    );
  });
};
