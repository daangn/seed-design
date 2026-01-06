import { basicRendererPlugin } from "@stackflow/plugin-renderer-basic";
import { type ActivityComponentType, stackflow } from "@stackflow/react/future";
import { defineConfig, type RegisteredActivityName } from "@stackflow/config";
import { seedPlugin } from "@seed-design/stackflow";

interface MakeStackProps {
  activities: {
    name: RegisteredActivityName;
    component: ActivityComponentType<RegisteredActivityName>;
  }[];
}

export const makeStack = ({ activities }: MakeStackProps) => {
  const components = Object.fromEntries(
    activities.map(({ name, component }) => [name, component]),
  ) as {
    [K in RegisteredActivityName]: ActivityComponentType<K>;
  };

  const { Stack, actions, stepActions } = stackflow({
    config: defineConfig({
      activities: activities.map(({ name }) => ({ name })),
      transitionDuration: 270,
      initialActivity: () => activities[0].name,
    }),
    components,
    plugins: [
      basicRendererPlugin(),
      seedPlugin({
        theme: "cupertino",
      }),
    ],
  });

  return { Stack, actions, stepActions };
};
