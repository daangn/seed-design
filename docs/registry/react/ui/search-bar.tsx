"use client";

import { useActivity } from "@stackflow/react";
import * as React from "react";
import {
  AppBar,
  AppBarBackButton,
  AppBarLeft,
  AppBarRight,
  AppBarSlot,
  AppBarTextButton,
} from "./app-bar";
import { SearchInput, type SearchInputProps } from "./search-input";

export interface SearchBarProps extends SearchInputProps {
  /**
   * Shows the back button, which pops the current activity. Hidden on the root activity.
   * @default false
   */
  showBackButton?: boolean;

  /**
   * Called when the close button is clicked.
   */
  onClose: () => void;

  /**
   * @default "닫기"
   */
  closeLabel?: React.ReactNode;
}

/**
 * @see https://seed-design.io/react/stackflow/search-bar
 */
export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ showBackButton = false, onClose, closeLabel = "닫기", ...otherProps }, ref) => {
    const activity = useActivity();
    const renderBackButton = showBackButton && !!activity && !activity.isRoot;

    return (
      <AppBar>
        {renderBackButton && (
          // The search input starts right at the back button's touch area, so drop the gap and the
          // inner offset that App Bar keeps for a title.
          <AppBarLeft style={{ paddingRight: 0 }}>
            <AppBarBackButton style={{ marginRight: 0 }} />
          </AppBarLeft>
        )}
        <AppBarSlot>
          <SearchInput
            ref={ref}
            {...otherProps}
            // fills the space between the left and right areas, centered in the bar
            style={{ flex: 1, minWidth: 0, alignSelf: "center", ...otherProps.style }}
          />
        </AppBarSlot>
        <AppBarRight>
          {/* Without the inner offset, the close button's touch area does not cover the clear button. */}
          <AppBarTextButton style={{ marginLeft: 0 }} onClick={onClose}>
            {closeLabel}
          </AppBarTextButton>
        </AppBarRight>
      </AppBar>
    );
  },
);
SearchBar.displayName = "SearchBar";
