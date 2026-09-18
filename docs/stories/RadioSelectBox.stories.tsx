import preview from "../.storybook/preview";
import {
  RadioSelectBoxItem,
  RadioSelectBoxRadiomark,
  RadioSelectBoxRoot,
} from "seed-design/ui/select-box";
import { IconPersonCircleLine } from "@karrotmarket/react-monochrome-icon";
import { Box, Text } from "@seed-design/react";

import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { withVisualTestParameters } from "@/stories/utils/parameters";

type RadioSelectBoxStoryArgs = React.ComponentProps<typeof RadioSelectBoxItem> & {
  columns?: number;
};

const meta = preview.type<{ args: RadioSelectBoxStoryArgs }>().meta({
  component: RadioSelectBoxItem,
  decorators: [SeedThemeDecorator],
});
const RadioSelectBoxWrapper = ({
  columns,
  value: _value,
  label,
  ...props
}: RadioSelectBoxStoryArgs) => {
  return (
    <RadioSelectBoxRoot columns={columns} defaultValue="item1" aria-label="선택 상자 예시">
      <RadioSelectBoxItem value="item1" label={label} {...props} />
      <RadioSelectBoxItem
        value="item2"
        label={label}
        description="보조 설명 텍스트입니다."
        {...props}
      />
      <RadioSelectBoxItem
        value="item3"
        label={label}
        prefixIcon={<IconPersonCircleLine />}
        {...props}
      />
      <RadioSelectBoxItem
        value="item4"
        label={label}
        description="보조 설명 텍스트입니다."
        prefixIcon={<IconPersonCircleLine />}
        {...props}
      />
      <RadioSelectBoxItem
        value="item5"
        label={label}
        description="선택 시에만 footer가 보입니다."
        footer={
          <Box px="x5" pb="x5">
            <Text textStyle="t3Medium">선택되었을 때만 보이는 footer입니다.</Text>
          </Box>
        }
        {...props}
      />
      <RadioSelectBoxItem
        value="item6"
        label={label}
        description="항상 footer가 보입니다."
        footerVisibility="always"
        footer={
          <Box px="x5" pb="x5">
            <Text textStyle="t3Medium">항상 보이는 footer입니다.</Text>
          </Box>
        }
        {...props}
      />
    </RadioSelectBoxRoot>
  );
};

const conditionMap = {
  columns: {
    1: { columns: 1 },
    2: { columns: 2 },
    3: { columns: 3 },
  },
  disabled: {
    false: {
      disabled: false,
    },
    true: {
      disabled: true,
    },
  },
  suffix: {
    radioMark: {
      suffix: <RadioSelectBoxRadiomark />,
    },
    none: {
      suffix: undefined,
    },
  },
};

const CommonStoryTemplate = meta.story({
  args: {
    value: "item1",
    label: "Aliqua veniam ut nisi dolore velit deserunt excepteur adipisicing",
  },
  render: (args) => (
    <VariantTable
      Component={RadioSelectBoxWrapper}
      variantMap={{}}
      conditionMap={conditionMap}
      {...args}
    />
  ),
});

export const LightTheme = CommonStoryTemplate.extend({});

export const DarkTheme = CommonStoryTemplate.extend({
  parameters: withVisualTestParameters({ theme: "dark" }),
});

export const FontScalingExtraSmall = CommonStoryTemplate.extend({
  parameters: withVisualTestParameters({ fontScale: "Extra Small" }),
});

export const FontScalingExtraExtraExtraLarge = CommonStoryTemplate.extend({
  parameters: withVisualTestParameters({ fontScale: "Extra Extra Extra Large" }),
});
