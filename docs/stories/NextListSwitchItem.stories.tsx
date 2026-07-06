import type { Meta, StoryObj } from "@storybook/nextjs";
import { Fragment } from "react";

import { List, ListDivider } from "seed-design/ui/list";
import { NextListSwitchItem } from "seed-design/ui/next-list-item";
import { Switchmark } from "seed-design/ui/switch";

import { SeedThemeDecorator } from "./components/decorator";
import { createStoryWithParameters } from "@/stories/utils/parameters";
import {
  IconChevronRightLine,
  IconILowercaseSerifCircleLine,
  IconPersonCircleLine,
} from "@karrotmarket/react-monochrome-icon";
import { Icon } from "@seed-design/react";
import { Avatar } from "seed-design/ui/avatar";
import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";
import { ListHeader } from "seed-design/ui/list-header";

const SAMPLE_IMAGE = `data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#6ba6ff'/><stop offset='1' stop-color='#b06bff'/></linearGradient></defs><rect width='200' height='200' fill='url(#g)'/></svg>",
)}`;

const meta = {
  component: NextListSwitchItem,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof NextListSwitchItem>;

export default meta;

type Story = StoryObj<typeof meta>;

const positionVariants = [
  { key: "prefix", position: "prefix" },
  { key: "suffix", position: "suffix" },
] as const;

const contentVariants = [
  { key: "title", detail: null },
  { key: "title-detail", detail: "Additional description for switch" },
];

const prefixVariants = [
  { key: "none", element: null },
  { key: "icon", element: <Icon svg={<IconPersonCircleLine />} /> },
  {
    key: "avatar",
    element: <Avatar size="48" src={SAMPLE_IMAGE} fallback={<IdentityPlaceholder />} />,
  },
];

const suffixVariants = [
  { key: "none", element: null },
  { key: "icon-info", element: <Icon svg={<IconILowercaseSerifCircleLine />} /> },
  { key: "icon-chevron", element: <Icon svg={<IconChevronRightLine />} /> },
];

const stateVariants = [
  { key: "unchecked", defaultChecked: false, disabled: false, tone: "brand" },
  { key: "checked", defaultChecked: true, disabled: false, tone: "brand" },
  { key: "disabled", defaultChecked: false, disabled: true, tone: "brand" },
  { key: "disabled-checked", defaultChecked: true, disabled: true, tone: "brand" },
  { key: "neutral-unchecked", defaultChecked: false, disabled: false, tone: "neutral" },
  { key: "neutral-checked", defaultChecked: true, disabled: false, tone: "neutral" },
] as const;

const CommonTemplate: Story = {
  args: {
    title: "Next List Switch Item",
  },
  render: () => (
    <>
      {positionVariants.map((position) => (
        <div key={position.key}>
          <ListHeader variant="boldSolid">{position.key}</ListHeader>
          {stateVariants.map((state) => (
            <div key={state.key}>
              <ListHeader>{state.key}</ListHeader>
              <List>
                {contentVariants.map((content) => {
                  if (position.position === "prefix") {
                    return suffixVariants.map((suffix, suffixIndex) => {
                      const isLastSuffix = suffixIndex === suffixVariants.length - 1;
                      const isLastContent =
                        content.key === contentVariants[contentVariants.length - 1].key;
                      const showDivider = !(isLastSuffix && isLastContent);

                      const key = `${position.key}-${content.key}-${state.key}-suffix-${suffix.key}`;

                      return (
                        <Fragment key={key}>
                          <NextListSwitchItem
                            title={key}
                            detail={content.detail}
                            prefix={<Switchmark tone={state.tone} />}
                            defaultChecked={state.defaultChecked}
                            disabled={state.disabled}
                            suffix={suffix.element}
                          />
                          {showDivider && <ListDivider />}
                        </Fragment>
                      );
                    });
                  }
                  return prefixVariants.map((prefix, prefixIndex) => {
                    const isLastPrefix = prefixIndex === prefixVariants.length - 1;
                    const isLastContent =
                      content.key === contentVariants[contentVariants.length - 1].key;
                    const showDivider = !(isLastPrefix && isLastContent);

                    const key = `${position.key}-${content.key}-${state.key}-prefix-${prefix.key}`;

                    return (
                      <Fragment key={key}>
                        <NextListSwitchItem
                          title={key}
                          detail={content.detail}
                          suffix={<Switchmark tone={state.tone} />}
                          defaultChecked={state.defaultChecked}
                          disabled={state.disabled}
                          prefix={prefix.element}
                        />
                        {showDivider && <ListDivider />}
                      </Fragment>
                    );
                  });
                })}
              </List>
            </div>
          ))}
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
