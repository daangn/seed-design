import { createContext, useContext, type Context } from "@lynx-js/react";
import type { CSSProperties, IntrinsicElements, NodesRef } from "@lynx-js/types";

type ViewProps = IntrinsicElements["view"];
type LayoutHandler = NonNullable<ViewProps["bindlayoutchange"]>;

/** `SelectContent`가 목록 viewport에 넘기는 연결 정보입니다. */
export interface SelectScrollAreaBinding {
  scrollAreaProps: {
    ref: (node: NodesRef | null) => void;
    /** 목록 안 항목 위치를 viewport 기준으로 측정할 때 쓰는 id입니다. */
    id: string | undefined;
    "scroll-orientation": "vertical";
    /** 목록이 계산한 높이보다 길 때만 `true`입니다. */
    "enable-scroll": boolean;
    /** 위치를 계산한 뒤 viewport 높이입니다. */
    style: CSSProperties | undefined;
  };
  /** viewport 안에서 목록 전체를 감싸는 native `<view>`에 펼칩니다. 이 요소의 크기로 위치를 계산합니다. */
  contentProps: {
    ref: (node: NodesRef | null) => void;
    bindlayoutchange: LayoutHandler;
  };
}

export const SelectScrollAreaContext: Context<SelectScrollAreaBinding | null> =
  createContext<SelectScrollAreaBinding | null>(null);

/**
 * @platform Lynx
 *
 * `SelectContent` 안에서 목록 viewport(`scroll-view`)와 그 안의 목록 `<view>`에 펼칠 props를 읽습니다.
 * `SelectContent`는 목록 `<view>`의 크기로 위치를 계산하고, 열 때 선택 항목이 보이도록 viewport를 스크롤합니다.
 * `SelectScrollArea`를 쓰지 않고 viewport를 직접 렌더링할 때 사용합니다.
 */
export function useSelectScrollArea(): SelectScrollAreaBinding {
  const binding = useContext(SelectScrollAreaContext);
  if (!binding) throw new Error("useSelectScrollArea must be used within a SelectContent");
  return binding;
}
