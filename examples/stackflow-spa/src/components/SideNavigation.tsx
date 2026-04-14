import { useState } from "react";
import {
  SideNavigationRoot,
  SideNavigationHeader,
  SideNavigationContent,
  SideNavigationGroup,
  SideNavigationGroupLabel,
  SideNavigationItemCollapsible,
  SideNavigationItemButton,
  SideNavigationFooter,
  SideNavigationTrigger,
  type SideNavigationRootProps,
} from "seed-design/ui/side-navigation";

import {
  IconHouseFill,
  IconMegaphoneTiltedFill,
  IconPlusCircleFill,
  IconDocumentFill,
  IconToolboxFill,
  IconWonCircleFill,
  IconReceiptFill,
  IconGearFill,
  IconBarchartSquareFill,
  IconPersonFill,
  IconPerson2Fill,
  IconStoreFill,
  IconTagFill,
  IconBellFill,
  IconClockFill,
  IconBookmarkFill,
  IconStarFill,
  IconGiftFill,
  IconFlagFill,
  IconLockFill,
} from "@karrotmarket/react-monochrome-icon";

interface SideNavigationProps extends SideNavigationRootProps {}

export function SideNavigation(props: SideNavigationProps) {
  const [currentItem, setCurrentItem] = useState("홈");

  const navItemProps = (label: string) => ({
    current: currentItem === label,
    onClick: () => setCurrentItem(label),
  });

  return (
    <SideNavigationRoot {...props}>
      <SideNavigationHeader />
      <SideNavigationTrigger />
      <SideNavigationContent>
        <SideNavigationGroup>
          <SideNavigationGroupLabel>광고</SideNavigationGroupLabel>

          <SideNavigationItemButton
            prefixIcon={<IconHouseFill />}
            label="홈"
            {...navItemProps("홈")}
          />

          <SideNavigationItemCollapsible
            defaultOpen
            prefixIcon={<IconMegaphoneTiltedFill />}
            label="광고 관리"
            items={[
              { label: "디스플레이 광고 관리", ...navItemProps("디스플레이 광고 관리") },
              { label: "검색 광고 관리", ...navItemProps("검색 광고 관리") },
            ]}
          />

          <SideNavigationItemButton
            prefixIcon={<IconPlusCircleFill />}
            label="광고 만들기"
            {...navItemProps("광고 만들기")}
          />

          <SideNavigationItemButton
            prefixIcon={<IconDocumentFill />}
            label="보고서"
            {...navItemProps("보고서")}
          />

          <SideNavigationItemCollapsible
            defaultOpen
            prefixIcon={<IconToolboxFill />}
            label="광고 도구"
            items={[
              { label: "카탈로그 관리", ...navItemProps("카탈로그 관리") },
              { label: "전환 추적 관리", disabled: true, ...navItemProps("전환 추적 관리") },
              { label: "맞춤 타겟 관리", ...navItemProps("맞춤 타겟 관리") },
              { label: "리드폼 관리", ...navItemProps("리드폼 관리") },
              { label: "대량 관리", ...navItemProps("대량 관리") },
            ]}
          />
        </SideNavigationGroup>

        <SideNavigationGroup>
          <SideNavigationGroupLabel>결제</SideNavigationGroupLabel>

          <SideNavigationItemCollapsible
            prefixIcon={<IconWonCircleFill />}
            label="광고캐시"
            items={[
              { label: "광고캐시 관리", ...navItemProps("광고캐시 관리") },
              { label: "세금계산서", ...navItemProps("세금계산서") },
            ]}
          />

          <SideNavigationItemButton
            prefixIcon={<IconReceiptFill />}
            label="변경내역"
            disabled
            {...navItemProps("변경내역")}
          />
        </SideNavigationGroup>

        <SideNavigationGroup>
          <SideNavigationGroupLabel>계정</SideNavigationGroupLabel>

          <SideNavigationItemCollapsible
            prefixIcon={<IconGearFill />}
            label="설정"
            items={[
              { label: "광고계정 관리", ...navItemProps("광고계정 관리") },
              { label: "심사서류 관리", ...navItemProps("심사서류 관리") },
              { label: "운영자 관리", ...navItemProps("운영자 관리") },
              { label: "광고 대행사 관리", ...navItemProps("광고 대행사 관리") },
              { label: "내 알림 관리", ...navItemProps("내 알림 관리") },
            ]}
          />
        </SideNavigationGroup>

        <SideNavigationGroup>
          <SideNavigationGroupLabel>성과 분석</SideNavigationGroupLabel>

          <SideNavigationItemButton
            prefixIcon={<IconBarchartSquareFill />}
            label="대시보드"
            {...navItemProps("대시보드")}
          />
          <SideNavigationItemCollapsible
            prefixIcon={<IconStarFill />}
            label="성과 리포트"
            items={[
              { label: "일간 리포트", ...navItemProps("일간 리포트") },
              { label: "주간 리포트", ...navItemProps("주간 리포트") },
              { label: "월간 리포트", ...navItemProps("월간 리포트") },
              { label: "맞춤 기간 리포트", ...navItemProps("맞춤 기간 리포트") },
            ]}
          />
          <SideNavigationItemButton
            prefixIcon={<IconFlagFill />}
            label="목표 관리"
            {...navItemProps("목표 관리")}
          />
          <SideNavigationItemButton
            prefixIcon={<IconBookmarkFill />}
            label="저장된 필터"
            {...navItemProps("저장된 필터")}
          />
        </SideNavigationGroup>

        <SideNavigationGroup>
          <SideNavigationGroupLabel>비즈니스</SideNavigationGroupLabel>

          <SideNavigationItemButton
            prefixIcon={<IconStoreFill />}
            label="비즈프로필 관리"
            {...navItemProps("비즈프로필 관리")}
          />
          <SideNavigationItemCollapsible
            prefixIcon={<IconTagFill />}
            label="쿠폰"
            items={[
              { label: "쿠폰 만들기", ...navItemProps("쿠폰 만들기") },
              { label: "발급 내역", ...navItemProps("발급 내역") },
              { label: "사용 내역", ...navItemProps("사용 내역") },
            ]}
          />
          <SideNavigationItemButton
            prefixIcon={<IconGiftFill />}
            label="프로모션"
            {...navItemProps("프로모션")}
          />
        </SideNavigationGroup>

        <SideNavigationGroup>
          <SideNavigationGroupLabel>고객 관리</SideNavigationGroupLabel>

          <SideNavigationItemCollapsible
            prefixIcon={<IconPersonFill />}
            label="타겟 고객"
            items={[
              { label: "고객 세그먼트", ...navItemProps("고객 세그먼트") },
              { label: "리타겟팅 목록", ...navItemProps("리타겟팅 목록") },
              { label: "유사 타겟", ...navItemProps("유사 타겟") },
            ]}
          />
          <SideNavigationItemButton
            prefixIcon={<IconPerson2Fill />}
            label="고객 인사이트"
            {...navItemProps("고객 인사이트")}
          />
          <SideNavigationItemButton
            prefixIcon={<IconBellFill />}
            label="알림 발송"
            {...navItemProps("알림 발송")}
          />
        </SideNavigationGroup>

        <SideNavigationGroup>
          <SideNavigationGroupLabel>기타</SideNavigationGroupLabel>

          <SideNavigationItemButton
            prefixIcon={<IconClockFill />}
            label="활동 로그"
            {...navItemProps("활동 로그")}
          />
          <SideNavigationItemButton
            prefixIcon={<IconLockFill />}
            label="권한 관리"
            {...navItemProps("권한 관리")}
          />
        </SideNavigationGroup>
      </SideNavigationContent>

      <SideNavigationFooter>
        <SideNavigationItemButton
          prefixIcon={<IconBellFill />}
          label="알림"
          {...navItemProps("알림")}
        />
      </SideNavigationFooter>
    </SideNavigationRoot>
  );
}
