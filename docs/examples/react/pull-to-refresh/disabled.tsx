import { Box, HStack, Text } from "@seed-design/react";
import { useState } from "react";
import {
  PullToRefreshContent,
  PullToRefreshIndicator,
  PullToRefreshRoot,
} from "seed-design/ui/pull-to-refresh";
import { Switch } from "seed-design/ui/switch";

const PullToRefreshDisabled = () => {
  const [disabled, setDisabled] = useState(false);

  return (
    <Box width="300px" height="500px" borderColor="stroke.neutralMuted" borderWidth={1}>
      <PullToRefreshRoot
        onPtrReady={() => {}}
        onPtrRefresh={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }}
        disabled={disabled}
      >
        <PullToRefreshIndicator />
        <PullToRefreshContent asChild>
          <HStack px="spacingX.globalGutter" py="x4" align="center" justify="space-between">
            <Text>Disabled</Text>
            <Switch checked={disabled} onCheckedChange={setDisabled} />
          </HStack>
        </PullToRefreshContent>
      </PullToRefreshRoot>
    </Box>
  );
};

export default PullToRefreshDisabled;
