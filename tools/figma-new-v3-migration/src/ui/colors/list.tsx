import { IconChevronDownLine, IconChevronUpLine } from "@daangn/react-monochrome-icon";
import { vars } from "@seed-design/css/vars";
import { Box, Flex, Stack, Text } from "@seed-design/react";
import { Collapsible, CollapsibleGroup } from "common/components/collapsible";
import { ProgressBar } from "common/components/progress-bar";
import { useMemo } from "react";
import { events } from "shared/event";
import type { SerializedColorVariablesSuggestionsResults } from "shared/types";
import { getOldValueId, getOldValueName, type ListEntry, useColorMigration } from "./context";

export function LayersWithColorList() {
  const { results, progress, loading } = useColorMigration();

  // 모든 그룹 ID 목록 (초기에 모두 펼친 상태로 설정)
  const defaultOpenItems = useMemo(() => {
    if (!results) return [];
    return results.map(({ oldValue }) => getOldValueId(oldValue));
  }, [results]);

  if (loading) {
    return (
      <Flex
        direction="column"
        justifyContent="center"
        alignItems="center"
        style={{ height: "100%" }}
      >
        <Text>검사중...</Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" height="full">
      <CollapsibleGroup defaultOpenItems={defaultOpenItems}>
        {/* 전체 접기/펴기 컨트롤 */}
        <Flex
          justifyContent="flexEnd"
          alignItems="center"
          padding="x2"
          borderBottomWidth={1}
          borderColor="palette.gray200"
        >
          <CollapsibleGroup.ToggleAll>
            {({ isAllOpen }) => (
              <Flex gap="x1" alignItems="center">
                <Text fontSize="t1" color="palette.gray700">
                  {isAllOpen ? "전체 접기" : "전체 펼치기"}
                </Text>
                {isAllOpen ? <IconChevronUpLine size={12} /> : <IconChevronDownLine size={12} />}
              </Flex>
            )}
          </CollapsibleGroup.ToggleAll>
        </Flex>

        {/* 그룹 목록 */}
        <Stack flexGrow={1} overflowY="auto">
          {results?.map(({ oldValue, consumers }) => (
            <Collapsible key={getOldValueId(oldValue)} id={getOldValueId(oldValue)}>
              <Stack borderBottomWidth={1} borderColor="palette.gray200">
                <LayerGroup groupId={getOldValueId(oldValue)} itemCount={consumers.length} />
                <Collapsible.Content>
                  {consumers.map((consumer) => (
                    <Layer
                      key={consumer.node.id}
                      groupId={getOldValueId(oldValue)}
                      consumer={consumer}
                    />
                  ))}
                </Collapsible.Content>
              </Stack>
            </Collapsible>
          ))}
        </Stack>
      </CollapsibleGroup>
      {progress.total > 0 && (
        <ProgressBar progress={progress} showTitle completeMessage="모두 변경 완료" />
      )}
    </Flex>
  );
}

function LayerGroup({ groupId, itemCount }: Pick<ListEntry, "groupId"> & { itemCount: number }) {
  const { results, setCurrentlyViewingEntryId, currentlyViewing } = useColorMigration();
  if (!results) return null;

  const group = results.find(({ oldValue }) => groupId === getOldValueId(oldValue));
  if (!group) return null;

  const isCurrentlyViewing = currentlyViewing
    ? getOldValueId(currentlyViewing.group.oldValue) === groupId && !currentlyViewing.item
    : false;

  const isAllItemsMigrated = group.consumers.every(
    ({ selectedNewVariableId }) => selectedNewVariableId,
  );

  function handleClick() {
    setCurrentlyViewingEntryId({ groupId });
    if (group) {
      events("focus-node").emit({
        nodeIds: group.consumers.map(({ node }) => node.id),
      });
    }
  }

  return (
    <Flex
      alignItems="center"
      background={isCurrentlyViewing ? "bg.informativeWeak" : "bg.layerDefault"}
      paddingY="x3"
      paddingX="x2"
      style={{
        ...(isAllItemsMigrated && {
          opacity: 0.5,
          textDecoration: "line-through",
        }),
      }}
    >
      {/* 접기/펴기 버튼 */}
      <Box paddingRight="x2">
        <Collapsible.Trigger>
          {({ isOpen }) =>
            isOpen ? (
              <IconChevronUpLine color={vars.$color.palette.gray700} size={12} />
            ) : (
              <IconChevronDownLine color={vars.$color.palette.gray700} size={12} />
            )
          }
        </Collapsible.Trigger>
      </Box>

      {/* 그룹 정보 */}
      <Flex
        gap="x1"
        alignItems="center"
        onClick={handleClick}
        style={{ cursor: "pointer", flex: 1, minWidth: 0 }}
      >
        {group.oldValue.type !== "uncheckable" && (
          <ColorSwatch hex={group.oldValue.hex} opacity={group.oldValue.opacity} />
        )}
        <Text
          fontSize="t2"
          fontWeight="bold"
          style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
        >
          {getOldValueName(group.oldValue)}
        </Text>
        <Text fontSize="t1" color="palette.gray600" style={{ marginLeft: "4px", flexShrink: 0 }}>
          ({itemCount})
        </Text>
      </Flex>
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
      flexShrink={0}
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
  const { node, selectedNewVariableId } = consumer;

  const isAlreadyMigrated = !!selectedNewVariableId;

  function handleClick() {
    if (isAlreadyMigrated) return;
    setCurrentlyViewingEntryId({ groupId, itemId: node.id });
    events("focus-node").emit({ nodeIds: [node.id] });
  }

  // 현재 아이템이 선택되었는지 확인
  const isItemSelected =
    currentlyViewing?.item?.node.id === node.id &&
    currentlyViewing?.group &&
    getOldValueId(currentlyViewing.group.oldValue) === groupId;

  // 현재 아이템의 그룹이 선택되었는지 확인 (아이템이 선택되지 않은 상태에서)
  const isParentGroupSelected =
    currentlyViewing &&
    !currentlyViewing.item &&
    currentlyViewing.group &&
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
      <Text
        fontSize="t1"
        style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1 }}
      >
        {node.name}
      </Text>
    </Flex>
  );
}
