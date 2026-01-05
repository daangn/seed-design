import type { Meta, StoryObj } from "@storybook/nextjs";
import { Fragment } from "react";

import { List, ListCheckItem, ListDivider } from "seed-design/ui/list";
import { Checkmark } from "seed-design/ui/checkbox";

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

const meta = {
  component: ListCheckItem,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof ListCheckItem>;

export default meta;

type Story = StoryObj<typeof meta>;

const positionVariants = [
  { key: "prefix", position: "prefix" },
  { key: "suffix", position: "suffix" },
] as const;

const contentVariants = [
  { key: "title", detail: null },
  { key: "title-detail", detail: "Additional description for checkbox" },
];

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

const suffixVariants = [
  { key: "none", element: null },
  { key: "icon-info", element: <Icon svg={<IconILowercaseSerifCircleLine />} /> },
  { key: "icon-chevron", element: <Icon svg={<IconChevronRightLine />} /> },
];

const stateVariants = [
  { key: "unchecked", defaultChecked: false, disabled: false, highlighted: false, checkmarkVariant: undefined },
  { key: "checked", defaultChecked: true, disabled: false, highlighted: false, checkmarkVariant: undefined },
  { key: "highlighted", defaultChecked: false, disabled: false, highlighted: true, checkmarkVariant: undefined },
  { key: "highlighted-checked", defaultChecked: true, disabled: false, highlighted: true, checkmarkVariant: undefined },
  { key: "disabled", defaultChecked: false, disabled: true, highlighted: false, checkmarkVariant: undefined },
  { key: "disabled-checked", defaultChecked: true, disabled: true, highlighted: false, checkmarkVariant: undefined },
  { key: "highlighted & disabled", defaultChecked: false, disabled: true, highlighted: true, checkmarkVariant: undefined },
  { key: "highlighted & disabled-checked", defaultChecked: true, disabled: true, highlighted: true, checkmarkVariant: undefined },
  { key: "ghost-unchecked", defaultChecked: false, disabled: false, highlighted: false, checkmarkVariant: "ghost" },
  { key: "ghost-checked", defaultChecked: true, disabled: false, highlighted: false, checkmarkVariant: "ghost" },
  { key: "ghost-highlighted", defaultChecked: false, disabled: false, highlighted: true, checkmarkVariant: "ghost" },
  { key: "ghost-highlighted-checked", defaultChecked: true, disabled: false, highlighted: true, checkmarkVariant: "ghost" },
  { key: "ghost-disabled", defaultChecked: false, disabled: true, highlighted: false, checkmarkVariant: "ghost" },
  { key: "ghost-disabled-checked", defaultChecked: true, disabled: true, highlighted: false, checkmarkVariant: "ghost" },
  { key: "ghost-highlighted & disabled", defaultChecked: false, disabled: true, highlighted: true, checkmarkVariant: "ghost" },
  {
    key: "ghost-highlighted & disabled-checked",
    defaultChecked: true,
    disabled: true,
    highlighted: true,
    checkmarkVariant: "ghost",
  },
] as const;

const CommonTemplate: Story = {
  args: {
    title: "List Check Item",
  },
  render: () => (
    <>
      {positionVariants.map((position) => (
        <div key={position.key}>
          <ListHeader variant="boldSolid">{position.key}</ListHeader>
          {stateVariants.map((state) => (
            <div key={state.key}>
              <ListHeader>{state.key}</ListHeader>
              <List as="fieldset">
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
                          <ListCheckItem
                            title={key}
                            detail={content.detail}
                            prefix={<Checkmark size="large" variant={state.checkmarkVariant} />}
                            defaultChecked={state.defaultChecked}
                            disabled={state.disabled}
                            highlighted={state.highlighted}
                            suffix={suffix.element}
                          />
                          {showDivider && <ListDivider as="div" />}
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
                        <ListCheckItem
                          title={key}
                          detail={content.detail}
                          suffix={<Checkmark size="large" variant={state.checkmarkVariant} />}
                          defaultChecked={state.defaultChecked}
                          disabled={state.disabled}
                          highlighted={state.highlighted}
                          prefix={prefix.element}
                        />
                        {showDivider && <ListDivider as="div" />}
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
