import IconExclamationmarkCircleFill from "@karrotmarket/lynx-monochrome-icon/IconExclamationmarkCircleFill";
import { useEffect, useState } from "@lynx-js/react";
import { ActionButton, Box, Icon, VStack } from "@seed-design/lynx-react";
import { AppBar, AppBarMain } from "@/components/ui/app-bar";
import { ProgressCircle } from "@/components/ui/progress-circle";
import { ResultSection } from "@/components/ui/result-section";

export default function Example() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);

    return () => clearTimeout(timer);
  }, []);

  function handleRetry() {
    "background only";
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  }

  return (
    <VStack width="full" maxWidth="360px" alignSelf="center" grow minHeight="0">
      <AppBar>
        <AppBarMain title="환불 요청" />
      </AppBar>
      <VStack grow gap="x4" pb="safeArea">
        <ResultSection
          title={loading ? "환불을 요청하고 있어요" : "다시 시도해주세요"}
          description={loading ? "잠시만 기다려주세요" : "환불 요청에 실패했어요"}
          asset={
            <Box pb="x4">
              {loading ? (
                <ProgressCircle />
              ) : (
                <Icon icon={<IconExclamationmarkCircleFill />} size="x10" color="fg.critical" />
              )}
            </Box>
          }
        />
        <Box px="spacingX.globalGutter" pt="x3" pb="x2">
          <ActionButton
            flexGrow
            size="large"
            variant="neutralSolid"
            disabled={loading}
            loading={loading}
            bindtap={handleRetry}
          >
            다시 시도
          </ActionButton>
        </Box>
      </VStack>
    </VStack>
  );
}
