// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
// Modified by SEED Design: internalized and adapted to the SEED workspace.

import type { ReactNode } from "@lynx-js/react";

import type { ComponentBasicProps } from "@lynx-js/lynx-ui-common";
import type { OverlayViewProps } from "@lynx-js/lynx-ui-overlay";

export type SheetSide = "top" | "bottom" | "left" | "right" | "start" | "end";

export interface SheetRootRef {
  snapTo: (index: number, opts?: { animate?: boolean; snapAnimation?: SheetTransition }) => void;
  expand: (opts?: { animate?: boolean; snapAnimation?: SheetTransition }) => void;
  collapse: (opts?: { animate?: boolean; snapAnimation?: SheetTransition }) => void;
  close: (opts?: { animate?: boolean; snapAnimation?: SheetTransition }) => void;
  open: (opts?: { animate?: boolean; snapAnimation?: SheetTransition }) => void;
}

/**
 * The backdrop mask of the Sheet.
 * @zh Sheet 的背景遮罩。
 */
export interface SheetBackdropProps extends ComponentBasicProps {
  /**
   * children
   * @zh 子元素
   * @Android
   * @iOS
   * @Harmony
   */
  children?: ReactNode;
  /**
   * Triggered when the backdrop is clicked.
   * @zh 点击背景时触发。
   * @Android
   * @iOS
   * @Harmony
   */
  onClick?: () => void;
  /**
   * Whether to close the Sheet when the overlay is clicked.
   * @zh 点击遮罩时是否关闭 Sheet。
   * @defaultValue true
   * @Android
   * @iOS
   * @Harmony
   */
  clickToClose?: boolean;
}

export interface SheetTransitionSpring {
  type: "spring";
  stiffness?: number;
  damping?: number;
  mass?: number;
}

export interface SheetTransitionTween {
  type: "tween";
  duration?: number;
  ease?: (t: number) => number;
}

export type SheetTransition = SheetTransitionSpring | SheetTransitionTween;

/**
 * The main content of the Sheet.
 * @zh Sheet 的主要内容。
 */
export interface SheetContentProps extends ComponentBasicProps {
  /**
   * The transition configuration for the Sheet snap animation.
   * @zh Sheet 动画的过渡配置。
   */
  snapAnimation?: SheetTransition;
  /**
   * The enter animation configuration.
   * @zh Sheet 进入动画配置。
   */
  enterAnimation?: SheetTransition;
  /**
   * The exit animation configuration.
   * @zh Sheet 退出动画配置。
   */
  exitAnimation?: SheetTransition;
  /**
   * CSS class name for the inner layer.
   * Use this for content layout and sizing styles. In horizontal drawer mode,
   * the drawer width should be set here so `'fit'` can resolve from the
   * measured drawer width.
   * @zh 内层容器的 CSS 类名。
   * 用于设置内容区域的布局和尺寸样式。
   * 在水平抽屉模式下，应在这里设置抽屉宽度，这样 `'fit'` 才能根据测量得到的抽屉宽度完成解析。
   * @Android
   * @iOS
   * @Harmony
   */
  innerClassName?: string;
  /**
   * Inline styles for the inner layer.
   * Use this for content layout and sizing styles.
   * Note: Visual styles (background, borderRadius, etc.) should be set via
   * the main `style` prop which applies to the moving surface layer.
   * In horizontal drawer mode, set drawer width here so `'fit'` can resolve
   * from the measured drawer width.
   * @zh 内层容器的内联样式。
   * 用于设置内容区域的布局和尺寸样式。
   * 注意：背景、圆角等视觉样式应通过主 `style` 属性设置，该属性会应用到移动的 surface 层。
   * 在水平抽屉模式下，应在这里设置抽屉宽度，这样 `'fit'` 才能根据测量得到的抽屉宽度完成解析。
   * @Android
   * @iOS
   * @Harmony
   */
  innerStyle?: ComponentBasicProps["style"];
  /**
   * children
   * @zh 子元素
   * @Android
   * @iOS
   * @Harmony
   */
  children?: ReactNode;
}

