import { IconArrow2ClockwiseCircularLine } from "@daangn/react-monochrome-icon";
import { ActionButton, Box, Flex, Icon } from "@seed-design/react";
import type { ReactNode } from "react";

interface FooterProps {
  /**
   * 메인 액션 버튼에 표시할 텍스트
   */
  actionText?: string;
  /**
   * 메인 액션 버튼 클릭 핸들러
   */
  onAction?: () => void;
  /**
   * 메인 액션 버튼의 비활성화 여부
   */
  actionDisabled?: boolean;
  /**
   * 메인 액션 버튼에 표시할 툴팁
   */
  actionTooltip?: string;
  /**
   * 새로고침 버튼 클릭 핸들러
   */
  onRefresh?: () => void;
  /**
   * 새로고침 버튼의 표시 여부
   */
  showRefreshButton?: boolean;
  /**
   * 메인 액션 버튼 대신 표시할 커스텀 콘텐츠
   */
  customContent?: ReactNode;
}

/**
 * 탭 컨텐츠의 하단에 표시되는 공통 Footer 컴포넌트
 */
export function Footer({
  actionText,
  onAction,
  actionDisabled = false,
  actionTooltip,
  onRefresh,
  showRefreshButton = false,
  customContent,
}: FooterProps) {
  return (
    <Flex
      borderTopWidth={1}
      borderColor="palette.gray200"
      padding="x3"
      style={{
        gap: "8px",
        flexShrink: 0,
        backgroundColor: "var(--seed-scale-color-palette-gray-0)",
      }}
    >
      {customContent ? (
        // 커스텀 콘텐츠가 있으면 표시
        <Box style={{ position: "relative", flexGrow: 1 }}>{customContent}</Box>
      ) : (
        // 없으면 메인 액션 버튼 표시
        actionText && (
          <Box style={{ position: "relative", flexGrow: 1 }}>
            <ActionButton
              variant="neutralSolid"
              onClick={onAction}
              disabled={actionDisabled}
              style={{ width: "100%" }}
              title={actionTooltip}
            >
              {actionText}
            </ActionButton>
          </Box>
        )
      )}

      {/* 새로고침 버튼 */}
      {showRefreshButton && onRefresh && (
        <ActionButton onClick={onRefresh} variant="neutralWeak" layout="iconOnly">
          <Icon svg={<IconArrow2ClockwiseCircularLine />} />
        </ActionButton>
      )}
    </Flex>
  );
}
