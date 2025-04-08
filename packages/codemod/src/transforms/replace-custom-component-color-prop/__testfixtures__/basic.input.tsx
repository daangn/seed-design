// @ts-nocheck
import { getSeedColor } from './utils';

const Component = () => {
  return (
    <>
      <Text color="gray100" variant="subtitle2Regular" className="text-ellipsis-2" />
      <Text color="gray700" variant="subtitle2Regular" className="text-ellipsis-2" />
      <Text color="carrot100" variant="subtitle2Regular" className="text-ellipsis-2" />
      <Text color="carrot500" variant="subtitle2Regular" className="text-ellipsis-2" />
      <Text color="carrot700" variant="subtitle2Regular" className="text-ellipsis-2" />
      <Text color="carrot900" variant="subtitle2Regular" className="text-ellipsis-2" />
      <Text color="staticBlack" variant="subtitle2Regular" className="text-ellipsis-2" />
      <Text color="staticWhite" variant="subtitle2Regular" className="text-ellipsis-2" />
      <Text color="onPrimary" variant="subtitle2Regular" className="text-ellipsis-2" />
      <Text color={isSelected ? "onPrimary" : "primary"} />
      <Text color={isSelected ? 'primary' : 'gray900'}  />
      <Text color={isSelected ? 'carrot600' : 'blue600'}  />
      <Text color={"gray600"} />
      {/* Box 컴포넌트 테스트 */}
      <Box bg="paperDefault">
        기본 박스 컴포넌트
      </Box>
      <Box bc="gray600" bg="gray100">
        테두리가 있는 박스
      </Box>
      <Stack bc={'gray600'} br={8} gap={12} px={16} py={12}>
        <div>스택 컴포넌트</div>
      </Stack>
      <HStack bg="carrot500" px={16} py={12}>
        <div>가로 스택</div>
      </HStack>
      <VStack bc={'gray600'} br={8} gap={12} px={16} py={12}>
        <div>세로 스택</div>
      </VStack>
      <CustomComponent 
        color="primary"
        defaultColor="gray600"
        activeColor="carrot500"
      />
      <AnotherComponent color={isActive ? "carrot600" : "gray700"} />
      <div style={{ 
        color: getSeedColor("primary"),
        backgroundColor: getSeedColor("paperDefault"),
        borderColor: getSeedColor("gray600")
      }}>
        getSeedColor 함수 사용 예제
      </div>
    </>
  );
};

export default Component;
