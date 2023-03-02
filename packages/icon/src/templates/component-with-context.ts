import dedent from "string-dedent";
import { generateRelativeFilePath } from "../utils/path";

import type { IconName } from "../types";

interface ComponentWithContextInterface {
  componentDir: string;
  componentFileName: string;
  contextDir: string;
  contextFileName: string;
  version: string;
  icons: IconName[];
}

export function generateComponentWithContext({
  componentDir,
  componentFileName,
  contextDir,
  contextFileName,
  version,
  icons,
}: ComponentWithContextInterface) {
  const relativeContextPath = generateRelativeFilePath(
    componentDir,
    contextDir,
  );
  const contextUrl = relativeContextPath.endsWith("/")
    ? `${relativeContextPath}${contextFileName}`
    : `${relativeContextPath}/${contextFileName}`;

  return dedent`
    // @ts-nocheck
    /* eslint-disable */
    import { forwardRef, useContext, type ForwardRefRenderFunction } from "react";
    import { SeedIconContext } from "${contextUrl}";

    export interface ${componentFileName}Props {
      name: IconName;
      size?: number;
      className?: string;
    };

    const ${componentFileName}: ForwardRefRenderFunction<HTMLSpanElement, SeedIconProps> = (
      { name, className, size },
      ref,
    ) => {
      const spriteUrl = useContext(SeedIconContext);
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