import type { ActivityComponentType } from "@stackflow/react";
import { AppBar, AppBarMain } from "../seed-design/stackflow/AppBar";
import { AppScreen, AppScreenContent } from "../seed-design/stackflow/AppScreen";
import { Avatar } from "../seed-design/ui/avatar";
import { ToggleButton } from "../seed-design/ui/toggle-button";
import { IconPlusFill, IconStarFill } from "@karrotmarket/react-monochrome-icon";
import { Box, Flex, Stack, Text, Icon, PrefixIcon } from "@seed-design/react";

const ActivityCodegenTest: ActivityComponentType = () => {
  return (
    <AppScreen>
      <AppBar>
        <AppBarMain title="Codegen Test" />
      </AppBar>
      <AppScreenContent>
        <Stack background="bg.layerDefault">
          <Flex alignItems="center" padding="spacingX.globalGutter">
            <Flex justifyContent="center" gap="spacingY.componentDefault" flexGrow={1}>
              <Flex gap="x2_5" flexGrow={1}>
                <Avatar src="https://placehold.co/42x42" size="42" />
                {/* alt 텍스트를 제공해야 합니다. */}
                <Stack gap="x0_5" paddingRight="x1_5" flexGrow={1}>
                  <Flex alignItems="center">
                    <Text textStyle="t5Bold" color="fg.neutral">
                      큐리오 베이커리
                    </Text>
                  </Flex>
                  <Flex flexWrap="wrap" gap="x1">
                    <Stack>
                      <Flex alignItems="center" gap="x0_5">
                        <Icon svg={<IconStarFill />} size="x3_5" color="fg.brand" />
                        <Text textStyle="t3Bold" color="fg.neutral">
                          4.2
                        </Text>
                      </Flex>
                    </Stack>
                    <Flex alignItems="center" gap="x1">
                      <Text textStyle="t3Regular" color="fg.neutral">
                        ⸱
                      </Text>
                      <Text textStyle="t3Regular" color="fg.neutral">
                        후기 320
                      </Text>
                    </Flex>
                  </Flex>
                  <Flex alignItems="center" gap="x1">
                    <Flex alignItems="center">
                      <Text
                        fontSize="t3"
                        fontWeight="regular"
                        lineHeight="t3"
                        color="fg.neutralSubtle"
                      >
                        서초동
                      </Text>
                    </Flex>
                    <Box height="x3_5" width="3px">
                      <Text textStyle="t3Regular" color="fg.neutralSubtle">
                        ⸱
                      </Text>
                    </Box>
                    <Flex alignItems="center">
                      <Text textStyle="t3Regular" color="fg.neutralSubtle">
                        단골 1,234
                      </Text>
                    </Flex>
                  </Flex>
                </Stack>
              </Flex>
              <ToggleButton variant="brandSolid" size="xsmall">
                <PrefixIcon svg={<IconPlusFill />} />
                단골맺기
              </ToggleButton>
            </Flex>
          </Flex>
        </Stack>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityCodegenTest;
