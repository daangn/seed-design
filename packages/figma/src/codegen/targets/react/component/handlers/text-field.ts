import type { TextFieldProperties } from "@/codegen/component-properties";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { createLocalSnippetHelper } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";
import { handleSizeProp } from "../size";

const { createLocalSnippetElement } = createLocalSnippetHelper("text-field");

export const createTextFieldHandler = (ctx: ComponentHandlerDeps) =>
  defineComponentHandler<TextFieldProperties>(
    metadata.textField.key,
    ({ componentProperties: props }) => {
      const {
        Size: { value: size },
        State: { value: state },
        Filled: { value: filled },
        "Show Header#870:0": { value: showHeader },
        "Label#14964:0": { value: label },
        "Show Indicator#1259:0": { value: showIndicator },
        "Indicator#15327:249": { value: indicator },
        "Show Prefix#958:125": { value: showPrefix },
        "Show Prefix Icon#1267:50": { value: showPrefixIcon },
        "Prefix Icon#1267:25": prefixIcon,
        "Show Prefix Text#1267:0": { value: showPrefixText },
        "Prefix Text#15327:101": { value: prefix },
        "Placeholder#958:0": { value: placeholder },
        "Filled Text#1304:0": { value: defaultValue },
        "Show Suffix#958:100": { value: showSuffix },
        "Show Suffix Icon#1267:75": { value: showSuffixIcon },
        "Suffix Icon #1267:100": suffixIcon,
        "Show Suffix Text#1267:125": { value: showSuffixText },
        "Suffix Text#15327:138": { value: suffix },
        "Show Footer#958:25": { value: showFooter },
        "Show Description#958:50": { value: showDescription },
        "Description#12626:5": { value: description },
        "Show Character Count#958:75": { value: showCharacterCount },
        "Character Count#15327:64": { value: _characterCount },
        "Max Character Count#15327:27": { value: maxCharacterCount },
      } = props;

      const states = state.split("-");

      const commonProps = {
        size: handleSizeProp(size),
        // header
        ...(showHeader && {
          label,
        }),
        ...(showHeader &&
          showIndicator && {
            indicator,
          }),
        // input affixes
        ...(showPrefix &&
          showPrefixIcon && {
            prefixIcon: ctx.iconHandler.transform(prefixIcon),
          }),
        ...(showPrefix &&
          showPrefixText && {
            prefix,
          }),
        ...(showSuffix &&
          showSuffixIcon && {
            suffixIcon: ctx.iconHandler.transform(suffixIcon),
          }),
        ...(showSuffix &&
          showSuffixText && {
            suffix,
          }),
        // input
        ...(filled === "True" && {
          defaultValue,
        }),
        ...(states.includes("Invalid") && {
          invalid: true,
        }),
        ...(states.includes("Disabled") && {
          disabled: true,
        }),
        ...(states.includes("Read Only") && {
          readOnly: true,
        }),
        // footer
        ...(showFooter &&
          showDescription &&
          states.includes("Invalid") && {
            // invalid인 경우 description을 error로 사용
            errorMessage: description,
          }),
        ...(showFooter &&
          showDescription &&
          !states.includes("Invalid") && {
            // invalid가 아닌 경우 description을 description으로 사용
            description,
          }),
        ...(showFooter &&
          showCharacterCount && {
            maxGraphemeCount: Number(maxCharacterCount),
          }),
      };

      const inputProps = {
        placeholder,
      };

      const TextFieldChildren = createLocalSnippetElement("TextFieldInput", inputProps);

      return createLocalSnippetElement("TextField", commonProps, TextFieldChildren);
    },
  );
