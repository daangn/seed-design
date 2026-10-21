/**
 * Shared activity fixtures composing the styled NextAppScreen / NextAppBar.
 */
import type { ActivityComponentType } from "@stackflow/react";
import {
  NextAppBarIconButton,
  NextAppBarLeft,
  NextAppBarMain,
  NextAppBarRoot,
  type NextAppBarRootProps,
  NextAppBarTitle,
  NextAppScreenContent,
  NextAppScreenDim,
  NextAppScreenEdge,
  NextAppScreenLayer,
  NextAppScreenRoot,
  type NextAppScreenRootProps,
} from "../src";

export interface MakeActivityOptions extends Omit<NextAppScreenRootProps, "children"> {
  testId: string;
  withAppBar?: boolean;
  appBarProps?: NextAppBarRootProps;
  children?: React.ReactNode;
}

export function makeActivity(options: MakeActivityOptions): ActivityComponentType {
  const { testId, withAppBar, appBarProps, children, ...screenProps } = options;

  return function TestActivity() {
    return (
      <NextAppScreenRoot data-testid={testId} {...screenProps}>
        <NextAppScreenDim data-testid={`${testId}-screen-dim`} />
        <NextAppScreenLayer data-testid={`${testId}-screen-layer`}>
          {withAppBar ? (
            <NextAppBarRoot data-testid={`${testId}-app-bar`} {...appBarProps}>
              <NextAppBarLeft>
                <NextAppBarIconButton aria-label="back">
                  <svg role="img" aria-label="icon" />
                </NextAppBarIconButton>
              </NextAppBarLeft>
              <NextAppBarMain data-testid={`${testId}-app-bar-main`}>
                <NextAppBarTitle>{testId}</NextAppBarTitle>
              </NextAppBarMain>
            </NextAppBarRoot>
          ) : null}
          <NextAppScreenContent data-testid={`${testId}-screen-content`}>
            <button type="button" data-testid={`${testId}-button`}>
              button
            </button>
            {children}
          </NextAppScreenContent>
        </NextAppScreenLayer>
        <NextAppScreenEdge data-testid={`${testId}-screen-edge`} />
      </NextAppScreenRoot>
    );
  };
}
