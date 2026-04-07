import type { Meta, StoryObj } from "@storybook/nextjs";
import { Fragment } from "react";

import { List, ListLinkItem, ListDivider } from "seed-design/ui/list";

import { SeedThemeDecorator } from "./components/decorator";
import { createStoryWithParameters } from "@/stories/utils/parameters";
import {
  IconChevronRightLine,
  IconILowercaseSerifCircleLine,
  IconPersonCircleLine,
} from "@karrotmarket/react-monochrome-icon";
import { Icon } from "@ride-developer/react";
import { Avatar } from "seed-design/ui/avatar";
import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";
import { ActionButton } from "seed-design/ui/action-button";
import { ListHeader } from "seed-design/ui/list-header";

const meta = {
  component: ListLinkItem,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof ListLinkItem>;

export default meta;

type Story = StoryObj<typeof meta>;

const prefixVariants = [
  { key: "none", element: null },
  { key: "icon", element: <Icon svg={<IconPersonCircleLine />} /> },
  {
    key: "avatar",
    element: (
      <Avatar
        size="48"
        src="https://avatars.githubusercontent.com/u/54893898?v=4"
        fallback={<IdentityPlaceholder />}
      />
    ),
  },
];

const contentVariants = [
  { key: "title", detail: null },
  { key: "title-detail", detail: "lorem ipsum dolor sit amet" },
];

const suffixVariants = [
  { key: "none", element: null },
  { key: "icon-info", element: <Icon svg={<IconILowercaseSerifCircleLine />} /> },
  { key: "icon-chevron", element: <Icon svg={<IconChevronRightLine />} /> },
  {
    key: "buttons",
    element: (
      <>
        <ActionButton size="xsmall" variant="neutralWeak">
          라벨
        </ActionButton>
        <ActionButton size="xsmall" variant="neutralWeak">
          라벨
        </ActionButton>
      </>
    ),
  },
];

const highlightedVariants = [
  { key: "normal", highlighted: false },
  { key: "highlighted", highlighted: true },
];

const CommonTemplate: Story = {
  args: {
    title: "List Link Item",
    href: "https://example.com",
  },
  render: () => (
    <>
      {highlightedVariants.map((highlightedState) => (
        <div key={highlightedState.key}>
          <ListHeader>{highlightedState.key}</ListHeader>
          <List>
            {prefixVariants.map((prefix) =>
              contentVariants.map((content) =>
                suffixVariants.map((suffix, suffixIndex) => {
                  const isLastSuffix = suffixIndex === suffixVariants.length - 1;
                  const isLastContent =
                    content.key === contentVariants[contentVariants.length - 1].key;
                  const isLastPrefix = prefix.key === prefixVariants[prefixVariants.length - 1].key;
                  const showDivider = !(isLastSuffix && isLastContent && isLastPrefix);

                  const key = `${prefix.key}-${content.key}-${suffix.key}`;

                  return (
                    <Fragment key={key}>
                      <ListLinkItem
                        highlighted={highlightedState.highlighted}
                        href="https://example.com"
                        target="_blank"
                        title={key}
                        detail={content.detail}
                        prefix={prefix.element}
                        suffix={suffix.element}
                      />
                      {showDivider && <ListDivider />}
                    </Fragment>
                  );
                }),
              ),
            )}
          </List>
        </div>
      ))}
    </>
  ),
};

export const LightTheme = CommonTemplate;

export const DarkTheme = createStoryWithParameters({
  ...CommonTemplate,
  parameters: { theme: "dark" },
});

export const FontScalingExtraSmall = createStoryWithParameters({
  ...CommonTemplate,
  parameters: { fontScale: "Extra Small" },
});

export const FontScalingExtraExtraExtraLarge = createStoryWithParameters({
  ...CommonTemplate,
  parameters: { fontScale: "Extra Extra Extra Large" },
});
