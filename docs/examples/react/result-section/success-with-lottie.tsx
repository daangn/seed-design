import dynamic from "next/dynamic";
import { VStack, Box } from "@seed-design/react";
import { ResultSection } from "seed-design/ui/result-section";
import { useTheme } from "@/hooks/useTheme";

const Player = dynamic(() => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player), {
  ssr: false,
});

const LOTTIE_URLS = {
  light:
    "https://asset-town.krrt.io/production/motion/bd9f3c71-5b81-40b0-8eea-eeebd668edae/c17fa891bb007b9e4e6b281e483b5491cb905703.json",
  dark: "https://asset-town.krrt.io/production/motion/19bf4654-5286-4def-a651-c674a20ce1ee/89c9e404edc356cf143dab80b627fde01ed8a8fb.json",
};

export default function ResultSectionSuccessWithLottie() {
  const { userColorScheme } = useTheme();
  const lottieUrl = LOTTIE_URLS[userColorScheme];

  return (
    <VStack minHeight="480px" width="320px" borderWidth={1} borderColor="stroke.neutralMuted">
      <ResultSection
        asset={
          <Box pb="x4">
            <Player
              src={lottieUrl}
              autoplay
              loop={false}
              keepLastFrame
              style={{ width: 70, height: 70 }}
            />
          </Box>
        }
        title="성공했어요"
        description="요청이 성공적으로 완료되었습니다"
        primaryActionProps={{
          children: "확인",
          onClick: () => window.alert("확인 클릭"),
        }}
      />
    </VStack>
  );
}
