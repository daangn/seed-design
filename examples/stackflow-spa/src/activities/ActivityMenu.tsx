import type { StaticActivityComponentType } from "@stackflow/react/future";
import { useFlow } from "@stackflow/react/future";
import { useRef, useState } from "react";

import {
  AppBar,
  AppBarLeft,
  AppBarMain,
  AppBarBackButton,
  AppBarIconButton,
  AppBarRight,
} from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import {
  IconArrowUpBracketDownLine,
  IconBellLine,
  IconDot3VerticalLine,
  IconHouseLine,
  IconPencilLine,
  IconPlusLine,
  IconTrashcanLine,
  IconFlagLine,
  IconEyeSlashLine,
  IconBookmarkLine,
} from "@karrotmarket/react-monochrome-icon";
import { ActionButton } from "seed-design/ui/action-button";
import {
  MenuRoot,
  MenuTrigger,
  MenuAnchor,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
} from "seed-design/ui/menu";
import { FieldButton, FieldButtonPlaceholder, FieldButtonValue } from "seed-design/ui/field-button";
import { BottomSheetRoot, BottomSheetContent, BottomSheetBody } from "seed-design/ui/bottom-sheet";
import {
  AlertDialogRoot,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "seed-design/ui/alert-dialog";
import {
  BottomSheetFooter,
  ResponsivePair,
  Portal,
  Text,
  HStack,
  VStack,
} from "@seed-design/react";
import { useActivityZIndexBase } from "@seed-design/stackflow";
import { Avatar } from "seed-design/ui/avatar";
import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";
import { Switch } from "seed-design/ui/switch";

declare module "@stackflow/config" {
  interface Register {
    ActivityMenu: {};
  }
}

const SectionTitle = ({ children }: { children: string }) => (
  <Text fontSize="t5" fontWeight="bold" color="fg.neutral">
    {children}
  </Text>
);

const ActivityMenu: StaticActivityComponentType<"ActivityMenu"> = () => {
  const { push } = useFlow();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetFromMenuOpen, setSheetFromMenuOpen] = useState(false);
  const menuInSheetOpenRef = useRef(false);
  const [fieldButtonMenuOpen, setFieldButtonMenuOpen] = useState(false);
  const [selectedFruit, setSelectedFruit] = useState("");
  const [anchorMenuOpen, setAnchorMenuOpen] = useState(false);
  const [lastReason, setLastReason] = useState<string>("-");

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>Menu</AppBarMain>
        <AppBarRight>
          {/* AppBarIconButton as MenuTrigger */}
          <MenuRoot size="medium">
            <MenuTrigger asChild>
              <AppBarIconButton aria-label="알림">
                <IconBellLine />
              </AppBarIconButton>
            </MenuTrigger>
            <MenuContent>
              <MenuGroup>
                <MenuGroupLabel>알림</MenuGroupLabel>
                <MenuItem label="모두 읽음 처리" />
                <MenuItem label="알림 설정" />
              </MenuGroup>
            </MenuContent>
          </MenuRoot>

          {/* Another AppBarIconButton Menu — "more" pattern */}
          <MenuRoot size="medium" placement="bottom-end">
            <MenuTrigger asChild>
              <AppBarIconButton aria-label="더보기">
                <IconDot3VerticalLine />
              </AppBarIconButton>
            </MenuTrigger>
            <MenuContent>
              <MenuGroup>
                <MenuItem label="공유" prefixIcon={<IconArrowUpBracketDownLine />} />
                <MenuItem label="북마크" prefixIcon={<IconBookmarkLine />} />
                <MenuItem
                  label="홈으로 이동"
                  prefixIcon={<IconHouseLine />}
                  onClick={() => push("ActivityHome", {})}
                />
              </MenuGroup>
              <MenuGroup>
                <MenuItem label="신고" prefixIcon={<IconFlagLine />} tone="critical" />
              </MenuGroup>
            </MenuContent>
          </MenuRoot>

          <AppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
        <VStack gap="x6" style={{ padding: 16 }}>
          {/* 1. Basic Trigger */}
          <VStack gap="x3">
            <SectionTitle>Basic Trigger</SectionTitle>
            <HStack gap="x3">
              <MenuRoot size="medium">
                <MenuTrigger asChild>
                  <ActionButton>Medium</ActionButton>
                </MenuTrigger>
                <MenuContent>
                  <MenuGroup>
                    <MenuGroupLabel>작업</MenuGroupLabel>
                    <MenuItem label="라이브러리에 추가" prefixIcon={<IconPlusLine />} />
                    <MenuItem
                      label="수정"
                      description="현재 항목을 수정합니다"
                      prefixIcon={<IconPencilLine />}
                    />
                    <MenuItem
                      label="공유"
                      description="다른 사람과 공유합니다"
                      prefixIcon={<IconArrowUpBracketDownLine />}
                    />
                    <MenuItem label="비활성 항목" prefixIcon={<IconPlusLine />} disabled />
                  </MenuGroup>
                  <MenuGroup>
                    <MenuItem
                      label="삭제"
                      description="이 작업은 되돌릴 수 없습니다"
                      tone="critical"
                      prefixIcon={<IconTrashcanLine />}
                    />
                  </MenuGroup>
                </MenuContent>
              </MenuRoot>

              <MenuRoot size="small">
                <MenuTrigger asChild>
                  <ActionButton>Small</ActionButton>
                </MenuTrigger>
                <MenuContent>
                  <MenuGroup>
                    <MenuItem label="추가" prefixIcon={<IconPlusLine />} />
                    <MenuItem label="수정" prefixIcon={<IconPencilLine />} />
                    <MenuItem label="삭제" tone="critical" prefixIcon={<IconTrashcanLine />} />
                  </MenuGroup>
                </MenuContent>
              </MenuRoot>
            </HStack>
          </VStack>

          {/* 2. Placement */}
          <VStack gap="x3">
            <SectionTitle>Placement</SectionTitle>
            <HStack gap="x3">
              <MenuRoot placement="bottom-start">
                <MenuTrigger asChild>
                  <ActionButton variant="neutralWeak">bottom-start</ActionButton>
                </MenuTrigger>
                <MenuContent>
                  <MenuGroup>
                    <MenuItem label="Item 1" />
                    <MenuItem label="Item 2" />
                  </MenuGroup>
                </MenuContent>
              </MenuRoot>

              <MenuRoot placement="bottom-end">
                <MenuTrigger asChild>
                  <ActionButton variant="neutralWeak">bottom-end</ActionButton>
                </MenuTrigger>
                <MenuContent>
                  <MenuGroup>
                    <MenuItem label="Item 1" />
                    <MenuItem label="Item 2" />
                  </MenuGroup>
                </MenuContent>
              </MenuRoot>

              <MenuRoot placement="top">
                <MenuTrigger asChild>
                  <ActionButton variant="neutralWeak">top</ActionButton>
                </MenuTrigger>
                <MenuContent>
                  <MenuGroup>
                    <MenuItem label="Item 1" />
                    <MenuItem label="Item 2" />
                  </MenuGroup>
                </MenuContent>
              </MenuRoot>
            </HStack>
          </VStack>

          {/* 3. Anchor (controlled) with Avatar */}
          <VStack gap="x3">
            <SectionTitle>Anchor (Controlled)</SectionTitle>
            <HStack align="center" gap="x4" justify="space-between">
              <Switch
                tone="neutral"
                label="메뉴"
                checked={anchorMenuOpen}
                onCheckedChange={setAnchorMenuOpen}
              />
              <MenuRoot
                open={anchorMenuOpen}
                onOpenChange={(nextOpen, details) => {
                  if (!nextOpen && details?.reason === "interactOutside") return;
                  setAnchorMenuOpen(nextOpen);
                }}
              >
                <MenuAnchor asChild>
                  <Avatar
                    size="80"
                    src="https://avatars.githubusercontent.com/u/54893898?v=4"
                    fallback={<IdentityPlaceholder />}
                  />
                </MenuAnchor>
                <MenuContent>
                  <MenuGroup>
                    <MenuItem label="프로필 보기" />
                    <MenuItem label="메시지 보내기" />
                  </MenuGroup>
                  <MenuGroup>
                    <MenuItem label="숨기기" prefixIcon={<IconEyeSlashLine />} />
                  </MenuGroup>
                </MenuContent>
              </MenuRoot>
            </HStack>
          </VStack>

          {/* 4. FieldButton + matchReferenceWidth */}
          <VStack gap="x3">
            <SectionTitle>FieldButton (Select-like)</SectionTitle>
            <MenuRoot
              open={fieldButtonMenuOpen}
              onOpenChange={setFieldButtonMenuOpen}
              matchReferenceWidth
            >
              <MenuAnchor asChild>
                <FieldButton
                  label="과일"
                  description="좋아하는 과일을 선택해주세요."
                  values={selectedFruit ? [selectedFruit] : undefined}
                  showClearButton={!!selectedFruit}
                  onValuesChange={([value]) => setSelectedFruit(value)}
                  buttonProps={{
                    onClick: () => setFieldButtonMenuOpen((prev) => !prev),
                    "aria-haspopup": "menu",
                    "aria-expanded": fieldButtonMenuOpen,
                    "aria-label": selectedFruit ? `과일 변경. 현재: ${selectedFruit}` : "과일 선택",
                  }}
                >
                  {selectedFruit ? (
                    <FieldButtonValue>{selectedFruit}</FieldButtonValue>
                  ) : (
                    <FieldButtonPlaceholder>과일을 선택해주세요</FieldButtonPlaceholder>
                  )}
                </FieldButton>
              </MenuAnchor>
              <MenuContent>
                <MenuGroup>
                  {["사과", "바나나", "포도", "딸기", "수박"].map((fruit) => (
                    <MenuItem key={fruit} label={fruit} onClick={() => setSelectedFruit(fruit)} />
                  ))}
                </MenuGroup>
              </MenuContent>
            </MenuRoot>
          </VStack>

          {/* 5. onOpenChange details / reason tracking */}
          <VStack gap="x3">
            <SectionTitle>onOpenChange Reason</SectionTitle>
            <HStack align="center" gap="x4">
              <MenuRoot
                onOpenChange={(_open, details) => {
                  if (details?.reason) setLastReason(details.reason);
                }}
              >
                <MenuTrigger asChild>
                  <ActionButton variant="neutralWeak">Reason 추적</ActionButton>
                </MenuTrigger>
                <MenuContent>
                  <MenuGroup>
                    <MenuItem label="항목" />
                  </MenuGroup>
                </MenuContent>
              </MenuRoot>
              <Text fontSize="t3" color="fg.neutralMuted">
                마지막: {lastReason}
              </Text>
            </HStack>
          </VStack>

          {/* 6. Menu → BottomSheet */}
          <VStack gap="x3">
            <SectionTitle>Menu → BottomSheet</SectionTitle>
            <MenuRoot size="medium">
              <MenuTrigger asChild>
                <ActionButton>메뉴에서 시트 열기</ActionButton>
              </MenuTrigger>
              <MenuContent>
                <MenuGroup>
                  <MenuItem label="추가" prefixIcon={<IconPlusLine />} />
                  <MenuItem
                    label="BottomSheet 열기"
                    prefixIcon={<IconArrowUpBracketDownLine />}
                    onClick={() => setSheetFromMenuOpen(true)}
                  />
                </MenuGroup>
              </MenuContent>
            </MenuRoot>

            <BottomSheetRoot open={sheetFromMenuOpen} onOpenChange={setSheetFromMenuOpen}>
              <Portal>
                <BottomSheetContent
                  title="Menu에서 열림"
                  showHandle
                  layerIndex={useActivityZIndexBase({ activityOffset: 1 })}
                >
                  <BottomSheetBody>
                    <Text>Menu item 클릭으로 열린 BottomSheet입니다.</Text>
                  </BottomSheetBody>
                </BottomSheetContent>
              </Portal>
            </BottomSheetRoot>
          </VStack>

          {/* 7. Menu inside BottomSheet */}
          <VStack gap="x3">
            <SectionTitle>Menu in BottomSheet</SectionTitle>
            <ActionButton onClick={() => setSheetOpen(true)}>BottomSheet 열기</ActionButton>
            <BottomSheetRoot open={sheetOpen} onOpenChange={setSheetOpen}>
              <Portal>
                <BottomSheetContent
                  title="Menu in BottomSheet"
                  showHandle
                  layerIndex={useActivityZIndexBase({ activityOffset: 1 })}
                >
                  <BottomSheetBody>
                    <Text>BottomSheet 내부에서 Menu를 열 수 있습니다.</Text>
                  </BottomSheetBody>
                  <BottomSheetFooter>
                    <MenuRoot
                      size="medium"
                      onOpenChange={(open) => {
                        menuInSheetOpenRef.current = open;
                      }}
                    >
                      <MenuTrigger asChild>
                        <ActionButton variant="neutralWeak">Open Menu</ActionButton>
                      </MenuTrigger>
                      <MenuContent>
                        <MenuGroup>
                          <MenuItem label="추가" prefixIcon={<IconPlusLine />} />
                          <MenuItem label="수정" prefixIcon={<IconPencilLine />} />
                          <MenuItem label="공유" prefixIcon={<IconArrowUpBracketDownLine />} />
                        </MenuGroup>
                        <MenuGroup>
                          <MenuItem
                            label="삭제"
                            tone="critical"
                            prefixIcon={<IconTrashcanLine />}
                          />
                        </MenuGroup>
                      </MenuContent>
                    </MenuRoot>
                  </BottomSheetFooter>
                </BottomSheetContent>
              </Portal>
            </BottomSheetRoot>
          </VStack>

          {/* 8. Menu inside AlertDialog */}
          <VStack gap="x3">
            <SectionTitle>Menu in AlertDialog</SectionTitle>
            <AlertDialogRoot>
              <AlertDialogTrigger asChild>
                <ActionButton>AlertDialog 열기</ActionButton>
              </AlertDialogTrigger>
              <Portal>
                <AlertDialogContent layerIndex={useActivityZIndexBase({ activityOffset: 1 })}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Menu in AlertDialog</AlertDialogTitle>
                    <AlertDialogDescription>
                      AlertDialog 내부에서 Menu를 열 수 있습니다.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <ResponsivePair gap="x2">
                      <MenuRoot size="medium">
                        <MenuTrigger asChild>
                          <ActionButton variant="neutralWeak">Open Menu</ActionButton>
                        </MenuTrigger>
                        <MenuContent>
                          <MenuGroup>
                            <MenuItem label="추가" prefixIcon={<IconPlusLine />} />
                            <MenuItem label="수정" prefixIcon={<IconPencilLine />} />
                          </MenuGroup>
                        </MenuContent>
                      </MenuRoot>
                      <AlertDialogAction variant="neutralSolid">확인</AlertDialogAction>
                    </ResponsivePair>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </Portal>
            </AlertDialogRoot>
          </VStack>

          {/* 9. Many items (scroll) */}
          <VStack gap="x3">
            <SectionTitle>Many Items (Scroll)</SectionTitle>
            <MenuRoot size="medium">
              <MenuTrigger asChild>
                <ActionButton variant="neutralWeak">30개 항목</ActionButton>
              </MenuTrigger>
              <MenuContent>
                <MenuGroup>
                  <MenuGroupLabel>Recently Played</MenuGroupLabel>
                  {Array.from({ length: 30 }, (_, i) => (
                    <MenuItem key={`track-${i}`} label={`Track ${i + 1}`} />
                  ))}
                </MenuGroup>
              </MenuContent>
            </MenuRoot>
          </VStack>
        </VStack>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityMenu;
