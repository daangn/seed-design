import dedent from "string-dedent";
import { generateRelativeFilePath } from "../utils/path";

import type { IconName } from "../types";

interface ComponentInterface {
  componentOutputPath: string;
  componentFileName: string;
  spriteOutputPath: string;
  spriteFileName: string;
  version: string;
  icons: IconName[];
}

export default function generate({
  componentOutputPath,
  componentFileName,
  spriteOutputPath,
  spriteFileName,
  version,
  icons,
}: ComponentInterface) {
  const relativeSpritePath = generateRelativeFilePath(
    componentOutputPath,
    spriteOutputPath,
  );
  const spriteUrl = relativeSpritePath.endsWith("/")
    ? `${relativeSpritePath}${spriteFileName}.svg`
    : `${relativeSpritePath}/${spriteFileName}.svg`;

  return dedent`
    import { forwardRef, type ForwardRefRenderFunction } from "react";
    import spriteUrl from "${spriteUrl}";

    export interface ${componentFileName}Props {
      name: IconName;
      size?: number;
      className?: string;
    };

    const ${componentFileName}: ForwardRefRenderFunction<HTMLSpanElement, SeedIconProps> = (
      { name, className, size },
      ref,
    ) => {
      return  (
        <span
          ref={ref}
          style={{ display: "inline-flex", width: size, height: size }}
          className={className}
          data-seed-icon={name}
          data-seed-icon-version="${version}"
        >
          <svg viewBox="0 0 24 24">
            <use href={\`\${spriteUrl}#\${name}\`} />
          </svg>
        </span>
      );
    };
    
    export default forwardRef(${componentFileName});

    type IconName = (
      | ${icons.map((icon) => `"${icon}"`).join("\n  | ")}
    );\n
  `;
}
