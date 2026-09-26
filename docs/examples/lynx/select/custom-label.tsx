import "./styles";

import IconCarLine from "@karrotmarket/lynx-monochrome-icon/IconCarLine";
import IconFigureBikeLine from "@karrotmarket/lynx-monochrome-icon/IconFigureBikeLine";
import IconMetroFrontsideLine from "@karrotmarket/lynx-monochrome-icon/IconMetroFrontsideLine";
import { Badge, Box, HStack, VStack, useSeedClassName } from "@seed-design/lynx-react";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "@/components/ui/select";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <view className={`${seedClassName} docs-lynx-select-root`}>
      <VStack className="select-preview">
        <Box width="280px">
          <SelectRoot defaultValue={["metro"]}>
            <SelectTrigger accessibility-label="이동 수단" placeholder="이동 수단 선택" />
            <SelectContent>
              <SelectGroup>
                <SelectItem value="bike" label="자전거" prefixIcon={<IconFigureBikeLine />} />
                <SelectItem
                  value="metro"
                  textValue="지하철"
                  prefixIcon={<IconMetroFrontsideLine />}
                  label={
                    <HStack align="center" gap="x1_5">
                      <text>지하철</text>
                      <Badge variant="weak" tone="informative">
                        가장 빠름
                      </Badge>
                    </HStack>
                  }
                />
                <SelectItem
                  value="car"
                  textValue="자동차"
                  disabled
                  prefixIcon={<IconCarLine />}
                  label={
                    <HStack align="center" gap="x1_5">
                      <text>자동차</text>
                      <Badge variant="weak" tone="warning">
                        고객지원에 문의
                      </Badge>
                    </HStack>
                  }
                />
              </SelectGroup>
            </SelectContent>
          </SelectRoot>
        </Box>
      </VStack>
    </view>
  );
}
