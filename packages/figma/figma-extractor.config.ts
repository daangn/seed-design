import type {
  Config,
  GenerateComponentMetadataOptions,
  GenerateComponentSetMetadataOptions,
} from "@seed-design/figma-extractor";

const transform: GenerateComponentMetadataOptions["transform"] &
  GenerateComponentSetMetadataOptions["transform"] = ({
  name,
  key,
  componentPropertyDefinitions,
}) => ({
  name,
  key,
  ...(componentPropertyDefinitions && {
    componentPropertyDefinitions: Object.fromEntries(
      Object.entries(componentPropertyDefinitions).map(([key, { defaultValue, ...rest }]) => [
        key,
        rest,
      ]),
    ),
  }),
});

const config: Config = {
  data: {
    components: {
      filter: ({ name, componentSetId }) =>
        (name.startsWith("🔵 ") || name.startsWith("🟢 ")) && componentSetId === undefined,
      transform,
    },
    componentSets: {
      filter: ({ name }) => name.startsWith("🔵 ") || name.startsWith("🟢 "),
      transform,
    },
  },
};

export default config;
