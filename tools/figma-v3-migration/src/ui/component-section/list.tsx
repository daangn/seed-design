import { Box, Flex, Stack, Text } from "@seed-design/react";
import type { InstanceInfo } from "shared/types";
import { useComponentSection } from "./context";
import type { ReactNode } from "react";
import { ActionButton } from "common/design-system/ui/action-button";

export function ComponentSuggestionsList() {
  const {
    oldComponents,
    newComponents,
    swapResults,
    selectedVariants,
    swapComponent,
    focusComponent,
    selectedComponent,
  } = useComponentSection();

  return (
    <Flex direction="column" style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* 그룹 목록 */}
      <Flex flexGrow={1} style={{ overflow: "hidden", height: "calc(100% - 60px)" }}>
        <Box
          width="70%"
          borderRightWidth={1}
          borderColor="palette.gray200"
          style={{
            overflow: "auto",
            height: "100%",
          }}
        >
          <Flex direction="column" gap="x1" paddingX="x3" paddingY="x2">
            <Text fontSize="t2" color="palette.gray700">
              V2 {oldComponents.length > 0 && `${oldComponents.length}개`}
            </Text>
          </Flex>

          {oldComponents.map((oldComponent) => {
            const swapResult = swapResults[oldComponent.id];
            const isSuccess = swapResult?.ok;
            const isFocused = selectedComponent?.id === oldComponent.id;
            const errorMessage = swapResult?.errorMessage;
            const isAlreadyMigrated = swapResult?.ok;
            const endElement = swapResult ? (
              isSuccess ? (
                <Text fontSize="t1" color="palette.green600">
                  {swapResult.metadata?.newComponentName}로 교체 완료했어요.
                </Text>
              ) : (
                <Text fontSize="t1" color="palette.red600">
                  {errorMessage}
                </Text>
              )
            ) : null;
            const onSwap = () => {
              swapComponent(oldComponent, selectedVariants);
            };

            return (
              <Stack key={oldComponent.id} borderBottomWidth={1} borderColor="palette.gray200">
                <ComponentLayer
                  item={oldComponent}
                  endElement={endElement}
                  isFocused={isFocused}
                  onClick={() => focusComponent(oldComponent)}
                  onSwap={onSwap}
                  isAlreadyMigrated={isAlreadyMigrated}
                />
              </Stack>
            );
          })}
        </Box>

        <Box
          width="30%"
          style={{
            overflow: "auto",
            height: "100%",
          }}
        >
          <Flex direction="column" gap="x1" paddingX="x3" paddingY="x2">
            <Text fontSize="t2" color="palette.gray700">
              V3 {newComponents.length > 0 && `${newComponents.length}개`}
            </Text>
          </Flex>

          {newComponents.map((newComponent) => {
            const swapResult = swapResults[newComponent.id];
            const isSuccess = swapResult?.ok;
            const isFocused = selectedComponent?.id === newComponent.id;
            const errorMessage = swapResult?.errorMessage;
            const isAlreadyMigrated = swapResult?.ok;

            const endElement = swapResult ? (
              isSuccess ? (
                <Text fontSize="t1" color="palette.green600">
                  {swapResult.metadata?.newComponentName}로 교체 완료했어요.
                </Text>
              ) : (
                <Text fontSize="t1" color="palette.red600">
                  {errorMessage}
                </Text>
              )
            ) : null;

            return (
              <Stack key={newComponent.id} borderBottomWidth={1} borderColor="palette.gray200">
                <ComponentLayer
                  endElement={endElement}
                  item={newComponent}
                  isFocused={isFocused}
                  onClick={() => focusComponent(newComponent)}
                  isAlreadyMigrated={isAlreadyMigrated}
                />
              </Stack>
            );
          })}
        </Box>
      </Flex>
    </Flex>
  );
}

function ComponentLayer({
  item,
  isFocused,
  onClick,
  endElement,
  onSwap,
  isAlreadyMigrated,
}: {
  item: InstanceInfo;
  isFocused: boolean;
  isAlreadyMigrated?: boolean;
  onClick: () => void;
  endElement?: ReactNode;
  onSwap?: () => void;
}) {
  return (
    <Flex
      onClick={onClick}
      gap="x1"
      alignItems="center"
      padding="x1"
      paddingLeft="x4"
      background={isFocused ? "bg.informativeWeak" : "bg.layerDefault"}
      style={{
        cursor: "pointer",
      }}
    >
      <Text
        fontSize="t1"
        style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1 }}
      >
        {item.name}
      </Text>
      {endElement && <Box>{endElement}</Box>}
      {onSwap && !isAlreadyMigrated && (
        <ActionButton variant="neutralWeak" size="xsmall" onClick={onSwap}>
          교체
        </ActionButton>
      )}
    </Flex>
  );
}
