import { Box, HStack, Text, VStack, VisuallyHidden } from "@seed-design/react";
import { useActivityZIndexBase } from "@seed-design/stackflow";
import { useActivity, useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import { useState } from "react";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
} from "seed-design/ui/bottom-sheet";
import { Avatar } from "seed-design/ui/avatar";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";

declare module "@stackflow/config" {
  interface Register {
    ActivityBottomSheetInputFocus: {};
  }
}

const SNAP_POINTS = [0.5, 0.85] as const;

const CHAT_ROOMS = [
  { id: "jamsil", name: "잠실엘스", members: "145명", color: "palette.blue100", label: "L" },
  { id: "fufuf", name: "Fufuf", members: "1명", color: "palette.purple100", label: "F" },
  { id: "rfwfwfwfaf", name: "Rfwfwfwfaf", members: "1명", color: "palette.purple100", label: "R" },
  {
    id: "tenants",
    name: "실거주 인증 채팅방",
    members: "9명",
    color: "palette.purple100",
    label: "채",
  },
] as const;

type ChatRoom = (typeof CHAT_ROOMS)[number];
type SnapPoint = (typeof SNAP_POINTS)[number];

const ActivityBottomSheetInputFocus: StaticActivityComponentType<
  "ActivityBottomSheetInputFocus"
> = () => {
  const { pop } = useFlow();
  const { isActive, transitionState } = useActivity();
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [activeSnapPoint, setActiveSnapPoint] = useState<SnapPoint>(SNAP_POINTS[0]);

  const open = transitionState === "enter-active" || transitionState === "enter-done";

  const handleSelectRoom = (room: ChatRoom) => {
    setSelectedRoom(room);
    setActiveSnapPoint(SNAP_POINTS[1]);
  };

  return (
    <BottomSheetRoot
      open={open}
      snapPoints={[...SNAP_POINTS]}
      activeSnapPoint={activeSnapPoint}
      setActiveSnapPoint={(snapPoint) => {
        if (snapPoint !== null && SNAP_POINTS.includes(snapPoint as SnapPoint)) {
          setActiveSnapPoint(snapPoint as SnapPoint);
        }
      }}
      onOpenChange={(nextOpen) => !nextOpen && isActive && pop()}
    >
      <BottomSheetContent
        showHandle
        showCloseButton
        title="같이해요 공유"
        layerIndex={useActivityZIndexBase()}
        style={{ height: "100%" }}
      >
        <BottomSheetBody>
          <VStack gap="x6">
            <HStack gap="x3" justify="space-between">
              {CHAT_ROOMS.map((room) => {
                const selected = selectedRoom?.id === room.id;

                return (
                  <Box
                    as="button"
                    key={room.id}
                    alignItems="center"
                    aria-pressed={selected}
                    display="flex"
                    flexDirection="column"
                    flexGrow
                    flexShrink={0}
                    gap="x2"
                    minWidth="0"
                    onClick={() => handleSelectRoom(room)}
                  >
                    <Box
                      alignItems="center"
                      display="flex"
                      height="64px"
                      justifyContent="center"
                      width="64px"
                    >
                      <Avatar
                        size="56"
                        fallback={
                          <Box
                            alignItems="center"
                            bg={room.color}
                            display="flex"
                            height="full"
                            justifyContent="center"
                            width="full"
                          >
                            <Text color="fg.neutral" textStyle="t5Bold">
                              {room.label}
                            </Text>
                          </Box>
                        }
                      />
                    </Box>
                    <VStack align="center" gap="x1">
                      <Text align="center" color="fg.neutral" textStyle="t2Medium">
                        {room.name}
                      </Text>
                      <Text align="center" color="fg.neutralMuted" textStyle="t2Regular">
                        {room.members}
                      </Text>
                    </VStack>
                    {selected && <VisuallyHidden>선택됨</VisuallyHidden>}
                  </Box>
                );
              })}
            </HStack>

            {selectedRoom && (
              <TextField
                hideCharacterCount
                label={`${selectedRoom.name}에 보낼 메시지`}
                name="message"
              >
                <TextFieldInput autoFocus placeholder="메시지를 입력해 주세요. (선택)" />
              </TextField>
            )}
          </VStack>
        </BottomSheetBody>
        <BottomSheetFooter>
          <Text align="center" as="p" color="fg.neutralMuted" textStyle="t2Regular">
            채팅방을 선택하면 더 큰 snap point로 확장됩니다.
          </Text>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheetRoot>
  );
};

export default ActivityBottomSheetInputFocus;
