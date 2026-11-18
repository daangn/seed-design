import IconXmarkCircleFill from "@karrotmarket/lynx-monochrome-icon/IconXmarkCircleFill";
import { forwardRef, type ComponentRef } from "@lynx-js/react";
import { Icon, SearchInput as SeedSearchInput } from "@seed-design/lynx-react";

export interface SearchInputProps
  extends Omit<SeedSearchInput.RootProps, "children" | "accessibility-label"> {
  placeholder?: string;

  /**
   * The accessible name of the input.
   * @default "검색"
   */
  "accessibility-label"?: string;

  /**
   * The accessible name of the clear button.
   * @default "지우기"
   */
  clearButtonLabel?: string;

  /**
   * Props for the input element, e.g. `maxlength`.
   */
  inputProps?: SeedSearchInput.InputProps;
}

type SearchInputRef = ComponentRef<typeof SeedSearchInput.Input>;

/**
 * @see https://seed-design.io/lynx/components/search-input
 */
export const SearchInput = forwardRef<SearchInputRef, SearchInputProps>(
  (
    {
      placeholder,
      "accessibility-label": accessibilityLabel = "검색",
      clearButtonLabel = "지우기",
      inputProps,
      ...otherProps
    },
    ref,
  ) => {
    return (
      <SeedSearchInput.Root {...otherProps}>
        {/* You may implement your own i18n for the labels */}
        <SeedSearchInput.Input
          ref={ref}
          accessibility-label={accessibilityLabel}
          placeholder={placeholder}
          {...inputProps}
        />
        <SeedSearchInput.ClearButton accessibility-label={clearButtonLabel}>
          <Icon icon={<IconXmarkCircleFill />} />
        </SeedSearchInput.ClearButton>
      </SeedSearchInput.Root>
    );
  },
);
SearchInput.displayName = "SearchInput";
