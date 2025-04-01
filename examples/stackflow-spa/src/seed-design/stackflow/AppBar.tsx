import { IconChevronLeftLine, IconXmarkLine } from "@daangn/react-monochrome-icon";
import { Stack } from "@seed-design/react";
import { AppBar as SeedAppBar, type AppBarIconButtonProps } from "@seed-design/stackflow";
import { useActions, useActivity } from "@stackflow/react";
import * as React from "react";
import { forwardRef } from "react";

export const AppBar = SeedAppBar.Root;

export const AppBarLeft = SeedAppBar.Left;

export const AppBarRight = SeedAppBar.Right;

export interface AppBarMainProps extends Omit<SeedAppBar.MainProps, "asChild"> {
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

export const AppBarMain = forwardRef<HTMLDivElement, AppBarMainProps>(
  ({ title, subtitle, children, ...otherProps }, ref) => {
    if (React.isValidElement(children)) {
      return (
        <SeedAppBar.Main {...otherProps} ref={ref}>
          {children}
        </SeedAppBar.Main>
      );
    }

    return (
      <SeedAppBar.Main layout={subtitle ? "withSubtitle" : "titleOnly"} {...otherProps} ref={ref}>
        <Stack overflowX="auto">
          <SeedAppBar.Title>{children ?? title}</SeedAppBar.Title>
          {subtitle ? <SeedAppBar.Subtitle>{subtitle}</SeedAppBar.Subtitle> : null}
        </Stack>
      </SeedAppBar.Main>
    );
  },
);
AppBarMain.displayName = "AppBarMain";

export const AppBarIconButton = SeedAppBar.IconButton;

export const AppBarBackButton = forwardRef<HTMLButtonElement, AppBarIconButtonProps>(
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
      <SeedAppBar.IconButton
        ref={ref}
        aria-label="Go Back"
        type="button"
        onClick={handleOnClick}
        {...otherProps}
      >
        {children}
      </SeedAppBar.IconButton>
    );
  },
);
AppBarBackButton.displayName = "AppBarBackButton";

export const AppBarCloseButton = forwardRef<HTMLButtonElement, AppBarIconButtonProps>(
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
      <AppBarIconButton
        ref={ref}
        aria-label="Close"
        type="button"
        onClick={handleOnClick}
        {...otherProps}
      >
        {children}
      </AppBarIconButton>
    );
  },
);
AppBarCloseButton.displayName = "AppBarCloseButton";
