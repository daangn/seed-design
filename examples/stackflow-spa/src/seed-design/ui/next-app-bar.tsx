import { IconChevronLeftLine, IconXmarkLine } from "@karrotmarket/react-monochrome-icon"; // "@daangn/react-monochrome-icon"과 동일합니다.
import { VStack } from "@seed-design/react";
import { NextAppBar as SeedNextAppBar } from "@seed-design/stackflow";
import { useActions, useActivity } from "@stackflow/react";
import * as React from "react";
import { forwardRef } from "react";

export interface NextAppBarProps extends SeedNextAppBar.RootProps {}

export const NextAppBar = SeedNextAppBar.Root;

export interface NextAppBarLeftProps extends SeedNextAppBar.LeftProps {}

export const NextAppBarLeft = SeedNextAppBar.Left;

export interface NextAppBarRightProps extends SeedNextAppBar.RightProps {}

export const NextAppBarRight = SeedNextAppBar.Right;

export interface NextAppBarSlotProps extends SeedNextAppBar.SlotProps {}

export const NextAppBarSlot = SeedNextAppBar.Slot;

export interface NextAppBarMainProps extends Omit<SeedNextAppBar.MainProps, "asChild"> {
  /**
   * The title of the app bar.
   * If children is provided as ReactElement, this prop will be ignored.
   */
  title?: string;

  /**
   * The subtitle of the app bar.
   * If children is provided as ReactElement, this prop will be ignored.
   */
  subtitle?: string;
}

export const NextAppBarMain = forwardRef<HTMLDivElement, NextAppBarMainProps>(
  ({ title, subtitle, children, ...otherProps }, ref) => {
    if (React.isValidElement(children)) {
      return (
        <SeedNextAppBar.Main {...otherProps} ref={ref}>
          {children}
        </SeedNextAppBar.Main>
      );
    }

    return (
      <SeedNextAppBar.Main
        layout={subtitle ? "withSubtitle" : "titleOnly"}
        {...otherProps}
        ref={ref}
      >
        <VStack overflowX="auto">
          <SeedNextAppBar.Title>{children ?? title}</SeedNextAppBar.Title>
          {subtitle ? <SeedNextAppBar.Subtitle>{subtitle}</SeedNextAppBar.Subtitle> : null}
        </VStack>
      </SeedNextAppBar.Main>
    );
  },
);
NextAppBarMain.displayName = "NextAppBarMain";

export interface NextAppBarIconButtonProps extends SeedNextAppBar.IconButtonProps {}

export const NextAppBarIconButton = SeedNextAppBar.IconButton;

export const NextAppBarBackButton = forwardRef<HTMLButtonElement, NextAppBarIconButtonProps>(
  ({ children = <IconChevronLeftLine />, onClick, ...otherProps }, ref) => {
    const activity = useActivity();
    const actions = useActions();

    const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);

      if (!e.defaultPrevented) {
        actions.pop();
      }
    };

    if (!activity) {
      return null;
    }
    if (activity.isRoot) {
      return null;
    }

    return (
      <SeedNextAppBar.IconButton
        ref={ref}
        aria-label="뒤로"
        type="button"
        onClick={handleOnClick}
        {...otherProps}
      >
        {children}
      </SeedNextAppBar.IconButton>
    );
  },
);
NextAppBarBackButton.displayName = "NextAppBarBackButton";

export const NextAppBarCloseButton = forwardRef<HTMLButtonElement, NextAppBarIconButtonProps>(
  ({ children = <IconXmarkLine />, onClick, ...otherProps }, ref) => {
    const activity = useActivity();

    const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);

      if (!e.defaultPrevented) {
        // you can do something here
      }
    };

    const isRoot = !activity || activity.isRoot;

    if (!isRoot) {
      return null;
    }

    return (
      <NextAppBarIconButton
        ref={ref}
        aria-label="닫기"
        type="button"
        onClick={handleOnClick}
        {...otherProps}
      >
        {children}
      </NextAppBarIconButton>
    );
  },
);
NextAppBarCloseButton.displayName = "NextAppBarCloseButton";