/**
 * The root component of the Sheet, containing all of its child components.
 * @zh Sheet 的根组件，包含其所有子组件。
 */
export interface SheetRootProps extends ComponentBasicProps {
  /**
   * The side from which the sheet enters.
   * `bottom` preserves the existing bottom-sheet behavior.
   * `top` provides top-sheet behavior.
   * `left` and `right` provide physical drawer behavior.
   * `start` and `end` provide logical drawer behavior and resolve against `enableRTL`.
   * @defaultValue 'bottom'
   * @zh Sheet 进入的边。`bottom` 保持现有底部弹层行为，`top` 提供顶部弹层行为，`left` 和 `right` 提供物理抽屉方向，`start` 和 `end` 提供逻辑抽屉方向并根据 `enableRTL` 解析。
   */
  side?: SheetSide;
  /**
   * Whether the Sheet should use RTL direction.
   * This sets the Sheet viewport direction to `rtl` by default and resolves
   * logical drawer sides in RTL mode.
   * When false, `start` means left and `end` means right.
   * When true, `start` means right and `end` means left.
   * Physical `left` and `right` sides are not affected by `enableRTL`.
   * @defaultValue false
   * @zh Sheet 是否使用 RTL 方向。默认会将 Sheet 视口方向设置为 `rtl`，并以 RTL 模式解析逻辑抽屉方向。为 false 时，`start` 为左侧、`end` 为右侧；为 true 时，`start` 为右侧、`end` 为左侧。物理 `left` 和 `right` 不受 `enableRTL` 影响。
   */
  enableRTL?: boolean;
  /**
   * The snap points of the Sheet. Can be pixel numbers, percentages, or 'fit'.
   * - Numbers are treated as pixel values
   * - Percentages (e.g., '50%') are relative to screen height for `top` / `bottom`,
   *   and relative to screen width for `left` / `right` / `start` / `end`
   * - 'fit' dynamically resolves to the measured content height for `top` / `bottom`,
   *   and the measured content width for `left` / `right` / `start` / `end`
   * @defaultValue ['fit']
   * The index order follows the order of this array.
   * @example snapPoints={['fit', '80%']} // First snap fits content, second is 80% of screen
   * @zh Sheet 的吸附点。可以是像素数值、百分比或 'fit'。
   * - 数字被视为像素值
   * - 百分比（例如 '50%'）在 `top` / `bottom` 模式下相对于屏幕高度，在 `left` / `right` / `start` / `end` 模式下相对于屏幕宽度
   * - 'fit' 在 `top` / `bottom` 模式下动态解析为测量的内容高度，在 `left` / `right` / `start` / `end` 模式下动态解析为测量的内容宽度
   * 索引顺序与该数组顺序一致。
   */
  snapPoints?: Array<number | string>;
  /**
   * The initial snap point index.
   * @zh 初始吸附点索引。
   */
  initialSnap?: number;
  /**
   * Callback when the snap point changes.
   * `value` is the resolved snap point in pixels.
   * @zh 吸附点变化时的回调。
   * `value` 表示换算后的像素值。
   */
  onSnapChange?: (index: number, value: number) => void;
  /**
   * The height of the Sheet container (screen height).
   * Used in vertical sheet mode (`top` / `bottom`) for percentage snap points
   * and dismissal calculations.
   * @zh Sheet 容器的高度（屏幕高度）。
   * 在垂直模式（`top` / `bottom`）下，用于计算百分比吸附点和关闭阈值。
   */
  screenHeight?: number;
  /**
   * The width of the Sheet container (screen width).
   * Used in horizontal drawer mode (`left` / `right` / `start` / `end`) for percentage snap points
   * and dismissal calculations.
   * @zh Sheet 容器的宽度（屏幕宽度）。在水平抽屉模式（`left` / `right` / `start` / `end`）中用于百分比吸附点和关闭计算。
   */
  screenWidth?: number;
  /**
   * The rubber band effect configuration.
   * By default, rubber band over-drag is enabled for vertical sheets
   * (`top` / `bottom`) and disabled for horizontal drawers
   * (`left` / `right` / `start` / `end`).
   * If true, enables default rubber band effect (coefficient 0.5).
   * If false, disables rubber band effect.
   * If number, enables rubber band effect with the specified coefficient.
   * If object, allows specifying coefficient and max distance.
   * @zh 橡皮筋效果配置。
   * 默认情况下，垂直 Sheet（`top` / `bottom`）启用橡皮筋效果，水平抽屉（`left` / `right` / `start` / `end`）禁用。
   * 如果为 true，启用默认橡皮筋效果（系数 0.5）。
   * 如果为 false，禁用橡皮筋效果。
   * 如果为数字，启用指定系数的橡皮筋效果。
   * 如果为对象，允许指定系数和最大距离。
   */
  rubberBand?: boolean | number | { coeff?: number; max?: number };
  /**
   * Whether to disable dragging on the Sheet.
   * @zh 是否禁用 Sheet 的拖拽。
   */
  dragDisabled?: boolean;
  /**
   * The threshold to dismiss the Sheet.
   * @zh Sheet 关闭的阈值。
   */
  dismissThreshold?: number;
  /**
   * Whether to restrict dragging to the handle only.
   * @zh 是否仅允许通过手柄拖拽。
   */
  handleOnly?: boolean;
  /**
   * Whether to enable dragging to close the Sheet.
   * If true, dragging from the lowest snap point toward the closed edge will move the sheet linearly and allow dismissal.
   * If false, dragging toward the closed edge will trigger rubber band effect and snap back.
   * @zh 是否允许拖拽关闭 Sheet。
   * 如果为 true，从最低吸附点向关闭边缘拖动将线性移动并允许关闭。
   * 如果为 false，向关闭边缘拖动将触发橡皮筋效果并回弹。
   * @default true
   */
  enableDragToClose?: boolean;
  /**
   * Angle ranges (in degrees) where gestures should be claimed by the Sheet.
   * Each entry is [minAngle, maxAngle]. Gestures within these angle ranges
   * will trigger sheet movement, while gestures outside these ranges are passed through.
   * see https://lynxjs.org/api/elements/built-in/view#consume-slide-event for more
   * @example [[-134, -46],[46, 134]] for claiming vertical gesture
   * @example [[-45, 45],[135, -135]] for claiming horizontal gesture
   * @zh Sheet 主动接管手势的角度范围（单位：度）。
   * 每个条目都是 `[最小角度, 最大角度]`。
   * 落在这些范围内的手势会驱动 Sheet 移动，范围外的手势则继续透传给子组件。
   */
  claimedGestureAngles?: [number, number][];

