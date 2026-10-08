import * as React from "@lynx-js/react";
import {
  Tabs as HeadlessTabs,
  TabsProvider,
  useTabs,
  useTabsContent,
  useTabsTrigger,
  type TabsListProps as HeadlessTabsListProps,
  type UseTabsCarouselCameraProps,
  type UseTabsCarouselProps,
  type UseTabsContentProps,
  type UseTabsProps,
  type UseTabsTriggerProps,
} from "@seed-design/lynx-react-tabs";
import clsx from "clsx";

import { chipTabs, type ChipTabsVariantProps } from "@seed-design/lynx-css/recipes/chip-tabs";

import { useScaleFeedback } from "../../hooks/useScaleFeedback";
import type { LynxHostProps, LynxViewRef } from "../../types";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { mergeProps } from "../../utils/merge-props";
import { HStack } from "../Stack";

/** chip-tablist `gap` token과 같은 값입니다. Headless가 trigger rect를 계산할 때 사용합니다. */
const CHIP_TABS_TRIGGER_GAP = 8;

type ChipTabsPublicVariantProps = Omit<
  ChipTabsVariantProps,
  "selected" | "pressed" | "disabled" | "inCarousel"
>;

const { PropsProvider, useProps } = createSlotRecipeContext(chipTabs);

function useChipTabsVariantProps(consumer: string): ChipTabsVariantProps {
  const variantProps = useProps();
  if (!variantProps) throw new Error(`<${consumer}/> must be rendered inside <ChipTabsRoot/>.`);
  return variantProps;
}

////////////////////////////////////////////////////////////////////////////////////

/**
 * @platform Lynx
 *
 * 웹 대비 미지원 기능:
 * - `lazyMount`, `unmountOnExit`: native viewpager가 모든 page slot을 유지해야 함
 * - 키보드 포커스와 roving tabindex
 */
export interface ChipTabsRootProps
  extends LynxHostProps<"view">,
    ChipTabsPublicVariantProps,
    Pick<UseTabsProps, "value" | "defaultValue" | "onValueChange"> {}

/**
 * Chip recipe와 Tabs의 controlled state, horizontal scrolling, and native pager behavior를 결합합니다.
 */
