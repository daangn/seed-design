import type { Config, GenerateComponentSetMetadataOptions } from "@seed-design/figma-extractor";

const componentSetTransform: GenerateComponentSetMetadataOptions["transform"] = ({
  name,
  key,
  componentPropertyDefinitions,
}) => ({
  name,
  key,
  ...(componentPropertyDefinitions && {
    componentPropertyDefinitions: Object.fromEntries(
      Object.entries(componentPropertyDefinitions).map(([key, { ...rest }]) => [key, rest]),
    ),
  }),
});

const config: Config = {
  data: {
    componentSets: {
      transform: componentSetTransform,
    },
    styles: {
      filter: ({ style_type }) => style_type === "TEXT",
      transform: ({ name, key }) => ({ name, key }),
    },
  },
};

export default config;
