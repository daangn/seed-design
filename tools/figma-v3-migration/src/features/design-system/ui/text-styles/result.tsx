import type {
  SerializedTextStyle,
  SerializedTextStyleSuggestionsResults,
} from "@/features/design-system/types";
import { InstanceBadge } from "@/shared/components/badges";
import { useTextStyleMigration } from "@/features/design-system/ui/text-styles/context";
import { getLineHeightUnitString } from "@/features/design-system/utils/text-node-properties";
import { h } from "preact";
import { useMemo } from "preact/hooks";
import { RightPanel } from "@/shared/components/panels";
import { SuggestionCard } from "@/shared/components/buttons";
import { H1, H2 } from "@/shared/components/headings";
import { InstanceWarningBanner } from "@/shared/components/banners";

export function Result() {
  const { currentlyViewing } = useTextStyleMigration();

  if (currentlyViewing?.item) return <TextLayerResult />;
  if (currentlyViewing?.group) return <TextLayerGroupResult />;

  return null;
}

function TextLayerResult() {
  const { currentlyViewing, applyTextStyle } = useTextStyleMigration();

  if (!currentlyViewing?.item) return null;

  const { closestInstanceNode, textNode, selectedNewTextStyleId, suggestions } =
    currentlyViewing.item;

  return (
    <RightPanel>
      <div className="flex flex-col gap-1 p-2 pb-1 w-full">
        <div className="flex items-center gap-2">
          <H1>{textNode.characters}</H1>
          <div className="flex gap-0.5 flex-none">
            {closestInstanceNode && <InstanceBadge label={closestInstanceNode.name} />}
          </div>
        </div>
        <H2>{currentlyViewing.group.groupId}</H2>
      </div>
      <div className="grow flex flex-col gap-2 w-full p-1.5 pt-0.5">
        <div className="font-semibold text-neutral-600 p-1">
          {suggestions.length === 0
            ? "해당 텍스트 스타일은 Deprecated 되었습니다. 다른 텍스트 스타일로 변경해주세요."
            : "이 레이어에 설정할 스타일을 선택하세요."}
        </div>
        {closestInstanceNode && (
          <InstanceWarningBanner closestInstanceNodeName={closestInstanceNode.name} />
        )}
        {suggestions.map((suggestion) => (
          <TextStyleSuggestionButton
            onClick={() => applyTextStyle([textNode.id], suggestion.textStyle.id)}
            key={suggestion.textStyle.id}
            isSelected={selectedNewTextStyleId === suggestion.textStyle.id}
            suggestion={suggestion}
          />
        ))}
      </div>
    </RightPanel>
  );
}

function TextLayerGroupResult() {
  const { currentlyViewing, applyTextStyle } = useTextStyleMigration();

  if (!currentlyViewing?.group) return null;

  const hasSelectedTextNodesWithinInstance = useMemo(
    () => currentlyViewing.group.items.some(({ closestInstanceNode }) => closestInstanceNode),
    [currentlyViewing.group.items],
  );

  const suggestions = currentlyViewing.group.items[0].suggestions;

  return (
    <RightPanel>
      <div className="flex flex-col gap-1 p-2 pb-1 w-full">
        <H1>{currentlyViewing.group.items.length}개 텍스트 레이어</H1>
        <H2>{currentlyViewing.group.groupId}</H2>
      </div>
      <div className="grow flex flex-col gap-2 w-full p-1.5 pt-0.5">
        <div className="font-semibold text-neutral-600 p-1">
          {suggestions.length === 0
            ? "해당 텍스트 스타일은 Deprecated 되었습니다. 다른 텍스트 스타일로 변경해주세요."
            : `${currentlyViewing.group.items.length ?? 0}개 텍스트 레이어에 일괄 설정할 스타일을 선택하세요.`}
        </div>
        {hasSelectedTextNodesWithinInstance && <InstanceWarningBanner />}
        {suggestions.map((suggestion) => (
          <TextStyleSuggestionButton
            onClick={() =>
              applyTextStyle(
                currentlyViewing.group.items.map(({ textNode }) => textNode.id),
                suggestion.textStyle.id,
              )
            }
            key={suggestion.textStyle.id}
            suggestion={suggestion}
            isSelected={currentlyViewing.group.items.every(
              ({ selectedNewTextStyleId }) => selectedNewTextStyleId === suggestion.textStyle.id,
            )}
          />
        ))}
      </div>
    </RightPanel>
  );
}

function TextStyleSuggestionButton({
  isSelected,
  suggestion,
  onClick,
}: {
  isSelected?: boolean;
  suggestion: SerializedTextStyleSuggestionsResults[number]["suggestions"][number];
  onClick: (textStyle: SerializedTextStyle["id"]) => void;
  disabled?: boolean;
}) {
  const { differences, distance, textStyle } = suggestion;

  return (
    <SuggestionCard
      title={textStyle.name}
      description={
        <div className={`text-start ${distance === 0 ? "text-green-600 font-semibold" : ""}`}>
          <span className={differences.fontSize !== 0 ? "text-red-600 font-semibold" : ""}>
            {textStyle.fontSize}
            {differences.fontSize && differences.fontSize !== 0 ? ` (${differences.fontSize})` : ""}
          </span>
          <span> </span>
          <span className={differences.fontWeight !== 0 ? "text-red-600 font-semibold" : ""}>
            {textStyle.fontNameStyle}
            {differences.fontWeight && differences.fontWeight !== 0
              ? ` (${differences.fontWeight})`
              : ""}
          </span>
          <span> </span>
          <span className={differences.lineHeight !== 0 ? "text-red-600 font-semibold" : ""}>
            {getLineHeightUnitString(textStyle.lineHeight, textStyle.fontSize, true)}
            {differences.lineHeight && differences.lineHeight !== 0
              ? ` (${differences.lineHeight}px)`
              : ""}
          </span>
        </div>
      }
      onButtonClick={() => onClick(textStyle.id)}
      isSelected={isSelected}
    />
  );
}
