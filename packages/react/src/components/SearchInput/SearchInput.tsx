import { mergeProps } from "@seed-design/dom-utils";
import { searchInput, type SearchInputVariantProps } from "@seed-design/css/recipes/search-input";
import { TextField } from "@seed-design/react-text-field";
import clsx from "clsx";
import type * as React from "react";
import { createContext, forwardRef, useContext } from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";

const { withProvider, withContext, useClassNames } = createSlotRecipeContext(searchInput);

interface SearchInputSubmitContextValue {
  onSubmit?: (value: string) => void;
  blurOnSubmit: boolean;
}

const SearchInputSubmitContext = createContext<SearchInputSubmitContextValue>({
  blurOnSubmit: true,
});

////////////////////////////////////////////////////////////////////////////////////

export interface SearchInputRootProps
  extends SearchInputVariantProps,
    Omit<TextField.RootProps, "onSubmit"> {
  /**
   * Called with the current value when Enter is pressed.
   * Enter that confirms an IME composition (e.g. Korean input) is ignored.
   */
  onSubmit?: (value: string) => void;

  /**
   * Whether to blur the input after submitting, which also dismisses the on-screen keyboard.
   * @default true
   */
  blurOnSubmit?: boolean;
}

export const SearchInputRoot = withProvider<HTMLDivElement, SearchInputRootProps>(
  forwardRef<HTMLDivElement, SearchInputRootProps>(
    ({ onSubmit, blurOnSubmit = true, ...otherProps }, ref) => (
      <SearchInputSubmitContext.Provider value={{ onSubmit, blurOnSubmit }}>
        <TextField.Root ref={ref} role="search" {...otherProps} />
      </SearchInputSubmitContext.Provider>
    ),
  ),
  "root",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SearchInputInputProps extends TextField.InputProps {}

export const SearchInputInput = forwardRef<HTMLInputElement, SearchInputInputProps>(
  ({ className, ...otherProps }, ref) => {
    const classNames = useClassNames();
    const { onSubmit, blurOnSubmit } = useContext(SearchInputSubmitContext);

    if (!otherProps["aria-label"] && !otherProps["aria-labelledby"]) {
      console.warn(
        "SearchInputInput: Please provide `aria-label` or `aria-labelledby` for accessibility.",
      );
    }

    const mergedProps = mergeProps(
      {
        type: "search",
        enterKeyHint: "search",
        onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
          if (event.key !== "Enter") return;
          // Enter that confirms an IME composition is not a submit. Safari reports `isComposing: false`
          // for that Enter but still sets `keyCode` to 229.
          if (event.nativeEvent.isComposing || event.keyCode === 229) return;

          onSubmit?.(event.currentTarget.value);

          if (blurOnSubmit) {
            event.currentTarget.blur();
          }
        },
      } satisfies TextField.InputProps,
      otherProps,
    );

    return (
      <TextField.Input ref={ref} {...mergedProps} className={clsx(classNames.value, className)} />
    );
  },
);
SearchInputInput.displayName = "SearchInputInput";

////////////////////////////////////////////////////////////////////////////////////

export interface SearchInputClearButtonProps extends TextField.ClearButtonProps {}

/**
 * Renders nothing while the value is empty. Keeps the input focused if it was focused.
 */
export const SearchInputClearButton = withContext<HTMLButtonElement, SearchInputClearButtonProps>(
  forwardRef<HTMLButtonElement, SearchInputClearButtonProps>((props, ref) => {
    if (!props["aria-label"] && !props["aria-labelledby"]) {
      console.warn(
        "SearchInputClearButton: Please provide `aria-label` or `aria-labelledby` for accessibility.",
      );
    }

    return <TextField.ClearButton ref={ref} {...props} />;
  }),
  "clearButton",
);
