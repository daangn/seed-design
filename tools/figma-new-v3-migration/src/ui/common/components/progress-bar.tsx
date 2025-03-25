import { Box, Flex, Text } from "@seed-design/react";

export interface MigrationProgress {
  total: number;
  selected?: number;
  left: number;
  percent: number;
}

interface ProgressBarProps {
  progress: MigrationProgress;
  className?: string;
  /**
   * 상태 텍스트를 표시할지 여부
   * @default true
   */
  showStatusText?: boolean;
  /**
   * 진행 상황 제목을 표시할지 여부
   * @default false
   */
  showTitle?: boolean;
  /**
   * 진행률 100%일 때 표시할 메시지
   * @default "완료"
   */
  completeMessage?: string;
}

export function ProgressBar({
  progress,
  className,
  showStatusText = true,
  showTitle = false,
  completeMessage = "완료",
}: ProgressBarProps) {
  return (
    <Flex
      padding="x2"
      alignItems="center"
      gap="x2"
      borderTopWidth={1}
      borderColor="palette.gray200"
      className={className}
    >
      {showTitle && (
        <Text fontSize="t1" color="palette.gray700" style={{ whiteSpace: "nowrap" }}>
          마이그레이션 현황
        </Text>
      )}

      <Box
        style={{
          position: "relative",
          height: "4px",
          width: "100%",
          backgroundColor: "var(--seed-scale-color-neutral-200)",
        }}
        borderRadius="r1"
      >
        <Box
          width={`${progress.percent}%`}
          height="100%"
          background="palette.blue500"
          borderRadius="r1"
          style={{ transition: "width 0.3s" }}
        />
      </Box>

      {showStatusText && (
        <Text fontSize="t1" color="palette.gray700" style={{ whiteSpace: "nowrap" }}>
          {progress.left === 0 ? completeMessage : `${progress.left}개 남음 (${progress.percent}%)`}
        </Text>
      )}
    </Flex>
  );
}
