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
    /* eslint-disable */
    import * as React from "react";
    import { SeedIconContext } from "${contextUrl}";

    export interface ${componentFileName}Props {
      name: IconName;
      size?: number | string;
      className?: string;
    };

    const ${componentFileName}: React.ForwardRefRenderFunction<HTMLSpanElement, SeedIconProps> = (
      { name, className, size },
      ref,
    ) => {
      const spriteUrl = React.useContext(SeedIconContext);
      const [isMobileSafari, setIsMobileSafari] = React.useState(false);

      React.useEffect(() => {
        if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
          return;
        }

        if (navigator.userAgent.match(/AppleWebKit/)) {
          setIsMobileSafari(true);
        }
      }, []);

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
              : <use href={\`\${spriteUrl}#\${name}\`} />}
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
