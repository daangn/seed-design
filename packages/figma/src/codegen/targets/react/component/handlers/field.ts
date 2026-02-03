import type {
  FieldCharacterCountProperties,
  FieldFooterProperties,
  FieldHeaderProperties,
  FieldIndicatorProperties,
} from "@/codegen/component-properties";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { createSeedReactElement } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";
import { match } from "ts-pattern";
import { findAllInstances } from "@/utils/figma-node";
import { camelCase } from "change-case";

export type FieldHeaderProps = FieldIndicatorProps & {
  label?: string;
  labelWeight?: string;
};

/**
 * NOTE: only gives useful 'props' for field-related components but doesn't give fully functional code.
 */
export const createFieldHeaderHandler = (ctx: ComponentHandlerDeps) => {
  const indicatorHandler = createFieldIndicatorHandler(ctx);

  return defineComponentHandler<FieldHeaderProperties>(
    metadata.componentFieldHeader.key,
    (node, traverse) => {
      const { componentProperties: props } = node;

      const [indicator] = findAllInstances<FieldIndicatorProperties>({
        node,
        key: indicatorHandler.key,
      });

      // only returns some nice common props for Slider, TextField and more
      return createSeedReactElement("__FieldHeader__", {
        label: props["Label#34796:0"].value,
        labelWeight: camelCase(props.Weight.value),
        ...(indicator &&
          (indicatorHandler.transform(indicator, traverse).props as FieldIndicatorProps)),
      } satisfies FieldHeaderProps);
    },
  );
};

type FieldIndicatorProps = {
  required?: boolean;
  showRequiredIndicator?: boolean;
  indicator?: string;
};

/**
 * NOTE: only gives useful 'props' for field-related components but doesn't give fully functional code.
 */
const createFieldIndicatorHandler = (_ctx: ComponentHandlerDeps) => {
  return defineComponentHandler<FieldIndicatorProperties>(
    metadata.privateComponentFieldHeaderIndicator.key,
    ({ componentProperties: props }) => {
      const { required, showRequiredIndicator, indicator } = match(props.Type.value)
        .with("Required Mark", () => ({
          required: true,
          showRequiredIndicator: true,
          indicator: undefined,
        }))
        .with("Text", () => ({
          required: undefined,
          showRequiredIndicator: undefined,
          indicator: props["Required Label#40606:3"].value,
        }))
        .exhaustive();

      // only returns some nice common props for Slider, TextField and more
      return createSeedReactElement("__FieldIndicator__", {
        required,
        showRequiredIndicator,
        indicator,
      } satisfies FieldIndicatorProps);
    },
  );
};

export type FieldFooterProps = FieldCharacterCountProps & {
  description?: string;
  maxGraphemeCount?: number;
  invalid?: boolean;
  errorMessage?: string;
};

/**
 * NOTE: only gives useful 'props' for field-related components but doesn't give fully functional code.
 */
export const createFieldFooterHandler = (ctx: ComponentHandlerDeps) => {
  const characterCountHandler = createFieldCharacterCountHandler(ctx);

  return defineComponentHandler<FieldFooterProperties>(
    metadata.componentFieldFooter.key,
    (node, traverse) => {
      const { componentProperties: props } = node;

      const { description, maxGraphemeCount } = match(props.Type.value)
        .with("Description", () => ({
          description: props["Text#2770:0"].value,
          maxGraphemeCount: undefined,
        }))
        .with("Description With Character Count", () => ({
          description: props["Text#2770:0"].value,
          maxGraphemeCount: undefined,
        }))
        .with("Character Count", () => {
          const [characterCount] = findAllInstances<FieldCharacterCountProperties>({
            node,
            key: characterCountHandler.key,
          });

          return {
            description: undefined,
            ...(characterCount &&
              (characterCountHandler.transform(characterCount, traverse)
                .props as FieldCharacterCountProps)),
          };
        })
        .exhaustive();

      const { errorMessage, invalid } = match(props.Error.value === "true")
        .with(true, () => ({
          invalid: true,
          errorMessage: props["Error Text#32821:0"].value,
        }))
        .with(false, () => ({
          invalid: undefined,
          errorMessage: undefined,
        }))
        .exhaustive();

      // only returns some nice common props for Slider, TextField and more
      return createSeedReactElement("__FieldFooter__", {
        description,
        maxGraphemeCount,
        invalid,
        errorMessage,
      } satisfies FieldFooterProps);
    },
  );
};

type FieldCharacterCountProps = {
  maxGraphemeCount?: number;
};

/**
 * NOTE: only gives useful 'props' for field-related components but doesn't give fully functional code.
 */
const createFieldCharacterCountHandler = (_ctx: ComponentHandlerDeps) => {
  return defineComponentHandler<FieldCharacterCountProperties>(
    metadata.privateComponentFieldFooterCharacterCount.key,
    ({ componentProperties: props }) => {
      // only returns some nice common props for Slider, TextField and more
      return createSeedReactElement("__FieldCharacterCount__", {
        maxGraphemeCount: Number(props["Max Count#40960:4"].value),
      } satisfies FieldCharacterCountProps);
    },
  );
};
