import { basicUIPlugin } from "@stackflow/plugin-basic-ui";
import { basicRendererPlugin } from "@stackflow/plugin-renderer-basic";
import { ActivityComponentType, stackflow } from "@stackflow/react/future";
import { config } from "./stackflow.config";

interface MakeStackProps {
  Activity: ActivityComponentType<"Main">;
}

export const makeStack = (props: MakeStackProps) => {
  const { Activity } = props;

  const { Stack, actions, stepActions } = stackflow({
    config,
    components: {
      Main: Activity,
    },
    plugins: [
      basicRendererPlugin(),
      basicUIPlugin({
        theme: "cupertino",
        appBar: {
          backButton: {
            ariaLabel: "뒤로 가기",
          },
          closeButton: {
            ariaLabel: "닫기",
          },
        },
      }),
    ],
  });

  return { Stack, actions, stepActions };
};
