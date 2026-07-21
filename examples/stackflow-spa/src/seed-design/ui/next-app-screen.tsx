import { PullToRefreshRoot, PullToRefreshContent, PullToRefreshIndicator } from "./pull-to-refresh";
import { NextAppScreen as SeedNextAppScreen } from "@seed-design/stackflow";
import { useActions, useActivity } from "@stackflow/react";
import { forwardRef } from "react";

export interface NextAppScreenProps extends SeedNextAppScreen.RootProps {}

/**
 * NOTE: stackflow의 `transitionDuration`은 NextAppScreen의 CSS 애니메이션
 * 길이(350ms)와 일치해야 화면 unmount 타이밍이 어긋나지 않습니다.
 */
export const NextAppScreen = forwardRef<HTMLDivElement, NextAppScreenProps>(
  ({ children, onSwipeBackEnd, swipeBackArea, ...otherProps }, ref) => {
    const { pop } = useActions();
    const { isRoot } = useActivity();

    return (
      <SeedNextAppScreen.Root
        ref={ref}
        swipeBackArea={isRoot ? "none" : swipeBackArea}
        onSwipeBackEnd={({ swiped }) => {
          if (swiped) {
            pop();
          }
          onSwipeBackEnd?.({ swiped });
        }}
        {...otherProps}
      >
        <SeedNextAppScreen.Dim />
        <SeedNextAppScreen.Layer>{children}</SeedNextAppScreen.Layer>
        <SeedNextAppScreen.Edge />
      </SeedNextAppScreen.Root>
    );
  },
);
NextAppScreen.displayName = "NextAppScreen";

export interface NextAppScreenContentProps extends SeedNextAppScreen.ContentProps {
  ptr?: boolean;

  onPtrReady?: () => void;

  onPtrRefresh?: () => Promise<void>;
}

export const NextAppScreenContent = forwardRef<HTMLDivElement, NextAppScreenContentProps>(
  ({ children, ptr, onPtrReady, onPtrRefresh, ...otherProps }, ref) => {
    if (!ptr) {
      return (
        <SeedNextAppScreen.Content ref={ref} {...otherProps}>
          {children}
        </SeedNextAppScreen.Content>
      );
    }

    return (
      <PullToRefreshRoot asChild onPtrReady={onPtrReady} onPtrRefresh={onPtrRefresh}>
        <SeedNextAppScreen.Content ref={ref} {...otherProps}>
          <PullToRefreshIndicator />
          <PullToRefreshContent asChild>{children}</PullToRefreshContent>
        </SeedNextAppScreen.Content>
      </PullToRefreshRoot>
    );
  },
);
NextAppScreenContent.displayName = "NextAppScreenContent";
