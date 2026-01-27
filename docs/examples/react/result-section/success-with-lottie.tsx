"use client";

import { useEffect, useState } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import { VStack, Box } from "@seed-design/react";
import { ResultSection } from "seed-design/ui/result-section";

type UserColorScheme = "light" | "dark";

function useTheme() {
  const [userColorScheme, setUserColorScheme] = useState<UserColorScheme>(() => {
    if (typeof window === "undefined") return "light";

    const colorMode = document.documentElement.getAttribute("data-seed-color-mode");
    const scheme = document.documentElement.getAttribute("data-seed-user-color-scheme");

    if (colorMode === "dark-only") return "dark";
    if (colorMode === "light-only") return "light";
    return scheme === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const colorMode = document.documentElement.getAttribute("data-seed-color-mode");
      const scheme = document.documentElement.getAttribute("data-seed-user-color-scheme");

      if (colorMode === "dark-only") {
        setUserColorScheme("dark");
      } else if (colorMode === "light-only") {
        setUserColorScheme("light");
      } else {
        setUserColorScheme(scheme === "dark" ? "dark" : "light");
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-seed-color-mode", "data-seed-user-color-scheme"],
    });

    return () => observer.disconnect();
  }, []);

  return userColorScheme;
}

const LOTTIE_URLS = {
  light:
    "https://asset-town.krrt.io/production/motion/bd9f3c71-5b81-40b0-8eea-eeebd668edae/c17fa891bb007b9e4e6b281e483b5491cb905703.json",
  dark: "https://asset-town.krrt.io/production/motion/19bf4654-5286-4def-a651-c674a20ce1ee/89c9e404edc356cf143dab80b627fde01ed8a8fb.json",
};

export default function ResultSectionSuccessWithLottie() {
  const colorScheme = useTheme();
  const lottieUrl = LOTTIE_URLS[colorScheme];

  return (
    <VStack minHeight="480px" width="320px" borderWidth={1} borderColor="stroke.neutralMuted">
      <ResultSection
        asset={
          <Box pb="x4">
            <Player src={lottieUrl} autoplay loop style={{ width: 70, height: 70 }} />
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
