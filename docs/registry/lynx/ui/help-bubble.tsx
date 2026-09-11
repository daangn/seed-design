import IconXmarkLine from "@karrotmarket/lynx-monochrome-icon/IconXmarkLine";
import * as React from "@lynx-js/react";
import { HelpBubble as SeedHelpBubble, Icon } from "@seed-design/lynx-react";

interface HelpBubbleProps extends Omit<SeedHelpBubble.RootProps, "children"> {
  title: React.ReactNode;

  description?: React.ReactNode;

  showCloseButton?: boolean;

  children?: React.ReactNode;

  contentProps?: SeedHelpBubble.ContentProps;

  zIndexOffset?: number;
}

export interface HelpBubbleTriggerProps extends HelpBubbleProps {}

/**
 * 트리거와 말풍선의 기본 슬롯을 조립합니다. 자식은 native `view`로 감싸므로 `asChild`를
 * 지원하지 않습니다.
 *
 * @see https://seed-design.io/lynx/components/help-bubble
 */
export const HelpBubbleTrigger = React.forwardRef<unknown, HelpBubbleTriggerProps>(
  (
    {
      showCloseButton = false,
      title,
      description,
      contentProps,
      zIndexOffset,
      children,
      ...rootProps
    },
    ref,
  ) => {
    return (
      <SeedHelpBubble.Root {...rootProps}>
        <SeedHelpBubble.Trigger ref={ref}>
          <view>{children}</view>
        </SeedHelpBubble.Trigger>
        <HelpBubbleContent
          title={title}
          description={description}
          showCloseButton={showCloseButton}
          contentProps={contentProps}
          zIndexOffset={zIndexOffset}
        />
      </SeedHelpBubble.Root>
    );
  },
);
HelpBubbleTrigger.displayName = "HelpBubbleTrigger";

export interface HelpBubbleAnchorProps extends HelpBubbleProps {}

/**
 * 위치 기준점과 말풍선의 기본 슬롯을 조립합니다. Anchor는 탭으로 열고 닫지 않습니다.
 *
 * @see https://seed-design.io/lynx/components/help-bubble
 */
export const HelpBubbleAnchor = React.forwardRef<unknown, HelpBubbleAnchorProps>(
  (
    {
      showCloseButton = false,
      title,
      description,
      contentProps,
      zIndexOffset,
      children,
      ...rootProps
    },
    ref,
  ) => {
    return (
      <SeedHelpBubble.Root {...rootProps}>
        <SeedHelpBubble.Anchor ref={ref}>
          <view>{children}</view>
        </SeedHelpBubble.Anchor>
        <HelpBubbleContent
          title={title}
          description={description}
          showCloseButton={showCloseButton}
          contentProps={contentProps}
          zIndexOffset={zIndexOffset}
        />
      </SeedHelpBubble.Root>
    );
  },
);
HelpBubbleAnchor.displayName = "HelpBubbleAnchor";

interface HelpBubbleContentProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  showCloseButton: boolean;
  contentProps?: SeedHelpBubble.ContentProps;
  zIndexOffset?: number;
}

function HelpBubbleContent({
  title,
  description,
  showCloseButton,
  contentProps,
  zIndexOffset,
}: HelpBubbleContentProps) {
  return (
    <SeedHelpBubble.Positioner zIndexOffset={zIndexOffset}>
      <SeedHelpBubble.Content {...contentProps}>
        <SeedHelpBubble.Arrow>
          <SeedHelpBubble.ArrowTip />
        </SeedHelpBubble.Arrow>
        <SeedHelpBubble.Body>
          <SeedHelpBubble.Title>{title}</SeedHelpBubble.Title>
          {description != null ? (
            <SeedHelpBubble.Description>{description}</SeedHelpBubble.Description>
          ) : null}
        </SeedHelpBubble.Body>
        {showCloseButton ? (
          <SeedHelpBubble.CloseButton accessibility-label="닫기">
            <Icon
              icon={<IconXmarkLine color="var(--seed-color-fg-neutral-inverted)" />}
              size={14}
              color="fg.neutralInverted"
            />
          </SeedHelpBubble.CloseButton>
        ) : null}
      </SeedHelpBubble.Content>
    </SeedHelpBubble.Positioner>
  );
}
