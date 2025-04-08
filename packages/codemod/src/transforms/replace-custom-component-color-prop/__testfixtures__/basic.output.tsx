// @ts-nocheck
import { getSeedColor } from './utils';

const Component = () => {
  return (<>
    <Text color="palette.gray200" variant="subtitle2Regular" className="text-ellipsis-2" />
    <Text color="palette.gray800" variant="subtitle2Regular" className="text-ellipsis-2" />
    <Text color="palette.carrot200" variant="subtitle2Regular" className="text-ellipsis-2" />
    <Text color="palette.carrot600" variant="subtitle2Regular" className="text-ellipsis-2" />
    <Text color="palette.carrot700" variant="subtitle2Regular" className="text-ellipsis-2" />
    <Text color="palette.carrot800" variant="subtitle2Regular" className="text-ellipsis-2" />
    <Text color="palette.staticBlack" variant="subtitle2Regular" className="text-ellipsis-2" />
    <Text color="palette.staticWhite" variant="subtitle2Regular" className="text-ellipsis-2" />
    <Text color="palette.staticWhite" variant="subtitle2Regular" className="text-ellipsis-2" />
    <Text color={isSelected ? "palette.staticWhite" : "fg.brand"} />
    <Text color={isSelected ? "fg.brand" : "palette.gray1000"}  />
    <Text color={isSelected ? "palette.carrot600" : "palette.blue600"}  />
    <Text color={"palette.gray700"} />
    {/* Box 컴포넌트 테스트 */}
    <Box bg="bg.layerDefault">
      기본 박스 컴포넌트
    </Box>
    <Box bc="palette.gray700" bg="palette.gray200">
      테두리가 있는 박스
    </Box>
    <Stack bc={"palette.gray700"} br={8} gap={12} px={16} py={12}>
      <div>스택 컴포넌트</div>
    </Stack>
    <HStack bg="palette.carrot600" px={16} py={12}>
      <div>가로 스택</div>
    </HStack>
    <VStack bc={"palette.gray700"} br={8} gap={12} px={16} py={12}>
      <div>세로 스택</div>
    </VStack>
    <CustomComponent 
      color="fg.brand"
      defaultColor="palette.gray700"
      activeColor="palette.carrot600"
    />
    <AnotherComponent color={isActive ? "palette.carrot600" : "palette.gray800"} />
    <div style={{ 
      color: getSeedColor("fg.brand"),
      backgroundColor: getSeedColor("bg.layerDefault"),
      borderColor: getSeedColor("palette.gray700")
    }}>
      getSeedColor 함수 사용 예제
    </div>
  </>);
};

export default Component;
