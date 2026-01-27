import type {
  AvatarProperties,
  IdentityPlaceholderProperties,
} from "@/codegen/component-properties.archive";
import { createElement, defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/archive/component-sets";
import { findAllInstances } from "@/utils/figma-node";
import { createLocalSnippetHelper } from "../../../element-factories";
import type { ComponentHandlerDeps } from "../../deps.interface";
import { createIdentityPlaceholderHandler } from "./identity-placeholder";
import { camelCase } from "change-case";

const { createLocalSnippetElement } = createLocalSnippetHelper("avatar");

export const createAvatarHandler = (ctx: ComponentHandlerDeps) => {
  const identityPlaceholderHandler = createIdentityPlaceholderHandler(ctx);

  return defineComponentHandler<AvatarProperties>(metadata.avatar.key, (node, traverse) => {
    const [placeholder] = findAllInstances<IdentityPlaceholderProperties>({
      node,
      key: identityPlaceholderHandler.key,
    });
    const { componentProperties: props } = node;

    const avatarHasSrc = props["Has Image Contents#33407:0"].value;

    const commonProps = {
      ...(avatarHasSrc && {
        // Placeholder
        src: `https://placehold.co/${props.Size.value}x${props.Size.value}`,
      }),
      ...(placeholder && {
        fallback: identityPlaceholderHandler.transform(placeholder, traverse),
      }),
      ...(props["Badge"].value !== "None" && {
        badgeMask: camelCase(props["Badge"].value),
      }),
      size: props.Size.value,
    };

    return createLocalSnippetElement(
      "Avatar",
      commonProps,
      props["Badge"].value === "None"
        ? undefined
        : createLocalSnippetElement(
            "AvatarBadge",
            { asChild: true },
            createElement("img", { src: "https://placehold.co/20x20" }),
            { comment: "뱃지를 설명하는 alt 텍스트를 제공해야 합니다." },
          ),
      { comment: avatarHasSrc ? "alt 텍스트를 제공해야 합니다." : undefined },
    );
  });
};
