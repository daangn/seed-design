import dedent from "string-dedent";

const SPRITE_CDN_URL =
  "https://cdn.seed-design.io/icon@0.0.0-20230130.1/all-sprite.svg";

// 1. Provider를 그냥 제공을 해주는 게 나을지
// 2. provider를 그냥 유저가 생성해서 감싸게 하는것이 나을지

export function generateContext() {
  return dedent`
    import { createContext, type PropsWithChildren } from "react";

    const SEED_ICON_SPRITE_CDN_URL = "${SPRITE_CDN_URL}";

    export const SeedIconContext = createContext(SEED_ICON_SPRITE_CDN_URL);
    
    export const SeedIconProvider = ({ children, spriteUrl }: PropsWithChildren<SeedIconProviderProps>) => {
      return (
        <SeedIconContext.Provider value={spriteUrl || SEED_ICON_SPRITE_CDN_URL}>
          {children}
        </SeedIconContext.Provider>
      )
    };

    interface SeedIconProviderProps {
      spriteUrl: string;
    };\n
  `;
}