  /**
   * children
   * @zh 子元素
   * @Android
   * @iOS
   * @Harmony
   * @docTypeFallback ReactNode
   */
  children?: ReactNode;
  /**
   * Whether to show the sheet. If this property is set, the sheet will be in controlled mode,
   * meaning the defaultShow property will have no effect. You must control the visibility
   * by updating this prop based on user interactions.
   * @zh 是否显示 Sheet。如果设置此属性，Sheet 将处于受控模式，defaultShow 属性将不生效。
   * 您必须根据用户交互更新此属性来控制可见性。
   * @Android
   * @iOS
   * @Harmony
   */
  show?: boolean;
  /**
   * Whether the sheet should be shown by default. Use this for uncontrolled mode.
   * @defaultValue false
   * @Android
   * @iOS
   * @Harmony
   * @zh Sheet 是否默认显示。使用此属性表示 Sheet 处于非受控模式。
   */
  defaultShow?: boolean;
  /**
   * Mount the sheet and render its content even when not shown. The sheet remains in closed state.
   * @defaultValue false
   * @Android
   * @iOS
   * @Harmony
   * @zh 即使 Sheet 未显示也挂载并渲染内容。Sheet 仍保持关闭状态。
   */
  forceMount?: boolean;
  /**
   * Called when the sheet's visibility is about to change (e.g., backdrop click, swipe dismiss, close button).
   * In controlled mode, use this to update your state. In uncontrolled mode, this is optional.
   * @Android
   * @iOS
   * @Harmony
   * @zh 当 Sheet 可见性即将改变时触发（例如点击背景、滑动关闭、关闭按钮）。
   * 在受控模式下，使用此回调更新状态。在非受控模式下，此回调可选。
   */
  onShowChange?: (open: boolean) => void;
  /**
   * Called when the sheet has fully opened and any enter animation has finished.
   * @zh 当 Sheet 完全打开且入场动画结束时触发。
   * @Android
   * @iOS
   * @Harmony
   */
  onOpen?: () => void;
  /**
   * Called when the sheet has fully closed and any exit animation has finished.
   * @zh 当 Sheet 完全关闭且退出动画结束时触发。
   * @Android
   * @iOS
   * @Harmony
   */
  onClose?: () => void;
}

