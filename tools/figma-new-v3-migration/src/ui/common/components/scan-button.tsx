import { ActionButton } from "@seed-design/react";
import type { SerializedBaseNode } from "shared/types";

interface ScanButtonProps {
  /**
   * 선택된 노드들의 정보
   */
  selections: SerializedBaseNode[];
  /**
   * 로딩 상태
   */
  isLoading: boolean;
  /**
   * 현재 탭 검사 핸들러
   */
  onScan: () => void;
}

/**
 * 현재 선택된 프레임들에 대해 suggestion을 요청하는 버튼 컴포넌트
 */
export function ScanButton({ selections, isLoading, onScan }: ScanButtonProps) {
  // 선택된 노드가 없을 때는 비활성화
  const isDisabled = selections.length === 0;

  return (
    <ActionButton onClick={onScan} size="xsmall" disabled={isDisabled} variant="neutralSolid">
      {isLoading ? "검사중..." : `${selections.length}개 프레임 검사하기`}
    </ActionButton>
  );
}
