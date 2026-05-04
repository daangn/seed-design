import type { StaticActivityComponentType } from "@stackflow/react/future";
import {
  SideNavigationProvider,
  SideNavigationInset,
  SideNavigationRoot,
  SideNavigationHeader,
  SideNavigationContent,
  SideNavigationGroup,
  SideNavigationFooter,
  SideNavigationTrigger,
  SideNavigationItemButton,
} from "seed-design/ui/side-navigation";

import { Layout, VStack } from "@seed-design/react";
import {
  RadioSelectBoxRoot,
  RadioSelectBoxItem,
  RadioSelectBoxRadiomark,
} from "seed-design/ui/select-box";
import { sideNavigationVariantMap } from "@seed-design/css/recipes/side-navigation";
import { layoutVariantMap } from "@seed-design/css/recipes/layout";
import { useState } from "react";

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

declare module "@stackflow/config" {
  interface Register {
    ActivitySideNavigation: {};
  }
}

const ActivitySideNavigation: StaticActivityComponentType<"ActivitySideNavigation"> = () => {
  const [layoutDensity, setLayoutDensity] =
    useState<(typeof layoutVariantMap.density)[number]>("medium");
  const [sideNavigationTone, setSideNavigationTone] =
    useState<(typeof sideNavigationVariantMap.tone)[number]>("neutral");

  const [currentItem, setCurrentItem] = useState("홈");
  const navItemProps = (label: string) => ({
    current: currentItem === label,
    onClick: () => setCurrentItem(label),
  });

  return (
    <>
      <Layout.Root density={layoutDensity}>
        <SideNavigationProvider
          defaultCollapsed={localStorage.getItem("sidebar-collapsed") === "true"}
          onCollapsedChange={(v) => localStorage.setItem("sidebar-collapsed", String(v))}
        >
          <SideNavigationRoot tone={sideNavigationTone}>
            <SideNavigationHeader>
              <SideNavigationTrigger />
            </SideNavigationHeader>
            <SideNavigationContent>
              <SideNavigationGroup
                label="광고"
                items={[
                  { label: "홈", prefixIcon: <IconHouseFill />, ...navItemProps("홈") },
                  {
                    label: "광고 관리",
                    prefixIcon: <IconMegaphoneTiltedFill />,
                    defaultOpen: true,
                    items: [
                      { label: "디스플레이 광고 관리", ...navItemProps("디스플레이 광고 관리") },
                      { label: "검색 광고 관리", ...navItemProps("검색 광고 관리") },
                    ],
                  },
                  {
                    label: "광고 만들기",
                    prefixIcon: <IconPlusCircleFill />,
                    ...navItemProps("광고 만들기"),
                  },
                  { label: "보고서", prefixIcon: <IconDocumentFill />, ...navItemProps("보고서") },
                  {
                    label: "광고 도구",
                    prefixIcon: <IconToolboxFill />,
                    defaultOpen: true,
                    items: [
                      { label: "카탈로그 관리", ...navItemProps("카탈로그 관리") },
                      {
                        label: "전환 추적 관리",
                        disabled: true,
                        ...navItemProps("전환 추적 관리"),
                      },
                      { label: "맞춤 타겟 관리", ...navItemProps("맞춤 타겟 관리") },
                      { label: "리드폼 관리", ...navItemProps("리드폼 관리") },
                      { label: "대량 관리", ...navItemProps("대량 관리") },
                    ],
                  },
                ]}
              />
              <SideNavigationGroup
                label="결제"
                items={[
                  {
                    label: "광고캐시",
                    prefixIcon: <IconWonCircleFill />,
                    items: [
                      { label: "광고캐시 관리", ...navItemProps("광고캐시 관리") },
                      { label: "세금계산서", ...navItemProps("세금계산서") },
                    ],
                  },
                  {
                    label: "변경내역",
                    prefixIcon: <IconReceiptFill />,
                    disabled: true,
                    ...navItemProps("변경내역"),
                  },
                ]}
              />
              <SideNavigationGroup
                label="계정"
                items={[
                  {
                    label: "설정",
                    prefixIcon: <IconGearFill />,
                    items: [
                      { label: "광고계정 관리", ...navItemProps("광고계정 관리") },
                      { label: "심사서류 관리", ...navItemProps("심사서류 관리") },
                      { label: "운영자 관리", ...navItemProps("운영자 관리") },
                      { label: "광고 대행사 관리", ...navItemProps("광고 대행사 관리") },
                      { label: "내 알림 관리", ...navItemProps("내 알림 관리") },
                    ],
                  },
                ]}
              />
              <SideNavigationGroup
                label="성과 분석"
                items={[
                  {
                    label: "대시보드",
                    prefixIcon: <IconBarchartSquareFill />,
                    ...navItemProps("대시보드"),
                  },
                  {
                    label: "성과 리포트",
                    prefixIcon: <IconStarFill />,
                    items: [
                      { label: "일간 리포트", ...navItemProps("일간 리포트") },
                      { label: "주간 리포트", ...navItemProps("주간 리포트") },
                      { label: "월간 리포트", ...navItemProps("월간 리포트") },
                      { label: "맞춤 기간 리포트", ...navItemProps("맞춤 기간 리포트") },
                    ],
                  },
                  {
                    label: "목표 관리",
                    prefixIcon: <IconFlagFill />,
                    ...navItemProps("목표 관리"),
                  },
                  {
                    label: "저장된 필터",
                    prefixIcon: <IconBookmarkFill />,
                    ...navItemProps("저장된 필터"),
                  },
                ]}
              />
              <SideNavigationGroup
                label="비즈니스"
                items={[
                  {
                    label: "비즈프로필 관리",
                    prefixIcon: <IconStoreFill />,
                    ...navItemProps("비즈프로필 관리"),
                  },
                  {
                    label: "쿠폰",
                    prefixIcon: <IconTagFill />,
                    items: [
                      { label: "쿠폰 만들기", ...navItemProps("쿠폰 만들기") },
                      { label: "발급 내역", ...navItemProps("발급 내역") },
                      { label: "사용 내역", ...navItemProps("사용 내역") },
                    ],
                  },
                  { label: "프로모션", prefixIcon: <IconGiftFill />, ...navItemProps("프로모션") },
                ]}
              />
              <SideNavigationGroup
                label="고객 관리"
                items={[
                  {
                    label: "타겟 고객",
                    prefixIcon: <IconPersonFill />,
                    items: [
                      { label: "고객 세그먼트", ...navItemProps("고객 세그먼트") },
                      { label: "리타겟팅 목록", ...navItemProps("리타겟팅 목록") },
                      { label: "유사 타겟", ...navItemProps("유사 타겟") },
                    ],
                  },
                  {
                    label: "고객 인사이트",
                    prefixIcon: <IconPerson2Fill />,
                    ...navItemProps("고객 인사이트"),
                  },
                  {
                    label: "알림 발송",
                    prefixIcon: <IconBellFill />,
                    ...navItemProps("알림 발송"),
                  },
                ]}
              />
              <SideNavigationGroup
                label="기타"
                items={[
                  {
                    label: "활동 로그",
                    prefixIcon: <IconClockFill />,
                    ...navItemProps("활동 로그"),
                  },
                  {
                    label: "권한 관리",
                    prefixIcon: <IconLockFill />,
                    ...navItemProps("권한 관리"),
                  },
                ]}
              />
            </SideNavigationContent>
            <SideNavigationFooter>
              <SideNavigationItemButton
                prefixIcon={<IconBellFill />}
                label="알림"
                {...navItemProps("알림")}
              />
            </SideNavigationFooter>
          </SideNavigationRoot>
          <SideNavigationInset>
            <Layout.Content>
              <VStack px="spacingX.globalGutter" py="x4" gap="spacingY.componentDefault">
                <RadioSelectBoxRoot
                  label="Side Navigation Tone"
                  value={sideNavigationTone}
                  onValueChange={(value) =>
                    setSideNavigationTone(value as typeof sideNavigationTone)
                  }
                  columns={sideNavigationVariantMap.tone.length}
                >
                  {sideNavigationVariantMap.tone.map((tone) => (
                    <RadioSelectBoxItem
                      key={tone}
                      value={tone}
                      label={tone}
                      suffix={<RadioSelectBoxRadiomark />}
                    />
                  ))}
                </RadioSelectBoxRoot>
                <RadioSelectBoxRoot
                  label="Layout Density"
                  value={layoutDensity}
                  onValueChange={(value) => setLayoutDensity(value as typeof layoutDensity)}
                  columns={layoutVariantMap.density.length}
                >
                  {layoutVariantMap.density.map((density) => (
                    <RadioSelectBoxItem
                      key={density}
                      value={density}
                      label={density}
                      suffix={<RadioSelectBoxRadiomark />}
                    />
                  ))}
                </RadioSelectBoxRoot>
              </VStack>
            </Layout.Content>
          </SideNavigationInset>
        </SideNavigationProvider>
      </Layout.Root>
      <style>
        {`body {
          height: 100vh;
        }`}
      </style>
    </>
  );
};

export default ActivitySideNavigation;
