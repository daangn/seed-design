import { Badge, Flex, Text } from "@seed-design/react";
import { events } from "../../shared/event";
import type { SerializedBaseNode } from "../../shared/types";

interface TargetBadgesProps {
  targets: SerializedBaseNode[];
  maxVisible?: number;
}

/**
 * 타겟 레이어를 뱃지 형태로 표시하는 컴포넌트
 * 기본적으로 최대 3개까지 표시하고 나머지는 +N 형태로 통합
 */
export function TargetBadges({ targets, maxVisible = 3 }: TargetBadgesProps) {
  // 타겟이 없는 경우 아무것도 표시하지 않음
  if (targets.length === 0) {
    return null;
  }

  // 긴 이름을 적당한 길이로 자르는 함수
  const truncateName = (name: string, maxLength = 10) => {
    if (name.length <= maxLength) return name;
    return name.slice(0, maxLength) + "...";
  };

  return (
    <Flex gap="x1" alignItems="center">
      <Text fontSize="t1">마이그레이션 대상</Text>
      {targets.length <= maxVisible ? (
        // maxVisible 이하면 모두 표시
        targets.map((target) => (
          <Badge
            variant="weak"
            style={{
              cursor: "pointer",
              maxWidth: "120px",
              whiteSpace: "nowrap",
              display: "inline-block",
            }}
            onClick={() => events("focus-node").emit({ nodeIds: [target.id] })}
            key={target.id}
            title={target.name} // 전체 이름을 툴팁으로 표시
          >
            {truncateName(target.name)}
          </Badge>
        ))
      ) : (
        // maxVisible 초과면 처음 maxVisible개만 표시하고 나머지는 +N으로 표시
        <>
          {targets.slice(0, maxVisible).map((target) => (
            <Badge
              variant="weak"
              style={{
                cursor: "pointer",
                maxWidth: "120px",
                whiteSpace: "nowrap",
                display: "inline-block",
              }}
              onClick={() => events("focus-node").emit({ nodeIds: [target.id] })}
              key={target.id}
              title={target.name} // 전체 이름을 툴팁으로 표시
            >
              {truncateName(target.name)}
            </Badge>
          ))}
          <Badge
            variant="weak"
            style={{
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
            onClick={() =>
              events("focus-node").emit({ nodeIds: targets.slice(maxVisible).map((t) => t.id) })
            }
          >
            +{targets.length - maxVisible}
          </Badge>
        </>
      )}
    </Flex>
  );
}
