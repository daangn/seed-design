export interface UseTabsStateProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export interface UseTabsProps extends UseTabsStateProps {
  /**
   * lazy loading 활성화 여부
   * @default false
   */
  isLazy?: boolean;

  /**
   * lazy loading 모드
   * @default "keepMounted"
   */
  lazyMode?: "unmount" | "keepMounted";
}

export interface TriggerProps {
  value: string;
  isDisabled?: boolean;
}

export interface ContentProps {
  value: string;
}
