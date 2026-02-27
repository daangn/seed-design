"use client";

import * as React from "react";
import { type Options, useQueryState } from "nuqs";

interface IconData {
  name: string;
  metadatas: string[];
  svg: string;
  figma?: {
    name: string;
    key: string;
    description: string;
  };
  png: {
    "1x"?: string;
    "2x"?: string;
    "3x"?: string;
    "4x"?: string;
  };
}

type Platform = "react" | "figma";

interface PreviewColor {
  tokenName: string;
  cssVar: string;
}

interface State {
  iconData: {
    monochrome: Record<string, IconData>;
    multicolor: Record<string, IconData>;
  };
  iconComponents: {
    monochrome: Record<string, React.ComponentType>;
    multicolor: Record<string, React.ComponentType>;
  };

  search: string;
  setSearch: (
    value: string | ((old: string) => string | null) | null,
    options?: Options,
  ) => Promise<URLSearchParams>;

  selectedIcon?: IconData;
  selectedIconName: string;
  setSelectedIconName: (
    value: string | ((old: string) => string | null) | null,
    options?: Options,
  ) => Promise<URLSearchParams>;

  iconStyle: "monochrome" | "multicolor";
  setIconStyle: (
    value:
      | "monochrome"
      | "multicolor"
      | ((old: "monochrome" | "multicolor") => "monochrome" | "multicolor" | null)
      | null,
    options?: Options,
  ) => Promise<URLSearchParams>;

  platform: Platform;
  setPlatform: (
    value: Platform | ((old: Platform) => Platform | null) | null,
    options?: Options,
  ) => Promise<URLSearchParams>;

  previewColor: PreviewColor | null;
  setPreviewColor: React.Dispatch<React.SetStateAction<PreviewColor | null>>;

  previewSize: number;
  setPreviewSize: React.Dispatch<React.SetStateAction<number>>;
}

const context = React.createContext<State | null>(null);

export const IconProvider = ({
  children,
  iconData,
  iconComponents,
}: React.PropsWithChildren<{
  iconData: {
    monochrome: Record<string, IconData>;
    multicolor: Record<string, IconData>;
  };
  iconComponents: {
    monochrome: Record<string, React.ComponentType>;
    multicolor: Record<string, React.ComponentType>;
  };
}>) => {
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [selectedIconName, setSelectedIconName] = useQueryState("icon", { defaultValue: "" });
  const [iconStyle, setIconStyle] = useQueryState<"monochrome" | "multicolor">("style", {
    defaultValue: "monochrome",
    parse: (value) => value as "monochrome" | "multicolor",
  });
  const [platform, setPlatform] = useQueryState<Platform>("platform", {
    defaultValue: "react",
    parse: (value) => value as Platform,
  });

  const [previewColor, setPreviewColor] = React.useState<PreviewColor | null>(null);
  const [previewSize, setPreviewSize] = React.useState(24);

  // 선택된 아이콘 상태 관리
  const selectedIcon = React.useMemo(() => {
    if (!selectedIconName) return undefined;
    return iconData[iconStyle][selectedIconName];
  }, [selectedIconName, iconStyle, iconData]);

  // 아이콘 변경 시 프리뷰 상태 초기화
  React.useEffect(() => {
    setPreviewColor(null);
    setPreviewSize(24);
  }, [selectedIconName]);

  // 컨텍스트 값 메모이제이션
  const contextValue = React.useMemo(
    () => ({
      search,
      iconStyle,
      iconData,
      iconComponents,
      selectedIcon,
      selectedIconName,
      setSearch,
      setIconStyle,
      setSelectedIconName,
      platform,
      setPlatform,
      previewColor,
      setPreviewColor,
      previewSize,
      setPreviewSize,
    }),
    [
      search,
      iconStyle,
      iconData,
      iconComponents,
      selectedIcon,
      selectedIconName,
      setSearch,
      setIconStyle,
      setSelectedIconName,
      platform,
      setPlatform,
      previewColor,
      previewSize,
    ],
  );

  return <context.Provider value={contextValue}>{children}</context.Provider>;
};

export const useIcon = () => {
  const data = React.useContext(context);

  if (!data) {
    throw new Error("IconProvider not found");
  }

  return data;
};
