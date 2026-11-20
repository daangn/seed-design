import preview from "../.storybook/preview";
import { Fragment } from "react";

import { NextList, NextListDivider, NextListSwitchItem } from "seed-design/ui/next-list";
import { Switchmark } from "seed-design/ui/switch";

import { SeedThemeDecorator } from "./components/decorator";
import { withVisualTestParameters } from "@/stories/utils/parameters";
import {
  IconChevronRightLine,
  IconILowercaseSerifCircleLine,
  IconPersonCircleLine,
} from "@karrotmarket/react-monochrome-icon";
import { Icon } from "@seed-design/react";
import { Avatar } from "seed-design/ui/avatar";
import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";
import { NextListHeader } from "seed-design/ui/next-list-header";

const SAMPLE_IMAGE = `data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#6ba6ff'/><stop offset='1' stop-color='#b06bff'/></linearGradient></defs><rect width='200' height='200' fill='url(#g)'/></svg>",
)}`;

const meta = preview.meta({
  component: NextListSwitchItem,
  decorators: [SeedThemeDecorator],
});
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

const CommonTemplate = meta.story({
  args: {
    title: "Next List Switch Item",
  },
  render: () => (
    <>
      {positionVariants.map((position) => (
        <div key={position.key}>
          <NextListHeader variant="boldSolid">{position.key}</NextListHeader>
          {stateVariants.map((state) => (
            <div key={state.key}>
              <NextListHeader>{state.key}</NextListHeader>
              <NextList
                as="fieldset"
                aria-label={`NextListSwitchItem ${position.key} ${state.key}`}
              >
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
                          {showDivider && <NextListDivider as="div" />}
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
                        {showDivider && <NextListDivider as="div" />}
                      </Fragment>
                    );
                  });
                })}
              </NextList>
            </div>
          ))}
        </div>
      ))}
    </>
  ),
});

export const LightTheme = CommonTemplate.extend({});

export const DarkTheme = CommonTemplate.extend({
  parameters: withVisualTestParameters({ theme: "dark" }),
});

export const FontScalingExtraSmall = CommonTemplate.extend({
  parameters: withVisualTestParameters({ fontScale: "Extra Small" }),
});

export const FontScalingExtraExtraExtraLarge = CommonTemplate.extend({
  parameters: withVisualTestParameters({ fontScale: "Extra Extra Extra Large" }),
});
