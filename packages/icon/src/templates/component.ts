import dedent from "string-dedent";
import { generateRelativeFilePath } from "../utils/path";

import type { IconName } from "../types";

interface DynamicImportComponentInterface {
  componentDir: string;
  componentFileName: string;
  contextDir: string;
  contextFileName: string;
  version: string;
  icons: IconName[];
}

export function generateDynamicImportComponent({
  componentDir,
  componentFileName,
  contextDir,
  contextFileName,
  version,
  icons,
}: DynamicImportComponentInterface) {
  const relativeSpritePath = generateRelativeFilePath(componentDir, contextDir);
  const contextUrl = relativeSpritePath.endsWith("/")
    ? `${relativeSpritePath}${contextFileName}.tsx`
    : `${relativeSpritePath}/${contextFileName}.tsx`;

  return dedent`
    import { forwardRef, useContext, type ForwardRefRenderFunction } from "react";
    import SeedIconContext from "${contextUrl}";

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

// import { forwardRef, type ForwardRefRenderFunction, useContext } from 'react';
// import { SeedIconContext, createSeedIcon } from '@seed-design/icon/react';

// export interface SeedIconProps {
//   name: IconName;
//   size: 'sm' | 'md' | 'lg' | 'xl';
//   className?: string;
// }

// export const SeedIcon = createSeedIcon<IconName>();

// const SeedIcon: ForwardRefRenderFunction<HTMLSpanElement, SeedIconProps> = (
//   { name, size, className },
//   ref
// ) => {
//   const { spriteUrl, sizes } = useContext(SeedIconContext);
//   return (
//     <span ref={ref} className={className} data-seed-icon={name} data-seed-icon-version="0.0.7">
//       <svg viewBox="0 0 24 24" width={sizes[size].width} height={sizes[size].height}>
//         <use href={`${spriteUrl}#${name}`} />
//       </svg>
//     </span>
//   );
// };

// export default forwardRef(SeedIcon);

// type IconName =
//   | 'icon_loudspeaker_regular'
//   | 'icon_chevron_right_regular'
//   | 'icon_close_regular'
//   | 'icon_add_thin'
//   | 'icon_close_thin'
//   | 'icon_check_fill'
//   | 'icon_subtraction_fill'
//   | 'icon_expand_less_regular'
//   | 'icon_expand_more_regular';
