import { createElement, defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { findAllInstances } from "@/utils/figma-node";
import type { SeedComponentHandlerDeps } from "../deps.interface";
import type {
  AvatarProperties,
  IdentityPlaceholderProperties,
} from "@/codegen/component-properties";
import { createIdentityPlaceholderHandler } from "./identity-placeholder";

export const createAvatarHandler = (ctx: SeedComponentHandlerDeps) => {
  const identityPlaceholderHandler = createIdentityPlaceholderHandler(ctx);

  return defineComponentHandler<AvatarProperties>(metadata.avatar.key, (node) => {
    const [placeholder] = findAllInstances<IdentityPlaceholderProperties>({
      node,
      key: identityPlaceholderHandler.key,
    });
    const { componentProperties: props } = node;

    const avatarHasSrc = props["Show Image#71850:57"].value;

    const commonProps = {
      ...(avatarHasSrc && {
        // Placeholder
        src: `https://placehold.co/${props.Size.value}x${props.Size.value}`,
      }),
      ...(placeholder && {
        fallback: identityPlaceholderHandler.transform(placeholder),
      }),
      size: props.Size.value,
    };

    return createElement(
      "Avatar",
      commonProps,
      props["Show Badge#1398:26"].value ? createElement("AvatarBadge", {}) : undefined,
      avatarHasSrc ? "alt 텍스트를 제공해야 합니다." : undefined,
    );
  });
};
