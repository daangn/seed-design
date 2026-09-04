import "./styles";

import IconArrowClockwiseCircularFill from "@karrotmarket/lynx-monochrome-icon/IconArrowClockwiseCircularFill";
import { root, useRef, useState } from "@lynx-js/react";
import {
  ActionButton,
  type BottomSheetRootRef,
  PrefixIcon,
  useSeedClassName,
} from "@seed-design/lynx-react";

import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
  BottomSheetTrigger,
} from "@/components/ui/bottom-sheet";
import { List, ListCheckItem } from "@/components/ui/list";

const TYPES = ["버스", "지하철", "택시", "자전거", "도보"] as const;

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const sheetRef = useRef<BottomSheetRootRef>(null);
  const [selectedTypes, setSelectedTypes] = useState<(typeof TYPES)[number][]>([]);

  return (
    <page className={seedClassName}>
      <view className="list-preview list-preview--centered">
        <BottomSheetRoot ref={sheetRef}>
          <BottomSheetTrigger>
            <ActionButton variant="neutralSolid">BottomSheet 열기</ActionButton>
          </BottomSheetTrigger>
          <BottomSheetContent title="교통수단" description="이동할 교통수단을 선택해주세요.">
            <BottomSheetBody style={{ flex: "none", height: "280px" }}>
              <List>
                {TYPES.map((type) => (
                  <ListCheckItem
                    key={type}
                    title={type}
                    checked={selectedTypes.includes(type)}
                    onCheckedChange={() => {
                      setSelectedTypes((previous) =>
                        previous.includes(type)
                          ? previous.filter((item) => item !== type)
                          : [...previous, type],
                      );
                    }}
                  />
                ))}
              </List>
            </BottomSheetBody>
            <BottomSheetFooter>
              <view className="list-preview__bottom-sheet-actions">
                <ActionButton
                  size="large"
                  variant="neutralSolid"
                  disabled={selectedTypes.length === 0}
                  bindtap={() => {
                    "background only";
                    sheetRef.current?.close();
                  }}
                >
                  경로 찾기
                </ActionButton>
                <ActionButton
                  size="small"
                  variant="ghost"
                  disabled={selectedTypes.length === 0}
                  bindtap={() => {
                    "background only";
                    setSelectedTypes([]);
                  }}
                >
                  <PrefixIcon icon={<IconArrowClockwiseCircularFill />} />
                  초기화
                </ActionButton>
              </view>
            </BottomSheetFooter>
          </BottomSheetContent>
        </BottomSheetRoot>
      </view>
    </page>
  );
}

root.render(<Root />);
