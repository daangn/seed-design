import "./styles";

import IconCarLine from "@karrotmarket/lynx-monochrome-icon/IconCarLine";
import IconFigureBikeLine from "@karrotmarket/lynx-monochrome-icon/IconFigureBikeLine";
import IconMetroFrontsideLine from "@karrotmarket/lynx-monochrome-icon/IconMetroFrontsideLine";
import { root } from "@lynx-js/react";
import { Box, VStack, useSeedClassName } from "@seed-design/lynx-react";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "@/components/ui/select";

const TRANSPORT_OPTIONS = [
  {
    value: "bike",
    textValue: "자전거",
    prefixIcon: <IconFigureBikeLine />,
  },
  {
    value: "metro",
    textValue: "지하철",
    label: <text>지하철 · 가장 빠름</text>,
    prefixIcon: <IconMetroFrontsideLine />,
  },
  {
    value: "car",
    textValue: "자동차",
    label: <text>자동차 · 고객지원에 문의</text>,
    prefixIcon: <IconCarLine />,
    disabled: true,
  },
] as const;

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <VStack className="select-example" gap="x3">
        <Box className="select-example__stack">
          <SelectRoot options={TRANSPORT_OPTIONS} defaultValue={["metro"]}>
            <SelectTrigger accessibility-label="이동 수단" placeholder="이동 수단 선택" />
            <SelectContent>
              <SelectGroup>
                {TRANSPORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} />
                ))}
              </SelectGroup>
            </SelectContent>
          </SelectRoot>
        </Box>
        <text className="select-example__status">
          항목 라벨은 상세 정보를 보이고, 선택값은 textValue인 지하철로 표시합니다.
        </text>
      </VStack>
    </page>
  );
}

root.render(<Root />);
