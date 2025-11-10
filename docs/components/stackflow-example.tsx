import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import * as React from "react";

import ErrorBoundary from "./error-boundary";

import { StackflowPreview } from "./stackflow-preview";
import { StackflowIframePreview } from "./stackflow-iframe-preview";
import { Box } from "@seed-design/react";

type StackflowExampleProps = (
  | { names: string[]; path?: never }
  | { names?: never; path: string }
) & {
  children?: React.ReactNode;
};

export function StackflowExample(props: StackflowExampleProps) {
  const { names, path, children } = props;

  if (path)
    return (
      <Box
        borderColor="stroke.neutralMuted"
        borderWidth={1}
        borderRadius="r4"
        p="x5"
        style={{ marginBlock: "2em" }}
      >
        <StackflowIframePreview path={path} />
      </Box>
    );

  return (
    <ErrorBoundary>
      <Tabs items={["미리보기", "코드"]}>
        <Tab value="미리보기">{names && <StackflowPreview names={names} />}</Tab>
        <Tab value="코드">{children}</Tab>
      </Tabs>
    </ErrorBoundary>
  );
}
