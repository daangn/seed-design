import { elementProps } from "@ride-developer/dom-utils";
import * as React from "react";

export interface UsePendingButtonProps {
  /**
   * 버튼에 등록된 비동기 작업이 진행 중임을 사용자에게 알립니다.
   * @default false
   */
  loading?: boolean;

  /**
   * 버튼의 비활성화 여부를 나타냅니다.
   * @default false
   */
  disabled?: boolean;
}

export type UsePendingButtonReturn = ReturnType<typeof usePendingButton>;

export function usePendingButton(props: UsePendingButtonProps) {
  const { loading, disabled } = props;
  const stateProps = elementProps({
    "data-loading": loading ? "" : undefined,
    "data-disabled": disabled ? "" : undefined,
  });

  return {
    loading,
    disabled,
    stateProps,
  };
}

const PendingButtonContext = React.createContext<ReturnType<typeof usePendingButton> | null>(null);

export const PendingButtonProvider = PendingButtonContext.Provider;

export const usePendingButtonContext = () => {
  const context = React.useContext(PendingButtonContext);
  if (context === null) {
    throw new Error("usePendingButtonContext should be used within UsePendingButtonProvider");
  }

  return context;
};
