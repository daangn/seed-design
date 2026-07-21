import { PullToRefreshRoot, PullToRefreshContent, PullToRefreshIndicator } from "./pull-to-refresh";
import { NextAppScreen as SeedNextAppScreen } from "@seed-design/stackflow";
import { useActions, useActivity } from "@stackflow/react";
import { forwardRef } from "react";

export interface NextAppScreenProps extends SeedNextAppScreen.RootProps {}

/**
 * NOTE: stackflow의 `transitionDuration`은 화면 unmount 타이밍을 결정합니다.
 * enter는 어긋나도 트랜지션이 자연 완주하지만 exit는 unmount에 잘리므로,
 * `transitionDuration`을 CSS exit 트랜지션 길이의 최댓값(350ms) 이상으로
 * 설정하세요.
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
