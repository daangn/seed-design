"use client";

import {
  PullToRefreshRoot,
  PullToRefreshContent,
  PullToRefreshIndicator,
} from "./pull-to-refresh";
import { AppScreen as SeedAppScreen } from "@seed-design/stackflow";
import { useActions, useActivity } from "@stackflow/react";
import { forwardRef } from "react";

export interface AppScreenProps extends SeedAppScreen.RootProps {}

export const AppScreen = forwardRef<HTMLDivElement, AppScreenProps>(
  ({ children, onSwipeBackEnd, ...otherProps }, ref) => {
    const { pop } = useActions();
    const { isRoot } = useActivity();
    const shouldSwipeBack = !isRoot;

    return (
      <SeedAppScreen.Root
        ref={ref}
        onSwipeBackEnd={({ swiped }) => {
          if (swiped) {
            pop();
          }
          onSwipeBackEnd?.({ swiped });
        }}
        {...otherProps}
      >
        <SeedAppScreen.Dim />
        {children}
        {shouldSwipeBack && <SeedAppScreen.Edge />}
      </SeedAppScreen.Root>
    );
  },
);
AppScreen.displayName = "AppScreen";

export interface AppScreenContentProps extends SeedAppScreen.LayerProps {
  ptr?: boolean;

  onPtrReady?: () => void;

  onPtrRefresh?: () => Promise<void>;
}

export const AppScreenContent = forwardRef<
  HTMLDivElement,
  AppScreenContentProps
>(({ children, ptr, onPtrReady, onPtrRefresh, ...otherProps }, ref) => {
  if (!ptr) {
    return (
      <SeedAppScreen.Layer ref={ref} {...otherProps}>
        {children}
      </SeedAppScreen.Layer>
    );
  }

  return (
    <PullToRefreshRoot
      asChild
      onPtrReady={onPtrReady}
      onPtrRefresh={onPtrRefresh}
    >
      <SeedAppScreen.Layer ref={ref} {...otherProps}>
        <PullToRefreshIndicator />
        <PullToRefreshContent asChild>{children}</PullToRefreshContent>
      </SeedAppScreen.Layer>
    </PullToRefreshRoot>
  );
});
