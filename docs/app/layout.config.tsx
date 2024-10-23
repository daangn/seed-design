import type { HomeLayoutProps } from "fumadocs-ui/home-layout";
import type { DocsLayoutProps } from "fumadocs-ui/layout";
import { RootToggle } from "fumadocs-ui/components/layout/root-toggle";
import { source } from "@/app/source";
import { modes } from "@/utils/modes";

/**
 * Shared layout configurations
 *
 * you can configure layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: HomeLayoutProps = {
  githubUrl: "https://github.com/daangn/seed-design",
  nav: {
    title: "SEED Design",
  },
  links: [
    {
      text: "Design",
      url: "/docs/design",
      active: "nested-url",
    },
    {
      text: "React",
      url: "/docs/react",
      active: "nested-url",
    },
  ],
};

export const docsOptions: DocsLayoutProps = {
  ...baseOptions,
  tree: source.pageTree,
  nav: {
    ...baseOptions.nav,
    transparentMode: "none",
    children: undefined,
  },

  sidebar: {
    banner: (
      <RootToggle
        options={modes.map((mode) => ({
          url: `/docs/${mode.param}`,
          icon: (
            <mode.icon
              className="size-9 shrink-0 rounded-md bg-gradient-to-t from-fd-background/80 p-1.5"
              style={{
                backgroundColor: `hsl(var(--${mode.param}-color)/.3)`,
                color: `hsl(var(--${mode.param}-color))`,
              }}
            />
          ),
          title: mode.name,
          description: mode.description,
        }))}
      />
    ),
  },
};
