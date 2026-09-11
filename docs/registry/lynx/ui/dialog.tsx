import IconXmarkLine from "@karrotmarket/lynx-monochrome-icon/IconXmarkLine";
import * as React from "@lynx-js/react";
import {
  ActionButton,
  Dialog as SeedDialog,
  Icon,
  type ActionButtonProps,
} from "@seed-design/lynx-react";

export interface DialogRootProps extends SeedDialog.RootProps {}

/**
 * @see https://seed-design.io/lynx/components/dialog
 */
export const DialogRoot = SeedDialog.Root;

export interface DialogTriggerProps extends SeedDialog.TriggerProps {}

export const DialogTrigger = SeedDialog.Trigger;

export interface DialogBodyProps extends SeedDialog.BodyProps {}

export const DialogBody = SeedDialog.Body;

export interface DialogFooterProps extends SeedDialog.FooterProps {}

export const DialogFooter = SeedDialog.Footer;

export interface DialogActionProps
  extends Omit<SeedDialog.ActionProps, "children">,
    ActionButtonProps {}

export const DialogAction = React.forwardRef<unknown, DialogActionProps>(
  ({ children, transition, ...actionButtonProps }, ref) => {
    return (
      <SeedDialog.Action transition={transition}>
        <ActionButton ref={ref} {...actionButtonProps}>
          {children}
        </ActionButton>
      </SeedDialog.Action>
    );
  },
);
DialogAction.displayName = "DialogAction";

export interface DialogContentProps extends Omit<SeedDialog.ContentProps, "children"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  container?: SeedDialog.PositionerProps["container"];
  overlayLevel?: SeedDialog.PositionerProps["overlayLevel"];
  /**
   * @default true
   */
  showCloseButton?: boolean;
}

/**
 * Positioner, Backdrop, Header를 조립하고 제목·설명·닫기 ActionButton을 제공합니다.
 */
export const DialogContent = (props: DialogContentProps) => {
  const {
    children,
    title,
    description,
    container,
    overlayLevel,
    showCloseButton = true,
    ...contentProps
  } = props;
  const shouldRenderHeader = title != null || description != null || showCloseButton;

  return (
    <SeedDialog.Positioner container={container} overlayLevel={overlayLevel}>
      <SeedDialog.Backdrop />
      <SeedDialog.Content {...contentProps}>
        {shouldRenderHeader ? (
          <SeedDialog.Header>
            <view
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "8px",
              }}
            >
              <view style={{ display: "flex", flexDirection: "column", flexGrow: 1, gap: "6px" }}>
                {title != null ? <SeedDialog.Title>{title}</SeedDialog.Title> : null}
                {description != null ? (
                  <SeedDialog.Description>{description}</SeedDialog.Description>
                ) : null}
              </view>
              {showCloseButton ? (
                <SeedDialog.Action>
                  <view style={{ margin: "-15px" }}>
                    <ActionButton
                      variant="ghost"
                      size="large"
                      layout="iconOnly"
                      accessibility-label="닫기"
                    >
                      <Icon icon={<IconXmarkLine />} color="fg.neutralSubtle" />
                    </ActionButton>
                  </view>
                </SeedDialog.Action>
              ) : null}
            </view>
          </SeedDialog.Header>
        ) : null}
        {children}
      </SeedDialog.Content>
    </SeedDialog.Positioner>
  );
};
DialogContent.displayName = "DialogContent";
