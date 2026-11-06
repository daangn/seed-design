import preview from "../.storybook/preview";
import { Fragment } from "react";

import { Icon, NextList as SeedNextList } from "@seed-design/react";

import { NextList, NextListDivider, NextListRadioItem } from "seed-design/ui/next-list";
import { Radiomark } from "seed-design/ui/radio-group";

import { SeedThemeDecorator } from "./components/decorator";
import { withVisualTestParameters } from "@/stories/utils/parameters";
import {
  IconChevronRightLine,
  IconILowercaseSerifCircleLine,
  IconPersonCircleLine,
} from "@karrotmarket/react-monochrome-icon";
import { Avatar } from "seed-design/ui/avatar";
import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";
import { NextListHeader } from "seed-design/ui/next-list-header";

const SAMPLE_IMAGE = `data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#6ba6ff'/><stop offset='1' stop-color='#b06bff'/></linearGradient></defs><rect width='200' height='200' fill='url(#g)'/></svg>",
)}`;

const meta = preview.meta({
  component: NextListRadioItem,
  decorators: [SeedThemeDecorator],
});
const positionVariants = [
  { key: "prefix", position: "prefix" },
  { key: "suffix", position: "suffix" },
] as const;

const contentVariants = [
  { key: "title", detail: null },
  { key: "title-detail", detail: "Additional description for radio" },
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
  { key: "normal", disabled: false, highlighted: false },
  { key: "highlighted", disabled: false, highlighted: true },
  { key: "disabled", disabled: true, highlighted: false },
  { key: "highlighted & disabled", disabled: true, highlighted: true },
] as const;

const CommonTemplate = meta.story({
  args: {
    title: "Next List Radio Item",
    value: "example",
  },
  render: () => (
    <>
      {positionVariants.map((position) => (
        <div key={position.key}>
          <NextListHeader variant="boldSolid">{position.key}</NextListHeader>
          {stateVariants.map((state) => (
            <div key={state.key}>
              <NextListHeader>{state.key}</NextListHeader>
              <NextList asChild>
                <SeedNextList.RadioRoot
                  defaultValue={`${position.key}-title-${state.key}-${position.position === "prefix" ? "suffix" : "prefix"}-none`}
                  aria-label={`NextListRadioItem ${position.key} ${state.key}`}
                >
                  {contentVariants.map((content) => {
                    if (position.position === "prefix") {
                      return suffixVariants.map((suffix, suffixIndex) => {
                        const isLastSuffix = suffixIndex === suffixVariants.length - 1;
                        const isLastContent =
                          content.key === contentVariants[contentVariants.length - 1].key;
                        const showDivider = !(isLastSuffix && isLastContent);

                        const radioValue = `${position.key}-${content.key}-${state.key}-suffix-${suffix.key}`;

                        return (
                          <Fragment key={radioValue}>
                            <NextListRadioItem
                              title={radioValue}
                              value={radioValue}
                              detail={content.detail}
                              prefix={<Radiomark size="large" />}
                              disabled={state.disabled}
                              highlighted={state.highlighted}
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

                      const radioValue = `${position.key}-${content.key}-${state.key}-prefix-${prefix.key}`;

                      return (
                        <Fragment key={radioValue}>
                          <NextListRadioItem
                            value={radioValue}
                            title={radioValue}
                            detail={content.detail}
                            suffix={<Radiomark size="large" />}
                            disabled={state.disabled}
                            highlighted={state.highlighted}
                            prefix={prefix.element}
                          />
                          {showDivider && <NextListDivider as="div" />}
                        </Fragment>
                      );
                    });
                  })}
                </SeedNextList.RadioRoot>
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
