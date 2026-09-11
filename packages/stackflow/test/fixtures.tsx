/**
 * Shared activity fixtures composing the styled NextAppScreen / NextAppBar.
 */
import type { ActivityComponentType } from "@stackflow/react";
import {
  NextAppBarIconButton,
  NextAppBarLeft,
  NextAppBarMain,
  NextAppBarRoot,
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
  children?: React.ReactNode;
}

export function makeActivity(options: MakeActivityOptions): ActivityComponentType {
  const { testId, withAppBar, children, ...screenProps } = options;

  return function TestActivity() {
    return (
      <NextAppScreenRoot data-testid={testId} {...screenProps}>
        <NextAppScreenDim />
        <NextAppScreenLayer>
          {withAppBar ? (
            <NextAppBarRoot>
              <NextAppBarLeft>
                <NextAppBarIconButton aria-label="back">
                  <svg role="img" aria-label="icon" />
                </NextAppBarIconButton>
              </NextAppBarLeft>
              <NextAppBarMain>
                <NextAppBarTitle>{testId}</NextAppBarTitle>
              </NextAppBarMain>
            </NextAppBarRoot>
          ) : null}
          <NextAppScreenContent>
            <button type="button" data-testid={`${testId}-button`}>
              button
            </button>
            {children}
          </NextAppScreenContent>
        </NextAppScreenLayer>
        <NextAppScreenEdge />
      </NextAppScreenRoot>
    );
  };
}
