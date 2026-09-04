"use client";

import { FLYOUT_NEUTRAL_SURFACE } from "@/components/docs-menu";
import {
  NavigationMenuContent,
  type NavigationMenuContentProps,
} from "@/registry/react/ui/navigation-menu";
import { clsx } from "cn";

/**
 * Docs-only NavigationMenu flyout wrapper.
 *
 * The shared SEED `menu` recipe paints the flyout surface with
 * `var(--seed-color-bg-layer-floating)`, which resolves to a cool `palette-gray` (a slight
 * blue tint in both themes). We must not edit the SEED recipe (it's the design spec), so we
 * retarget that variable to the neutral `fd-popover` token **on this element only**: the
 * recipe still reads `--seed-color-bg-layer-floating`, but on this flyout it now composites
 * to true gray, matching the neutral search card. An element-level custom-property override
 * beats the inherited `:root` value the recipe reads, so no `!important` or recipe change is
 * needed. The same local override also lowers the recipe's `s3` shadow to `s2`.
 * Use this in place of `NavigationMenuContent` for the docs/landing header dropdowns.
 */
export function DocsNavigationMenuContent({ className, ...props }: NavigationMenuContentProps) {
  return <NavigationMenuContent className={clsx(FLYOUT_NEUTRAL_SURFACE, className)} {...props} />;
}