export const ChipTabsRoot = React.forwardRef<unknown, ChipTabsRootProps>((props, ref) => {
  const [variantProps, rootProps] = chipTabs.splitVariantProps(props);
  const { children, className, style, value, defaultValue, onValueChange, ...nativeProps } =
    rootProps;
  const api = useTabs({ value, defaultValue, onValueChange, triggerGap: CHIP_TABS_TRIGGER_GAP });
  const classNames = chipTabs(variantProps);

  return (
    <TabsProvider value={api}>
      <PropsProvider value={variantProps}>
        <view
          {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
          className={clsx(classNames.root, className)}
          style={style}
        >
          {children}
        </view>
      </PropsProvider>
    </TabsProvider>
  );
});
ChipTabsRoot.displayName = "ChipTabsRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface ChipTabsListProps
  extends LynxHostProps<"scroll-view">,
    Pick<HeadlessTabsListProps, "scrollAlign"> {
  /** 선택한 chip을 목록 안에서 정렬할 방식입니다. @defaultValue "nearest" */
  scrollAlign?: HeadlessTabsListProps["scrollAlign"];
}

/**
 * ChipTabs는 이미 보이는 선택 chip을 움직이지 않도록 기본적으로 `"nearest"`를 사용합니다.
 */
export const ChipTabsList = React.forwardRef<unknown, ChipTabsListProps>((props, ref) => {
  const { children, className, scrollAlign = "nearest", ...nativeProps } = props;
  const classNames = chipTabs(useChipTabsVariantProps("ChipTabsList"));

  return (
    <HeadlessTabs.List
      {...nativeProps}
      {...(ref ? { ref } : {})}
      scrollAlign={scrollAlign}
      className={clsx(classNames.list, className)}
      listContentProps={{ className: classNames.listContent }}
    >
      {children}
    </HeadlessTabs.List>
  );
});
ChipTabsList.displayName = "ChipTabsList";

////////////////////////////////////////////////////////////////////////////////////

/** Native text label and optional inline notification slot을 갖는 chip trigger입니다. */
export interface ChipTabsTriggerProps
  extends Omit<LynxHostProps<"view">, "children">,
    Pick<UseTabsTriggerProps, "value" | "disabled"> {
  children: string | number;
  notification?: React.ReactNode;
}

export const ChipTabsTrigger = React.forwardRef<unknown, ChipTabsTriggerProps>((props, ref) => {
  const {
    children,
    notification,
    className,
    style,
    value: triggerValue,
    disabled = false,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "accessibility-label": accessibilityLabel,
    ...nativeProps
  } = props;

  const variantProps = useChipTabsVariantProps("ChipTabsTrigger");
  const api = useTabsTrigger({
    value: triggerValue,
    disabled,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    children,
    "accessibility-label": accessibilityLabel,
  });
  const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback({
    disabled,
    onTouchStart: api.bindtouchstart,
    onTouchEnd: api.bindtouchend,
    onTouchCancel: api.bindtouchcancel,
  });
  const classNames = chipTabs({
    ...variantProps,
    selected: api.isVisuallySelected,
    disabled: api.isDisabled,
    pressed: api.isPressed,
  });
  const label = <text className={classNames.triggerLabel}>{children}</text>;

  return (
    <view
      {...mergeProps(
        { flatten: false },
        api.triggerProps,
        ref ? { ref: ref as LynxViewRef } : {},
        scaleFeedbackTargetProps,
        scaleFeedbackTriggerProps,
        nativeProps,
      )}
      className={clsx(classNames.trigger, className)}
      style={style}
    >
      {notification ? (
        <HStack position="relative" gap="x1_5">
          {label}
          <view accessibility-elements-hidden={true}>{notification}</view>
        </HStack>
      ) : (
        label
      )}
    </view>
  );
});
ChipTabsTrigger.displayName = "ChipTabsTrigger";

////////////////////////////////////////////////////////////////////////////////////

export interface ChipTabsContentProps extends LynxHostProps<"view">, UseTabsContentProps {}

export const ChipTabsContent = React.forwardRef<unknown, ChipTabsContentProps>((props, ref) => {
  const { children, className, style, value: contentValue, ...nativeProps } = props;

  const variantProps = useChipTabsVariantProps("ChipTabsContent");
  const api = useTabsContent({ value: contentValue });
  const classNames = chipTabs({
    ...variantProps,
    selected: api.isSelected,
    inCarousel: api.inCarousel,
  });
  const content = (
    <view
      {...mergeProps(api.contentProps, nativeProps, ref ? { ref: ref as LynxViewRef } : {})}
      className={clsx(classNames.content, className)}
      style={style}
    >
      {children}
    </view>
  );
  if (api.inCarousel) {
    if (api.isDisabled) return null;
    return <viewpager-item>{content}</viewpager-item>;
  }
  return content;
});
ChipTabsContent.displayName = "ChipTabsContent";

////////////////////////////////////////////////////////////////////////////////////

/**
 * @platform Lynx
 *
 * native viewpager를 사용하므로 웹의 `loop`, `autoHeight`, `dragThreshold`,
 * `carouselPreventDrag`는 지원하지 않습니다.
 */
export interface ChipTabsCarouselProps extends LynxHostProps<"view">, UseTabsCarouselProps {}

export const ChipTabsCarousel = React.forwardRef<unknown, ChipTabsCarouselProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const classNames = chipTabs(useChipTabsVariantProps("ChipTabsCarousel"));

  return (
    <HeadlessTabs.Carousel
      {...nativeProps}
      {...(ref ? { ref } : {})}
      className={clsx(classNames.carousel, className)}
    >
      {children}
    </HeadlessTabs.Carousel>
  );
});
ChipTabsCarousel.displayName = "ChipTabsCarousel";

////////////////////////////////////////////////////////////////////////////////////

export interface ChipTabsCarouselCameraProps
  extends LynxHostProps<"viewpager">,
    UseTabsCarouselCameraProps {}

export const ChipTabsCarouselCamera = React.forwardRef<unknown, ChipTabsCarouselCameraProps>(
  (props, ref) => {
    const { children, className, ...nativeProps } = props;
    const classNames = chipTabs(useChipTabsVariantProps("ChipTabsCarouselCamera"));

    return (
      <HeadlessTabs.CarouselCamera
        {...nativeProps}
        {...(ref ? { ref } : {})}
        className={clsx(classNames.carouselCamera, className)}
      >
        {children}
      </HeadlessTabs.CarouselCamera>
    );
  },
);
ChipTabsCarouselCamera.displayName = "ChipTabsCarouselCamera";
