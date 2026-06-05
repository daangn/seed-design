import IconChevronLeftLine from "@karrotmarket/lynx-monochrome-icon/IconChevronLeftLine";
import IconXmarkLine from "@karrotmarket/lynx-monochrome-icon/IconXmarkLine";
import { forwardRef, type ReactNode } from "@lynx-js/react";
import { AppBar as SeedAppBar } from "@seed-design/lynx-react";

export interface AppBarProps extends SeedAppBar.RootProps {}

/**
 * @see https://seed-design.io/lynx/components/app-bar
 */
export const AppBar = SeedAppBar.Root;

export interface AppBarLeftProps extends SeedAppBar.LeftProps {}

export const AppBarLeft = SeedAppBar.Left;

export interface AppBarRightProps extends SeedAppBar.RightProps {}

export const AppBarRight = SeedAppBar.Right;

export interface AppBarSlotProps extends SeedAppBar.SlotProps {}

export const AppBarSlot = SeedAppBar.Slot;

export interface AppBarMainProps extends SeedAppBar.MainProps {
  /**
   * The title of the app bar.
   * If custom children are provided, this prop will be ignored.
   */
  title?: ReactNode;

  /**
   * The subtitle of the app bar.
   * If custom children are provided, this prop will be ignored.
   */
  subtitle?: ReactNode;
}

function shouldRenderCustomMain(children: ReactNode) {
  return (
    children != null &&
    typeof children !== "string" &&
    typeof children !== "number" &&
    typeof children !== "boolean"
  );
}

export const AppBarMain = forwardRef<unknown, AppBarMainProps>(
  ({ title, subtitle, children, ...otherProps }, ref) => {
    if (shouldRenderCustomMain(children)) {
      return (
        <SeedAppBar.Main ref={ref} {...otherProps}>
          {children}
        </SeedAppBar.Main>
      );
    }

    return (
      <SeedAppBar.Main ref={ref} layout={subtitle ? "withSubtitle" : "titleOnly"} {...otherProps}>
        <SeedAppBar.Title>{children ?? title}</SeedAppBar.Title>
        {subtitle ? <SeedAppBar.Subtitle>{subtitle}</SeedAppBar.Subtitle> : null}
      </SeedAppBar.Main>
    );
  },
);
AppBarMain.displayName = "AppBarMain";

export interface AppBarIconButtonProps extends SeedAppBar.IconButtonProps {}

export const AppBarIconButton = SeedAppBar.IconButton;

export interface AppBarBackButtonProps extends Omit<AppBarIconButtonProps, "icon"> {
  icon?: AppBarIconButtonProps["icon"];
}

export const AppBarBackButton = forwardRef<unknown, AppBarBackButtonProps>(
  ({ icon = <IconChevronLeftLine />, ...otherProps }, ref) => {
    return <AppBarIconButton ref={ref} aria-label="뒤로" icon={icon} {...otherProps} />;
  },
);
AppBarBackButton.displayName = "AppBarBackButton";

export interface AppBarCloseButtonProps extends Omit<AppBarIconButtonProps, "icon"> {
  icon?: AppBarIconButtonProps["icon"];
}

export const AppBarCloseButton = forwardRef<unknown, AppBarCloseButtonProps>(
  ({ icon = <IconXmarkLine />, ...otherProps }, ref) => {
    return <AppBarIconButton ref={ref} aria-label="닫기" icon={icon} {...otherProps} />;
  },
);
AppBarCloseButton.displayName = "AppBarCloseButton";
