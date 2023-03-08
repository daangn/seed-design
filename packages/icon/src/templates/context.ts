import dedent from "string-dedent";

export function generateContext() {
  return dedent`
    /* eslint-disable */
    import * as React from "react";

    interface SeedIconProviderProps {
      spriteUrl: string;
    };

    export const SeedIconContext = React.createContext("");
    
    export const SeedIconProvider = ({ children, spriteUrl }: React.PropsWithChildren<SeedIconProviderProps>) => {
      return (
        <SeedIconContext.Provider value={spriteUrl}>
          {children}
        </SeedIconContext.Provider>
      )
    };\n
  `;
}
