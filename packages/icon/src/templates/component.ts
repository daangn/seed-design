import { join } from 'path';
import dedent from 'string-dedent';
import { generateRelativePath } from '../utils/path';

import type { IconName } from '../types';

interface ComponentInterface {
  componentOutputPath: string;
  spriteOutputPath: string;
  spriteFileName: string;
  version: string;
  icons: IconName[];
}

export default function generate({ componentOutputPath, spriteOutputPath, spriteFileName, version, icons }: ComponentInterface) {
  const relativeSpritePath = generateRelativePath(componentOutputPath, spriteOutputPath);
  const relativeSpriteUrl = join(relativeSpritePath, `${spriteFileName}.svg`);

  return dedent`
    import { forwardRef, type ForwardRefRenderFunction } from "react";
    import spriteUrl from "${relativeSpriteUrl}";

    export interface SeedIconProps {
      name: IconName;
      className?: string;
    };

    const SeedIcon: ForwardRefRenderFunction<HTMLSpanElement, SeedIconProps> = (
      { name, className },
      ref,
    ) => {
      return  (
        <span
          ref={ref}
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
    
    export default forwardRef(SeedIcon);

    type IconName = (
      | ${icons.map((icon) => `"${icon}"`).join('\n  | ')}
    );\n
  `;
}
