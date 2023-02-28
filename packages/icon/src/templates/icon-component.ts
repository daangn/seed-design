import dedent from "string-dedent";
import IconData from "@karrotmarket/karrot-ui-icon/lib/IconData.js";

import type { IconName } from "../types";

interface ComponentTemplateInterface {
  componentFileName: string;
  version: string;
  icons: IconName[];
}

const removeProperty = (svg: string, prop: string) => {
  const regex = new RegExp(`(${prop}=".*?")`, "g");
  const rest = svg.replace(regex, "");
  return rest;
};

const addProperty = (svg: string, prop: string, value: string) => {
  const regex = new RegExp(`(<svg)`, "g");
  const rest = svg.replace(regex, `$1 ${prop}="${value}"`);
  return rest;
};

export function generateIconComponent({
  componentFileName,
  version,
  icons,
}: ComponentTemplateInterface) {
  return dedent`
    /* eslint-disable */
    import { type ForwardRefRenderFunction, forwardRef } from "react";

    export type IconName = keyof typeof icons;
    export interface ${componentFileName}Props {
      name: IconName;
      size?: number | string;
      className?: string;
    }

    const ${componentFileName}: ForwardRefRenderFunction<HTMLSpanElement, SeedIconProps> = (
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
          dangerouslySetInnerHTML={{ __html: icons[name] }}
        /> 
      );
    };
    
    export default forwardRef(${componentFileName});

    const icons = {
      ${icons
        .map((icon) => {
          const iconData = IconData[icon];
          const removedWidth = removeProperty(iconData, "width");
          const removedHeight = removeProperty(removedWidth, "height");
          const withAriaHidden = addProperty(
            removedHeight,
            "aria-hidden",
            "true",
          );
          return `"${icon}": \`${withAriaHidden}\``;
        })
        .join(",\n  ")}
    };\n
  `;
}
