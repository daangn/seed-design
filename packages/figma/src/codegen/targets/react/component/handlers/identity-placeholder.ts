import type { IdentityPlaceholderProperties } from "@/codegen/component-properties";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { camelCase } from "change-case";
import { createSeedReactElement } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";

export const createIdentityPlaceholderHandler = (_ctx: ComponentHandlerDeps) =>
  defineComponentHandler<IdentityPlaceholderProperties>(
    metadata.identityPlaceholder.key,
    ({ componentProperties: props }) => {
      const commonProps = {
        identity: camelCase(props.Identity.value),
      };

      return createSeedReactElement("IdentityPlaceholder", commonProps);
    },
  );
