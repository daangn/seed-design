import IconXmarkCircleFill from "@karrotmarket/lynx-monochrome-icon/IconXmarkCircleFill";
import { forwardRef, type ComponentRef, type ReactNode } from "@lynx-js/react";
import { Icon, SearchInput } from "@seed-design/lynx-react";
import {
  AppBar,
  AppBarBackButton,
  AppBarLeft,
  AppBarRight,
  AppBarSlot,
  AppBarTextButton,
  type AppBarProps,
} from "./app-bar";

export interface SearchBarProps extends Omit<SearchInput.RootProps, "children"> {
  placeholder?: string;

  /**
   * Shows the back button and is called when it is tapped.
   * Lynx has no navigation stack, so the screen decides what going back means.
   */
  onBack?: () => void;

  /**
   * Called when the close button is tapped.
   */
  onClose: () => void;

  /**
   * @default "닫기"
   */
  closeLabel?: ReactNode;

  inputProps?: SearchInput.InputProps;

  /**
   * Props for the App Bar, such as `theme`.
   */
  appBarProps?: Omit<AppBarProps, "children">;
}

type SearchInputRef = ComponentRef<typeof SearchInput.Input>;

/**
 * @see https://seed-design.io/lynx/components/search-bar
 */
export const SearchBar = forwardRef<SearchInputRef, SearchBarProps>(
  (
    { placeholder, onBack, onClose, closeLabel = "닫기", inputProps, appBarProps, ...otherProps },
    ref,
  ) => {
    function handleBack() {
      "background only";
      onBack?.();
    }

    function handleClose() {
      "background only";
      onClose();
    }

    return (
      <AppBar {...appBarProps}>
        {onBack && (
          // The search input starts right at the back button's touch area, so drop the gap and the
          // inner offset that App Bar keeps for a title.
          <AppBarLeft style={{ paddingRight: 0 }}>
            <AppBarBackButton edge="leading" bindtap={handleBack} />
          </AppBarLeft>
        )}
        {/* fills the space between the left and right areas, centered in the bar */}
        <AppBarSlot
          style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0, minWidth: 0, alignSelf: "center" }}
        >
          <SearchInput.Root {...otherProps}>
            {/* You may implement your own i18n for the labels */}
            <SearchInput.Input
              ref={ref}
              accessibility-label="검색"
              placeholder={placeholder}
              {...inputProps}
            />
            <SearchInput.ClearButton accessibility-label="지우기">
              <Icon icon={<IconXmarkCircleFill />} />
            </SearchInput.ClearButton>
          </SearchInput.Root>
        </AppBarSlot>
        <AppBarRight>
          {/* Without the inner offset, the close button's touch area does not cover the clear button. */}
          <AppBarTextButton edge="trailing" bindtap={handleClose}>
            {closeLabel}
          </AppBarTextButton>
        </AppBarRight>
      </AppBar>
    );
  },
);
SearchBar.displayName = "SearchBar";
