import type { ActivityComponentType } from "@stackflow/react";
import { AppBar, AppBarMain } from "../seed-design/stackflow/AppBar";
import { AppScreen, AppScreenContent } from "../seed-design/stackflow/AppScreen";
import { Avatar } from "../seed-design/ui/avatar";
import { ToggleButton } from "../seed-design/ui/toggle-button";
import { IconPlusFill, IconStarFill } from "@karrotmarket/react-monochrome-icon";
import { Box, VStack, HStack, Text, Icon, PrefixIcon } from "@seed-design/react";

const ActivityCodegenTest: ActivityComponentType = () => {
  return (
    <AppScreen>
      <AppBar>
        <AppBarMain title="Codegen Test" />
      </AppBar>
      <AppScreenContent>
        <VStack bg="bg.layerDefault">
          <HStack align="center" p="spacingX.globalGutter">
            <HStack justify="center" gap="spacingY.componentDefault" grow={true}>
              <HStack gap="x2_5" grow={true}>
                <Avatar src="https://placehold.co/42x42" size="42" />
                {/* alt 텍스트를 제공해야 합니다. */}
                <VStack gap="x0_5" pr="x1_5" grow={true}>
                  <HStack align="center">
                    <Text textStyle="t5Bold" color="fg.neutral">
                      큐리오 베이커리
                    </Text>
                  </HStack>
                  <HStack wrap={true} gap="x1">
                    <VStack>
                      <HStack align="center" gap="x0_5">
                        <Icon svg={<IconStarFill />} size="x3_5" color="fg.brand" />
                        <Text textStyle="t3Bold" color="fg.neutral">
                          4.2
                        </Text>
                      </HStack>
                    </VStack>
                    <HStack align="center" gap="x1">
                      <Text textStyle="t3Regular" color="fg.neutral">
                        ⸱
                      </Text>
                      <Text textStyle="t3Regular" color="fg.neutral">
                        후기 320
                      </Text>
                    </HStack>
                  </HStack>
                  <HStack align="center" gap="x1">
                    <HStack align="center">
                      <Text
                        fontSize="t3"
                        fontWeight="regular"
                        lineHeight="t3"
                        color="fg.neutralSubtle"
                      >
                        서초동
                      </Text>
                    </HStack>
                    <Box height="x3_5" width="3px">
                      <Text textStyle="t3Regular" color="fg.neutralSubtle">
                        ⸱
                      </Text>
                    </Box>
                    <HStack align="center">
                      <Text textStyle="t3Regular" color="fg.neutralSubtle">
                        단골 1,234
                      </Text>
                    </HStack>
                  </HStack>
                </VStack>
              </HStack>
              <ToggleButton variant="brandSolid" size="xsmall">
                <PrefixIcon svg={<IconPlusFill />} />
                단골맺기
              </ToggleButton>
            </HStack>
          </HStack>
        </VStack>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityCodegenTest;
