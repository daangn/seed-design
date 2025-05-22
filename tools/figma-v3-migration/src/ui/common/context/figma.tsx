import { useContext, useEffect } from "react";

import { type ReactNode, useState } from "react";

import { createContext } from "react";
import { events } from "shared/event";
import type { FigmaMetadata } from "shared/types";

// FigmaMetadata 컨텍스트
interface FigmaMetadataContextType {
  metadata: FigmaMetadata | null;
}

const FigmaMetadataContext = createContext<FigmaMetadataContextType | null>(null);

export function FigmaMetadataProvider({ children }: { children: ReactNode }) {
  const [metadata, setMetadata] = useState<FigmaMetadata | null>(null);

  useEffect(() => {
    const unsubscribe = events("send-figma-metadata").on((data) => {
      setMetadata(data);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <FigmaMetadataContext.Provider value={{ metadata }}>{children}</FigmaMetadataContext.Provider>
  );
}

export function useFigmaMetadata() {
  const context = useContext(FigmaMetadataContext);
  if (!context) {
    throw new Error("useFigmaMetadata must be used within a FigmaMetadataProvider");
  }
  return context;
}
