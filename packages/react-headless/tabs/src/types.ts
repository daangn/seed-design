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
}

export interface TriggerProps {
  value: string;
  isDisabled?: boolean;
}

export interface ContentProps {
  value: string;
}
