import type { Page } from "../App.jsx";

export type HomeCategory = "docs" | "playground" | "tools";
export type LegacyPage = Exclude<Page, "home">;

export interface LegacyItem {
  page: LegacyPage;
  title: string;
}

export interface LegacySection {
  title: string;
  items: readonly LegacyItem[];
}

export const PLAYGROUND_SECTIONS: readonly LegacySection[] = [
  {
    title: "Components",
    items: [
      { page: "layout-primitives", title: "Box / VStack / HStack" },
      { page: "text-primitive", title: "Text" },
      { page: "accordion", title: "Accordion" },
      { page: "action-button", title: "ActionButton" },
      { page: "app-bar", title: "AppBar" },
      { page: "badge", title: "Badge" },
      { page: "bottom-sheet", title: "BottomSheet" },
      { page: "callout", title: "Callout" },
      { page: "checkbox", title: "Checkbox" },
      { page: "manner-temp", title: "Manner Temp" },
      { page: "page-banner", title: "PageBanner" },
      { page: "progress-circle", title: "ProgressCircle" },
      { page: "radio-group", title: "RadioGroup" },
      { page: "switch", title: "Switch" },
      { page: "tabs", title: "Tabs" },
      { page: "tag-group", title: "TagGroup" },
      { page: "text-field", title: "TextField" },
    ],
  },
];

export const TOOL_SECTIONS: readonly LegacySection[] = [
  { title: "Getting Started", items: [{ page: "theming", title: "Theming" }] },
  {
    title: "Foundation",
    items: [
      { page: "foundation-color", title: "Color" },
      { page: "foundation-monochrome-icon", title: "Monochrome Icon" },
      { page: "foundation-multicolor-icon", title: "Multicolor Icon" },
      { page: "foundation-typography", title: "Typography" },
    ],
  },
  { title: "Tailwind", items: [{ page: "tailwind-demo", title: "Tailwind Demo" }] },
  {
    title: "Hooks",
    items: [
      { page: "use-controllable-state", title: "useControllableState" },
      { page: "use-press-tap", title: "usePressTap" },
    ],
  },
  {
    title: "Test",
    items: [
      { page: "layout-stress-tailwind", title: "Layout Stress: Tailwind" },
      { page: "layout-stress-style", title: "Layout Stress: Inline Style" },
      { page: "layout-stress-seed-primitives", title: "Layout Stress: SEED Primitives" },
      { page: "safe-area-debug", title: "Safe Area Debug" },
      { page: "nested-vars-test", title: "Nested Vars Test (Lynx 3.6+)" },
      { page: "css-selector-test", title: "CSS Selector Test" },
      { page: "icon-color-poc", title: "Icon Color POC" },
    ],
  },
];

const ALL_LEGACY_SECTIONS = [...PLAYGROUND_SECTIONS, ...TOOL_SECTIONS];

export function legacyPageTitle(page: LegacyPage): string {
  for (const section of ALL_LEGACY_SECTIONS) {
    const item = section.items.find((candidate) => candidate.page === page);
    if (item) return item.title;
  }
  return page;
}
