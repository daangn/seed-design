"use client";

import { IconChevronLeftLine, IconXmarkLine } from "@karrotmarket/react-monochrome-icon";
import { Icon } from "@seed-design/react";
import { NextAppBar as SeedNextAppBar } from "@seed-design/stackflow";
import { useActions, useActivity } from "@stackflow/react";
import type * as React from "react";
import { forwardRef } from "react";

export interface NextAppBarProps extends SeedNextAppBar.RootProps {}

export const NextAppBar = SeedNextAppBar.Root;

export interface NextAppBarLeftProps extends SeedNextAppBar.LeftProps {}

export const NextAppBarLeft = SeedNextAppBar.Left;

export interface NextAppBarRightProps extends SeedNextAppBar.RightProps {}

export const NextAppBarRight = SeedNextAppBar.Right;

export interface NextAppBarMainProps
  extends Omit<SeedNextAppBar.MainProps, "asChild" | "children" | "title"> {
  title: React.ReactNode;

  subtitle?: React.ReactNode;
}

export const NextAppBarMain = forwardRef<HTMLDivElement, NextAppBarMainProps>(
  ({ title, subtitle, ...otherProps }, ref) => (
    <SeedNextAppBar.Main layout={subtitle ? "withSubtitle" : "titleOnly"} {...otherProps} ref={ref}>
      <SeedNextAppBar.Title>{title}</SeedNextAppBar.Title>
      {subtitle ? <SeedNextAppBar.Subtitle>{subtitle}</SeedNextAppBar.Subtitle> : null}
    </SeedNextAppBar.Main>
  ),
);
NextAppBarMain.displayName = "NextAppBarMain";

export interface NextAppBarIconButtonProps extends SeedNextAppBar.IconButtonProps {}

export const NextAppBarIconButton = SeedNextAppBar.IconButton;

export const NextAppBarBackButton = forwardRef<HTMLButtonElement, NextAppBarIconButtonProps>(
  ({ children = <Icon svg={<IconChevronLeftLine />} />, onClick, ...otherProps }, ref) => {
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
  ({ children = <Icon svg={<IconXmarkLine />} />, onClick, ...otherProps }, ref) => {
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
      <NextAppBarIconButton ref={ref} aria-label="닫기" onClick={handleOnClick} {...otherProps}>
        {children}
      </NextAppBarIconButton>
    );
  },
);
NextAppBarCloseButton.displayName = "NextAppBarCloseButton";
