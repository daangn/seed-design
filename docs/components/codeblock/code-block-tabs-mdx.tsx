"use client";

import { Children, type ReactElement, type ReactNode, isValidElement } from "react";
import { CodeTabContext } from "./code-tab-context";
import { CodeTabsShell, type CodeTabsShellItem } from "./code-tabs";

/**
 * SEED replacements for Fumadocs' `CodeBlockTabs` family. Fumadocs' `remarkNpm`
 * (configured via `remarkNpmOptions` in `source.config.ts`) turns ```` ```package-install ````
 * fences into:
 *
 *   <CodeBlockTabs groupId="package-manager" persist>
 *     <CodeBlockTabsList>
 *       <CodeBlockTabsTrigger value="npm">npm</CodeBlockTabsTrigger> …
 *     </CodeBlockTabsList>
 *     <CodeBlockTab value="npm">```bash …```</CodeBlockTab> …
 *   </CodeBlockTabs>
 *
 * We intercept `CodeBlockTabs`, flatten that structure, and render one merged SEED chip
 * card (`CodeTabsShell`) — so the tabs sit inside the code card header instead of a
 * separate underline tab bar above a nested card. Each tab's code is wrapped in
 * `CodeTabContext` so its inner `pre` (`SeedCodeBlockAuto`) renders bare.
 *
 * `CodeBlockTabsList`/`Trigger`/`Tab` are only structural markers here — `CodeBlockTabs`
 * reads their props and never mounts them.
 */

type TabMarkerProps = { value?: string; children?: ReactNode };

export function CodeBlockTabsList(_: TabMarkerProps) {
  return null;
}
export function CodeBlockTabsTrigger(_: TabMarkerProps) {
  return null;
}
export function CodeBlockTab(_: TabMarkerProps) {
  return null;
}

interface CodeBlockTabsProps {
  children?: ReactNode;
  groupId?: string;
}

export function CodeBlockTabs({ children, groupId }: CodeBlockTabsProps) {
  const elements = Children.toArray(children).filter(
    (child): child is ReactElement<TabMarkerProps> => isValidElement(child),
  );

  // Discriminate by props rather than component identity (which is unreliable across the
  // RSC boundary): direct children are one <CodeBlockTabsList> (no `value`) followed by
  // the <CodeBlockTab value="…"> panels.
  const list = elements.find((child) => child.props.value === undefined);
  const triggers = list
    ? Children.toArray(list.props.children).filter((child): child is ReactElement<TabMarkerProps> =>
        isValidElement(child),
      )
    : [];
  const labelByValue = new Map(triggers.map((t) => [t.props.value, t.props.children]));

  const items: CodeTabsShellItem[] = elements
    .filter((child) => child.props.value !== undefined)
    .map((tab) => {
      const value = tab.props.value ?? "";
      return {
        value,
        label: labelByValue.get(value) ?? value,
        children: (
          <CodeTabContext.Provider value={true}>{tab.props.children}</CodeTabContext.Provider>
        ),
      };
    });

  return <CodeTabsShell items={items} groupId={groupId} />;
}