/**
 * The handle of the Sheet.
 * @zh Sheet 的拖拽手柄。
 */
export interface SheetHandleProps extends ComponentBasicProps {
  /**
   * children
   * @zh 子元素
   * @Android
   * @iOS
   * @Harmony
   */
  children?: ReactNode;
}

/**
 * The view container of the Sheet. Can be `x-overlay-ng` or `view`.
 * Controls the Sheet's overlay layer and stacking order.
 * @zh Sheet 的视图容器，可以是 `x-overlay-ng` 或 `view`。
 * 用于控制 Sheet 所在的覆盖层及其层级顺序。
 */
export interface SheetViewProps extends ComponentBasicProps {
  /**
   * id
   * @Android
   * @iOS
   * @Harmony
   * @zh 标识符
   */
  id?: string;
  /**
   * children
   * @Android
   * @iOS
   * @Harmony
   * @zh 子元素
   */
  children: ReactNode;
  /**
   * If you want to render the Sheet outside of the LynxView, set this property.
   * The values 'spark', 'bullet', and 'bulletPopup' are names of native containers.
   * For example, on TikTok it should be 'spark', and on Douyin it should be 'bullet'.
   * On iOS, this prop can also be any native view controller that should host the Sheet.
   * Use it to place the Sheet in the correct native layer.
   * @Android
   * @iOS
   * @Harmony
   * @docTypeFallback 'spark' | 'bullet' | 'bulletPopup' | (string & {})
   * @zh 如果需要将 Sheet 渲染到 LynxView 外部，请设置此属性。
   * `'spark'`、`'bullet'` 和 `'bulletPopup'` 都是原生容器名称。
   * 例如在 TikTok 中通常应设置为 `'spark'`，在抖音中通常应设置为 `'bullet'`。
   * 在 iOS 上，这个属性也可以是任意一个用于承载 Sheet 的原生视图控制器。
   * 通过它可以将 Sheet 放到正确的原生层级中。
   */
  container?: "spark" | "bullet" | "bulletPopup" | (string & {});
  /**
   * Only works when the 'container' is set to non-empty string. Adjust nearby elements display level.
   * @Android
   * @iOS
   * @Harmony
   * @zh 仅当 `container` 为非空字符串时生效。
   * 用于调整周边元素的显示层级。
   */
  overlayLevel?: 1 | 2 | 3 | 4;
  /**
   * Additional props that will be passed through to the underlying element.
   * @zh 会透传到底层元素的额外属性。
   * @Android
   * @iOS
   * @Harmony
   */
  nativeProps?: OverlayViewProps["overlayViewProps"];
}
