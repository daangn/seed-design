import React, { createContext, useContext, useState } from "react";

interface ColorPaletteProps {
  computedStyle: CSSStyleDeclaration | undefined;
  hash: string;
}

const ColorPaletteContext = createContext<ColorPaletteProps | null>(null);

export function ColorPaletteProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [computedStyle, setComputedStyle] = useState<CSSStyleDeclaration>();
  const [hash, setHash] = useState<string>("");

  // html data-seed-scale-color attribute가 바뀔 때 마다
  // window.getComputedStyle(document.body)를 호출하여 computedStyle을 업데이트 해준다.
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const observer = new MutationObserver(() => {
      const style = window.getComputedStyle(document.body);
      setComputedStyle(style);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-seed-scale-color"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const style = window.getComputedStyle(document.body);
    setComputedStyle(style);
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const handleRouteChange = () => {
      const url = new URL(window.location.href);
      setHash(url.hash.slice(1));
    };

    handleRouteChange();

    window.addEventListener("hashchange", handleRouteChange);
    return () => {
      window.removeEventListener("hashchange", handleRouteChange);
    };
  }, []);

  return (
    <ColorPaletteContext.Provider value={{ computedStyle, hash }}>
      {children}
    </ColorPaletteContext.Provider>
  );
}

export const useColorPaletteState = () => {
  const state = useContext(ColorPaletteContext);
  if (!state) throw new Error("Cannot find ColorPaletteContext Provider");
  return state;
};
