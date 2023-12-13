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
