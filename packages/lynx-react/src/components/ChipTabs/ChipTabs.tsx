import * as React from "@lynx-js/react";

import { chipTabs, type ChipTabsVariantProps } from "@seed-design/lynx-css/recipes/chip-tabs";

import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";

import {
  TabsCarousel,
  TabsCarouselCamera,
  TabsContent,
  TabsList,
  TabsRootPrimitive,
  TabsTrigger,
  type TabsCarouselCameraProps,
  type TabsCarouselProps,
  type TabsContentProps,
  type TabsListProps,
  type TabsRootProps,
  type TabsTriggerProps,
} from "../Tabs/Tabs";

type ChipTabsRecipeState = Pick<
  ChipTabsVariantProps,
  "selected" | "pressed" | "disabled" | "inCarousel"
>;

const CHIP_TABS_TRIGGER_GAP = 8;
const { ClassNamesProvider: ChipTabsClassNamesProvider } = createSlotRecipeContext(chipTabs);

type ChipTabsPublicVariantProps = Omit<
  ChipTabsVariantProps,
  "selected" | "pressed" | "disabled" | "inCarousel"
>;

/**
 * @platform Lynx
 *
 * 웹 대비 미지원 기능:
 * - `lazyMount`, `unmountOnExit`: native viewpager가 모든 page slot을 유지해야 함
 * - 키보드 포커스와 roving tabindex
 */
export interface ChipTabsRootProps
  extends Omit<TabsRootProps, "size" | "contentLayout" | "stickyList" | "triggerLayout">,
    ChipTabsPublicVariantProps {}

/**
 * Chip recipe와 Tabs의 controlled state, horizontal scrolling, and native pager behavior를 결합합니다.
 */
export const ChipTabsRoot = React.forwardRef<unknown, ChipTabsRootProps>((props, ref) => {
  const [variantProps, rootProps] = chipTabs.splitVariantProps(props);
  const getClassNames = React.useCallback(
    (state: ChipTabsRecipeState = {}) =>
      chipTabs({
        ...variantProps,
        selected: state.selected,
        pressed: state.pressed,
        disabled: state.disabled,
        inCarousel: state.inCarousel,
      }),
    [variantProps],
  );
  const recipe = React.useMemo(
    () => ({
      getClassNames,
      triggerGap: CHIP_TABS_TRIGGER_GAP,
    }),
    [getClassNames],
  );

  return (
    <ChipTabsClassNamesProvider value={getClassNames()}>
      <TabsRootPrimitive {...rootProps} ref={ref} recipe={recipe} inlineNotification />
    </ChipTabsClassNamesProvider>
  );
});
ChipTabsRoot.displayName = "ChipTabsRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface ChipTabsListProps extends Omit<TabsListProps, "scrollAlign"> {
  /** 선택한 chip을 목록 안에서 정렬할 방식입니다. @defaultValue "nearest" */
  scrollAlign?: TabsListProps["scrollAlign"];
}

/**
 * ChipTabs는 이미 보이는 선택 chip을 움직이지 않도록 기본적으로 `"nearest"`를 사용합니다.
 */
export const ChipTabsList = React.forwardRef<unknown, ChipTabsListProps>(
  ({ scrollAlign = "nearest", ...props }, ref) => (
    <TabsList {...props} ref={ref} scrollAlign={scrollAlign} />
  ),
);
ChipTabsList.displayName = "ChipTabsList";

////////////////////////////////////////////////////////////////////////////////////

/** Native text label and optional inline notification slot을 갖는 chip trigger입니다. */
export interface ChipTabsTriggerProps extends TabsTriggerProps {}

export const ChipTabsTrigger = TabsTrigger;

////////////////////////////////////////////////////////////////////////////////////

export interface ChipTabsContentProps extends TabsContentProps {}

export const ChipTabsContent = TabsContent;

////////////////////////////////////////////////////////////////////////////////////

/** @platform Lynx native viewpager를 사용하므로 Tabs Carousel의 미지원 prop과 동일합니다. */
export interface ChipTabsCarouselProps extends TabsCarouselProps {}

export const ChipTabsCarousel = TabsCarousel;

////////////////////////////////////////////////////////////////////////////////////

export interface ChipTabsCarouselCameraProps extends TabsCarouselCameraProps {}

export const ChipTabsCarouselCamera = TabsCarouselCamera;
