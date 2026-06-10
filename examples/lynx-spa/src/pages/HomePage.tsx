import type { Page } from "../App.jsx";

function ListItem({ title, onTap }: { title: string; onTap: () => void }) {
  return (
    <view
      bindtap={onTap}
      className="py-x3_5 px-x3 border-b border-stroke-neutral-muted flex flex-row justify-between items-center"
    >
      <text className="t5-regular text-fg-neutral">{title}</text>
      <text className="t5-regular text-fg-neutral-subtle">{"→"}</text>
    </view>
  );
}

function SectionHeader({ children }: { children: string }) {
  return (
    <text className="t3-bold text-fg-neutral-subtle mt-x4 mb-x1 pl-x3 uppercase tracking-[0.5px]">
      {children}
    </text>
  );
}

export function HomePage({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <scroll-view scroll-y className="flex flex-col flex-1">
      <text className="t8-bold mb-x4 text-fg-brand">SEED Design Lynx Catalog</text>

      <SectionHeader>Getting Started</SectionHeader>
      <ListItem title="Theming" onTap={() => navigate("theming")} />

      <SectionHeader>Foundation</SectionHeader>
      <ListItem title="Color" onTap={() => navigate("foundation-color")} />
      <ListItem title="Monochrome Icon" onTap={() => navigate("foundation-monochrome-icon")} />
      <ListItem title="Multicolor Icon" onTap={() => navigate("foundation-multicolor-icon")} />
      <ListItem title="Typography" onTap={() => navigate("foundation-typography")} />

      <SectionHeader>Tailwind</SectionHeader>
      <ListItem title="Tailwind Demo" onTap={() => navigate("tailwind-demo")} />

      <SectionHeader>Components</SectionHeader>
      <ListItem title="Box / VStack / HStack" onTap={() => navigate("layout-primitives")} />
      <ListItem title="Text" onTap={() => navigate("text-primitive")} />
      <ListItem title="ActionButton" onTap={() => navigate("action-button")} />
      <ListItem title="AppBar" onTap={() => navigate("app-bar")} />
      <ListItem title="AspectRatio" onTap={() => navigate("aspect-ratio")} />
      <ListItem title="Badge" onTap={() => navigate("badge")} />
      <ListItem title="BottomSheet" onTap={() => navigate("bottom-sheet")} />
      <ListItem title="Checkbox" onTap={() => navigate("checkbox")} />
      <ListItem title="ProgressCircle" onTap={() => navigate("progress-circle")} />
      <ListItem title="RadioGroup" onTap={() => navigate("radio-group")} />
      <ListItem title="Switch" onTap={() => navigate("switch")} />
      <ListItem title="TagGroup" onTap={() => navigate("tag-group")} />

      <SectionHeader>Hooks</SectionHeader>
      <ListItem title="useControllableState" onTap={() => navigate("use-controllable-state")} />
      <ListItem title="useImage" onTap={() => navigate("use-image")} />
      <ListItem title="usePressTap" onTap={() => navigate("use-press-tap")} />

      <SectionHeader>Test</SectionHeader>
      <ListItem title="Layout Stress: Tailwind" onTap={() => navigate("layout-stress-tailwind")} />
      <ListItem title="Layout Stress: Inline Style" onTap={() => navigate("layout-stress-style")} />
      <ListItem
        title="Layout Stress: SEED Primitives"
        onTap={() => navigate("layout-stress-seed-primitives")}
      />
      <ListItem title="Safe Area Debug" onTap={() => navigate("safe-area-debug")} />
      <ListItem title="Nested Vars Test (Lynx 3.6+)" onTap={() => navigate("nested-vars-test")} />
      <ListItem title="CSS Selector Test" onTap={() => navigate("css-selector-test")} />
      <ListItem title="Icon Color POC" onTap={() => navigate("icon-color-poc")} />
    </scroll-view>
  );
}
