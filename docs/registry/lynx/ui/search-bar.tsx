import { forwardRef, type ComponentRef, type ReactNode } from "@lynx-js/react";
import {
  AppBar,
  AppBarBackButton,
  AppBarLeft,
  AppBarRight,
  AppBarSlot,
  AppBarTextButton,
  type AppBarProps,
} from "./app-bar";
import { SearchInput, type SearchInputProps } from "./search-input";

export interface SearchBarProps extends SearchInputProps {
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

  /**
   * Props for the App Bar, such as `theme`.
   */
  appBarProps?: Omit<AppBarProps, "children">;
}

type SearchInputRef = ComponentRef<typeof SearchInput>;

/**
 * @see https://seed-design.io/lynx/components/search-bar
 */
export const SearchBar = forwardRef<SearchInputRef, SearchBarProps>(
  ({ onBack, onClose, closeLabel = "닫기", appBarProps, ...otherProps }, ref) => {
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
          <SearchInput ref={ref} {...otherProps} />
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
