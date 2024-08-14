export type Vector2 = [number, number];

export interface UseTabsStateProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export interface UseTabsProps extends UseTabsStateProps {
  /**
   * tab swipe 기능 활성화 여부
   * @default false
   */
  isSwipeable?: boolean;

  /**
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical";

  /**
   * @default "hug"
   */
  layout?: "fill" | "hug";

  swipeConfig?: {
    /**
     * @default 0.3
     * The minimum velocity per axis (in pixels / ms) the drag gesture needs to
     * reach before the pointer is released.
     */
    velocity?: number | Vector2;
    /**
     * @default 50
     * The minimum distance per axis (in pixels) the drag gesture needs to
     * travel to trigger a swipe. Defaults to 50.
     */
    distance?: number | Vector2;
    /**
     * @default 250
     * The maximum duration in milliseconds that a swipe is detected. Defaults
     * to 250.
     */
    duration?: number;
  };
}

export interface TriggerProps {
  value: string;
  isDisabled?: boolean;
}

export interface ContentProps {
  value: string;
}
