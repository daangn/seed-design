import { Box, Flex, Text } from "@seed-design/react";
import { Fragment, useEffect, useMemo, useRef } from "react";
import { events } from "shared/event";
import type { SerializedTextStyleSuggestionsResults } from "shared/types";
import { useTypographyMigration, type ListEntry } from "./context";

export function TextStylesList() {
  const { results, progress } = useTypographyMigration();

  if (!results) {
    return (
      <Flex justifyContent="center" alignItems="center" style={{ height: "100%", width: "100%" }}>
        <Text fontSize="t1" color="palette.gray700">
          로딩 중...
        </Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" style={{ height: "100%" }}>
      <Flex direction="column" style={{ overflow: "auto", flexGrow: 1 }}>
        {results.map((group) => (
          <Fragment key={group.groupId}>
            <TextStyleGroup groupId={group.groupId} />
            {group.items.map((item) => (
              <TextLayer key={item.textNode.id} groupId={group.groupId} item={item} />
            ))}
          </Fragment>
        ))}
      </Flex>
      <Flex
        padding="x2"
        alignItems="center"
        gap="x1"
        borderTopWidth={1}
        borderColor="palette.gray200"
      >
        <Box
          width={`${progress.percent}%`}
          height="x1"
          background="palette.blue500"
          borderRadius="r1"
          style={{ transition: "width 0.3s" }}
        />
        <Text fontSize="t1" color="palette.gray700">
          {progress.left === 0 ? "완료" : `${progress.left}개 남음`}
        </Text>
      </Flex>
    </Flex>
  );
}

function TextStyleGroup({ groupId }: Pick<ListEntry, "groupId">) {
  const { results, setCurrentlyViewingEntryId, currentlyViewing } = useTypographyMigration();
  if (!results) return null;

  const group = results.find(({ groupId: id }) => id === groupId);
  if (!group) return null;

  const isCurrentlyViewing = useMemo(
    () => currentlyViewing?.group?.groupId === groupId && !currentlyViewing?.item,
    [currentlyViewing, groupId],
  );

  const isAllItemsSelected = group.items.every((item) => item.selectedNewTextStyleId !== null);

  const groupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isCurrentlyViewing && groupRef.current) {
      groupRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [isCurrentlyViewing]);

  const firstNodeId = group.items.length > 0 ? group.items[0].textNode.id : null;

  return (
    <Flex
      ref={groupRef}
      background={isCurrentlyViewing ? "bg.neutralWeak" : undefined}
      borderColor={isCurrentlyViewing ? "stroke.neutral" : "stroke.neutralMuted"}
      borderWidth={1}
      borderRadius="r2"
      padding="x2"
      onClick={() => {
        setCurrentlyViewingEntryId({ groupId });
        if (firstNodeId) {
          events("focus-node").emit({
            nodeIds: [firstNodeId],
          });
        }
      }}
      style={{
        marginBottom: "8px",
        marginLeft: "8px",
        marginRight: "8px",
        marginTop: "8px",
        cursor: "pointer",
        opacity: isAllItemsSelected ? 0.6 : 1,
      }}
    >
      <Text
        fontSize="t2"
        fontWeight="bold"
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {groupId}
      </Text>
    </Flex>
  );
}

function TextLayer({
  groupId,
  item,
}: {
  groupId: ListEntry["groupId"];
  item: SerializedTextStyleSuggestionsResults[number];
}) {
  const { setCurrentlyViewingEntryId, currentlyViewing } = useTypographyMigration();

  const { textNode, selectedNewTextStyleId } = item;

  const isCurrentlyViewing = useMemo(
    () => currentlyViewing?.item?.textNode.id === textNode.id,
    [currentlyViewing, textNode.id],
  );

  const itemRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isCurrentlyViewing && itemRef.current) {
      itemRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [isCurrentlyViewing]);

  return (
    <Flex
      ref={itemRef}
      background={isCurrentlyViewing ? "bg.neutralWeak" : undefined}
      borderColor={isCurrentlyViewing ? "stroke.neutral" : "stroke.neutralMuted"}
      borderWidth={1}
      borderRadius="r2"
      padding="x2"
      onClick={() => {
        setCurrentlyViewingEntryId({ groupId, itemId: textNode.id });
        events("focus-node").emit({ nodeIds: [textNode.id] });
      }}
      style={{
        marginBottom: "4px",
        marginLeft: "16px",
        marginRight: "8px",
        cursor: "pointer",
        opacity: selectedNewTextStyleId ? 0.6 : 1,
      }}
    >
      <Text
        fontSize="t1"
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {textNode.characters || "<빈 텍스트>"}
      </Text>
    </Flex>
  );
}
