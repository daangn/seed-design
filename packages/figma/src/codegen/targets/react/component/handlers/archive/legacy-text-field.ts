import type {
  LegacyMultilineTextFieldProperties,
  LegacyTextFieldProperties,
} from "@/codegen/component-properties.archive";
import { defineComponentHandler } from "@/codegen/core";
import { createLocalSnippetHelper } from "../../../element-factories";
import type { ComponentHandlerDeps } from "../../deps.interface";
import { handleSizeProp } from "../../size";

const { createLocalSnippetElement } = createLocalSnippetHelper("text-field");

const LEGACY_TEXT_FIELD_KEY = "c49873c37a639f0dffdea4efd0eb43760d66c141";
const LEGACY_MULTILINE_TEXT_FIELD_KEY = "88b2399c930c85f9ce2972163a078bc684b84bbe";

export const createLegacyTextFieldHandler = (ctx: ComponentHandlerDeps) =>
  defineComponentHandler<LegacyTextFieldProperties>(
    LEGACY_TEXT_FIELD_KEY,
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

      return createLocalSnippetElement("TextField", commonProps, TextFieldChildren, {
        comment:
          "이 Figma 컴포넌트는 @seed-design/react@1.1보다 낮은 버전의 TextField입니다. 신규 컴포넌트로 교체할 수 있습니다.",
      });
    },
  );

export const createLegacyMultilineTextFieldHandler = (_ctx: ComponentHandlerDeps) =>
  defineComponentHandler<LegacyMultilineTextFieldProperties>(
    LEGACY_MULTILINE_TEXT_FIELD_KEY,
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

      const TextFieldChildren = createLocalSnippetElement("TextFieldTextarea", inputProps);

      return createLocalSnippetElement("TextField", commonProps, TextFieldChildren, {
        comment:
          "이 Figma 컴포넌트는 @seed-design/react@1.1보다 낮은 버전의 TextField입니다. 신규 컴포넌트로 교체할 수 있습니다.",
      });
    },
  );
