import { useImage } from "@seed-design/lynx-react-image";
import { AspectRatio } from "@seed-design/lynx-react";

/**
 * useImage PoC
 *
 * 검증 포인트:
 * 1. Lynx `<image>`의 `bindload`/`binderror`가 실제로 발생해 loadingStatus가 바뀌는지
 * 2. `loadingStatus`로 fallback overlay를 조건부 렌더링(attribute selector 대체)할 수 있는지
 */
function ImageWithStatus({ src, label }: { src: string; label: string }) {
  const { loadingStatus, isLoaded, handleLoad, handleError } = useImage({ src });

  return (
    <view className="mb-x4">
      <text className="t6-regular text-fg-neutral-subtle mb-x1">
        {label} — {loadingStatus}
      </text>
      <AspectRatio ratio={16 / 9} width="full" position="relative">
        <image
          src={src}
          mode="aspectFill"
          bindload={handleLoad}
          binderror={handleError}
          className="w-full h-full rounded-r2"
        />
        {!isLoaded && (
          <view
            className="flex flex-col items-center justify-center bg-bg-neutral-subtle rounded-r2"
            style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
          >
            <text className="t4-bold text-fg-neutral">
              {loadingStatus === "error" ? "이미지 로드 실패" : "로딩 중…"}
            </text>
          </view>
        )}
      </AspectRatio>
    </view>
  );
}

export function UseImagePage() {
  return (
    <view className="flex flex-col pb-x10">
      <text className="t6-bold mb-x4 text-fg-neutral">useImage (lynx-react-image)</text>
      <ImageWithStatus
        src="https://picsum.photos/seed/use-image/1200/675"
        label="정상 이미지 (loaded → fallback 사라짐)"
      />
      <ImageWithStatus
        src="https://invalid.invalid/broken.png"
        label="깨진 이미지 (error → fallback 유지)"
      />
    </view>
  );
}
