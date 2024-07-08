export interface UseTabsStateProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export interface UseTabsProps extends UseTabsStateProps {}

export interface TriggerProps {
  value: string;
  isDisabled?: boolean;
}

export interface ContentProps {
  value: string;
}
