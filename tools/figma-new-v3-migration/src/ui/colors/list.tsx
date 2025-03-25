import { Box, Flex, Stack, Text } from "@seed-design/react";
import { ProgressBar } from "common/components/progress-bar";
import { events } from "shared/event";
import type { SerializedColorVariablesSuggestionsResults } from "shared/types";
import { getOldValueId, getOldValueName, type ListEntry, useColorMigration } from "./context";

export function LayersWithColorList() {
  const { results, progress } = useColorMigration();

  if (!results) {
    return (
      <Flex justifyContent="center" alignItems="center" style={{ height: "100%", width: "100%" }}>
        <Text fontSize="t1" color="palette.gray700">
          프레임 검사를 해주세요.
        </Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" height="full">
      <Stack flexGrow={1} overflowY="auto" gap="x3">
        {results.map(({ oldValue, consumers }) => (
          <Stack key={getOldValueId(oldValue)} borderBottomWidth={1} borderColor="palette.gray200">
            <LayerGroup groupId={getOldValueId(oldValue)} />
            {consumers.map((consumer) => (
              <Layer key={consumer.node.id} groupId={getOldValueId(oldValue)} consumer={consumer} />
            ))}
          </Stack>
        ))}
      </Stack>

      <ProgressBar progress={progress} showTitle completeMessage="모두 변경 완료" />
    </Flex>
  );
}

function LayerGroup({ groupId }: Pick<ListEntry, "groupId">) {
  const { results, setCurrentlyViewingEntryId, currentlyViewing } = useColorMigration();
  if (!results) return null;

  const group = results.find(({ oldValue }) => groupId === getOldValueId(oldValue));
  if (!group) return null;

  function handleClick() {
    setCurrentlyViewingEntryId({ groupId });
    if (group) {
      events("focus-node").emit({
        nodeIds: group.consumers.map(({ node }) => node.id),
      });
    }
  }

  const isCurrentlyViewing = currentlyViewing
    ? getOldValueId(currentlyViewing.group.oldValue) === groupId && !currentlyViewing.item
    : false;

  const isAllItemsMigrated = group.consumers.every(
    ({ selectedNewVariableId }) => selectedNewVariableId,
  );

  return (
    <Flex
      onClick={handleClick}
      gap="x1"
      alignItems="center"
      background={isCurrentlyViewing ? "bg.informativeWeak" : "bg.layerDefault"}
      padding="x2"
      style={{
        cursor: "pointer",
        ...(isAllItemsMigrated && {
          opacity: 0.5,
          textDecoration: "line-through",
        }),
      }}
    >
      {group.oldValue.type !== "uncheckable" && (
        <ColorSwatch hex={group.oldValue.hex} opacity={group.oldValue.opacity} />
      )}
      <Text fontSize="t2" fontWeight="bold">
        {getOldValueName(group.oldValue)}
      </Text>
    </Flex>
  );
}

function ColorSwatch({ hex, opacity }: { hex: string; opacity: number }) {
  return (
    <Box
      style={{
        backgroundColor: `#${hex}`,
        opacity,
      }}
      borderWidth={1}
      width="x4"
      height="x4"
      borderRadius="r1"
      borderColor="palette.gray200"
    />
  );
}

function Layer({
  groupId,
  consumer,
}: {
  groupId: ListEntry["groupId"];
  consumer: SerializedColorVariablesSuggestionsResults[number]["consumers"][number];
}) {
  const { setCurrentlyViewingEntryId, currentlyViewing } = useColorMigration();
  const { node, closestInstanceNode, selectedNewVariableId } = consumer;

  const isAlreadyMigrated = !!selectedNewVariableId;

  function handleClick() {
    if (isAlreadyMigrated) return;
    setCurrentlyViewingEntryId({ groupId, itemId: node.id });
    events("focus-node").emit({ nodeIds: [node.id] });
  }

  // 현재 아이템이 선택되었는지 확인
  const isItemSelected =
    currentlyViewing?.item?.node.id === node.id &&
    getOldValueId(currentlyViewing.group.oldValue) === groupId;

  // 현재 아이템의 그룹이 선택되었는지 확인 (아이템이 선택되지 않은 상태에서)
  const isParentGroupSelected =
    currentlyViewing &&
    !currentlyViewing.item &&
    getOldValueId(currentlyViewing.group.oldValue) === groupId;

  // 아이템이 선택되었거나 부모 그룹이 선택되었을 때 하이라이트
  const isHighlighted = isItemSelected || isParentGroupSelected;

  return (
    <Flex
      onClick={handleClick}
      gap="x1"
      alignItems="center"
      padding="x1"
      paddingLeft="x4"
      background={isHighlighted ? "bg.informativeWeak" : "bg.layerDefault"}
      style={{
        cursor: "pointer",
        ...(isAlreadyMigrated && { opacity: 0.5, textDecoration: "line-through" }),
      }}
    >
      <Text fontSize="t1">{node.name}</Text>
      {closestInstanceNode && (
        <Text fontSize="t1" color="palette.gray700">
          인스턴스
        </Text>
      )}
    </Flex>
  );
}
