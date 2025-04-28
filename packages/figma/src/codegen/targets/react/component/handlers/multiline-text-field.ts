import { createElement, defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import type { SeedComponentHandlerDeps } from "../deps.interface";
import type { MultilineTextFieldProperties } from "@/codegen/component-properties";
import { handleSizeProp } from "../size";

export const createMultilineTextFieldHandler = (_ctx: SeedComponentHandlerDeps) =>
  defineComponentHandler<MultilineTextFieldProperties>(
    metadata.multilineTextField.key,
    ({ componentProperties: props }) => {
      const {
        Size: { value: size },
        State: { value: state },
        Filled: { value: filled },
        "Show Header#870:0": { value: showHeader },
        "Label#15327:323": { value: label },
        "Show Indicator#1259:0": { value: showIndicator },
        "Indicator#15327:286": { value: indicator },
        "Placeholder#958:0": { value: placeholder },
        "Filled Text#1304:0": { value: defaultValue },
        "Show Footer#958:25": { value: showFooter },
        "Show Description#958:50": { value: showDescription },
        "Description#15327:212": { value: description },
        "Show Character count#958:75": { value: showCharacterCount },
        "Character Count#15327:360": { value: _characterCount },
        "Max Character Count#15327:175": { value: maxCharacterCount },
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

      const TextFieldChildren = createElement("TextFieldTextarea", inputProps);

      return createElement("TextField", commonProps, TextFieldChildren);
    },
  );
