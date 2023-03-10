import dedent from "string-dedent";
import { generateRelativeFilePath } from "../utils/path";

import type { IconName } from "../types";

interface ComponentWithoutContextInterface {
  componentDir: string;
  componentFileName: string;
  spriteDir: string;
  spriteFileName: string;
  version: string;
  icons: IconName[];
}

export function generateComponentWithoutContext({
  componentDir,
  componentFileName,
  spriteDir,
  spriteFileName,
  version,
  icons,
}: ComponentWithoutContextInterface) {
  const relativeSpritePath = generateRelativeFilePath(componentDir, spriteDir);
  const spriteUrl = relativeSpritePath.endsWith("/")
    ? `${relativeSpritePath}${spriteFileName}.svg`
    : `${relativeSpritePath}/${spriteFileName}.svg`;

  return dedent`
    /* eslint-disable */
    import * as React from "react";
    import spriteUrl from "${spriteUrl}";

    export interface ${componentFileName}Props {
      name: IconName;
      size?: number | string;
      className?: string;
    };

    const ${componentFileName}: React.ForwardRefRenderFunction<HTMLSpanElement, SeedIconProps> = (
      { name, className, size },
      ref,
    ) => {
      const isMobileSafari =
        navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
        navigator.userAgent.match(/AppleWebKit/);
      return  (
        <span
          ref={ref}
          style={{ display: "inline-flex", width: size, height: size }}
          className={className}
          data-seed-icon={name}
          data-seed-icon-version="${version}"
        >
          <svg viewBox="0 0 24 24">
            {isMobileSafari
              ? <use xlinkHref={\`\${spriteUrl}#\${name}\`} />
              : <use href={\`\${spriteUrl}#${name}\`} />}
          </svg>
        </span>
      );
    };
    
    export default React.forwardRef(${componentFileName});
    type IconName = (
      | ${icons.map((icon) => `"${icon}"`).join("\n  | ")}
    );\n
  `;
}
