import { createElement, defineComponentTransformer } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { findAllInstances } from "@/utils/figma-node";
import type { SeedComponentTransformerDeps } from "../deps.interface";
import type { AvatarProperties, AvatarStackProperties } from "../properties.type";
import { createAvatarTransformer } from "./avatar";

export const createAvatarStackTransformer = (ctx: SeedComponentTransformerDeps) => {
  const avatarTransformer = createAvatarTransformer(ctx);

  return defineComponentTransformer<AvatarStackProperties>(metadata.avatarStack.key, (node) => {
    const avatarNodes = findAllInstances<AvatarProperties>({
      node,
      key: avatarTransformer.key,
    });

    const { componentProperties: props } = node;

    const commonProps = {
      size: props.Size.value,
      // TODO: 구현될 예정
      // topItem: camelCase(props["Top Item"].value),
    };

    const avatarStackChildren = avatarNodes.map(avatarTransformer.transform);

    return createElement("AvatarStack", commonProps, avatarStackChildren);
  });
};
