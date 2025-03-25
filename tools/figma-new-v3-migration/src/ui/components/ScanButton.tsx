import { ActionChip } from "@seed-design/react";
import { events } from "../../shared/event";
import type { SerializedBaseNode } from "../../shared/types";
import type { AvailableSteps } from "../context/migration";

interface ScanButtonProps {
  /**
   * 현재 선택된 탭
   */
  currentTab: AvailableSteps;
  /**
   * 선택된 노드들의 정보
   */
  selections: SerializedBaseNode[];
}

/**
 * 현재 선택된 프레임들에 대해 suggestion을 요청하는 버튼 컴포넌트
 */
export function ScanButton({ currentTab, selections }: ScanButtonProps) {
  /**
   * 선택된 프레임들에 대한 suggestion 요청 핸들러
   */
  const handleScan = () => {
    // 선택된 노드가 없으면 아무 작업도 하지 않음
    if (selections.length === 0) return;

    // 선택된 프레임들을 targets로 설정
    events("request-announce-target").emit({
      nodeIds: selections.map(({ id }) => id),
    });

    // 현재 탭에 따라 다른 이벤트 emit
    switch (currentTab) {
      case "colors":
        events("request-color-suggestions").emit({
          nodeIds: selections.map(({ id }) => id),
        });
        break;
      case "text-styles":
        events("request-text-style-suggestions").emit({
          nodeIds: selections.map(({ id }) => id),
        });
        break;
      default:
        console.warn(`Unknown tab: ${currentTab}`);
    }
  };

  // 선택된 노드가 없을 때는 비활성화
  const isDisabled = selections.length === 0;

  return (
    <ActionChip onClick={handleScan} size="small" disabled={isDisabled}>
      검사하기 {selections.length > 0 && `(${selections.length})`}
    </ActionChip>
  );
}
