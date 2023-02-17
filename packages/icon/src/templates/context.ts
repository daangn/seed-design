import dedent from "string-dedent";
import { generateRelativeFilePath } from "../utils/path";

interface ContextInterface {
  spriteDir: string;
  spriteFileName: string;
  contextDir: string;
}

export function generateContext({
  contextDir,
  spriteDir,
  spriteFileName,
}: ContextInterface) {
  const relativeSpritePath = generateRelativeFilePath(contextDir, spriteDir);
  const spriteUrl = relativeSpritePath.endsWith("/")
    ? `${relativeSpritePath}${spriteFileName}`
    : `${relativeSpritePath}/${spriteFileName}`;

  return dedent`
    import { createContext, type PropsWithChildren } from "react";
    import spriteRelativeUrl from "${spriteUrl}.svg";

    interface SeedIconProviderProps {
      spriteUrl?: string;
    };

    export const SeedIconContext = createContext(spriteRelativeUrl);
    
    export const SeedIconProvider = ({ children, spriteUrl }: PropsWithChildren<SeedIconProviderProps>) => {
      return (
        <SeedIconContext.Provider value={spriteUrl || spriteRelativeUrl}>
          {children}
        </SeedIconContext.Provider>
      )
    };\n
  `;
}
