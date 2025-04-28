import { defineComponentHandler } from "@/codegen/core";
import { camelCase } from "change-case";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { createElement } from "@/codegen/core";
import type { IdentityPlaceholderProperties } from "@/codegen/component-properties";
import type { ComponentHandlerDeps } from "../deps.interface";

export const createIdentityPlaceholderHandler = (_ctx: ComponentHandlerDeps) =>
  defineComponentHandler<IdentityPlaceholderProperties>(
    metadata.identityPlaceholder.key,
    ({ componentProperties: props }) => {
      const commonProps = {
        identity: camelCase(props.Identity.value),
      };

      return createElement("IdentityPlaceholder", commonProps);
    },
  );
