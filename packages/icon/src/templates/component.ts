import dedent from "string-dedent";

import type { IconName } from "../types";

interface ComponentInterface {
  componentFileName: string;
  version: string;
  icons: IconName[];
}

export function generateComponent({
  componentFileName,
  version,
  icons,
}: ComponentInterface) {
  return dedent`
    /* eslint-disable */
    import * as React from "react";
    import { iconData } from "./IconData";

    export interface ${componentFileName}Props {
      name: IconName;
      size?: number | string;
      className?: string;
    };

    const ${componentFileName}: React.ForwardRefRenderFunction<HTMLSpanElement, ${componentFileName}Props> = (
      { name, className, size },
      ref,
    ) => {
      return (
        <span
          ref={ref}
          style={{ display: "inline-flex", width: size, height: size }}
          className={className}
          data-seed-icon={name}
          data-seed-icon-version="${version}"
        >
          {iconData[name]}
        </span>
      );
    };

    export default React.forwardRef(${componentFileName});
    type IconName = (
      | ${icons.map((icon) => `"${icon}"`).join("\n  | ")}
    );\n
  `;
}
