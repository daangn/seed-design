import { useRef, useState, useCallback } from "react";
import { Box, Divider, ScrollFog, VStack } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerRoot,
  DrawerTrigger,
} from "seed-design/ui/drawer";

const DrawerWithScroll = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      setIsScrolled(scrollRef.current.scrollTop > 0);
    }
  }, []);

  return (
    <DrawerRoot>
      <DrawerTrigger asChild>
        <ActionButton variant="neutralSolid">스크롤 예시</ActionButton>
      </DrawerTrigger>
      <DrawerContent title="스크롤 예시" description="본문만 스크롤되며, 헤더와 푸터는 고정됩니다.">
        {isScrolled && <Divider />}
        <DrawerBody>
          <VStack ref={scrollRef} overflowY="auto" height="full" onScroll={handleScroll}>
            <ScrollFog placement={["bottom"]}>
              <VStack gap="x4" py="x4" px="x6">
                {Array.from({ length: 20 }, (_, i) => (
                  <Box key={i} width="full" height="80px" bg="bg.layerBasement" borderRadius="r2" />
                ))}
              </VStack>
            </ScrollFog>
          </VStack>
        </DrawerBody>
        <DrawerFooter>
          <ActionButton variant="neutralSolid">확인</ActionButton>
          <ActionButton variant="neutralWeak">취소</ActionButton>
        </DrawerFooter>
      </DrawerContent>
    </DrawerRoot>
  );
};

export default DrawerWithScroll;
