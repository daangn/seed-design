import dedent from "string-dedent";

export function generateContext() {
  return dedent`
    // @ts-nocheck
    /* eslint-disable */
    import { createContext, type PropsWithChildren } from "react";

    interface SeedIconProviderProps {
      spriteUrl: string;
    };

    export const SeedIconContext = createContext("");
    
    export const SeedIconProvider = ({ children, spriteUrl }: PropsWithChildren<SeedIconProviderProps>) => {
      return (
        <SeedIconContext.Provider value={spriteUrl}>
          {children}
        </SeedIconContext.Provider>
      )
    };\n
  `;
}
