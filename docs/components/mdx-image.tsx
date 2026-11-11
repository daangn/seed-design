import clsx from "clsx";
import { ImageZoom, type ImageZoomProps } from "fumadocs-ui/components/image-zoom";
import { archivePaths } from "@/lib/docs-archive";

/** Markdown 이미지(`![]()`)를 확대 가능한 이미지로 렌더링한다. */
export function MdxImage({ className, ...rest }: ImageZoomProps) {
  return (
    <ImageZoom
      className={clsx(
        className,
        // 로딩 플레이스홀더 배경. SEED 팔레트는 다크에서 스케일이 뒤집혀 palette-gray-900가
        // #e9eaec(거의 흰색)로 해석되므로, 다크에도 palette-gray-100(#16171b, 페이지 배경 #171717과
        // 거의 동일)을 써서 라운드 코너 안티앨리어싱 가장자리로 새어나온 픽셀이 다크 배경과 구분되지
        // 않게 한다(라이트는 #f7f8f9 그대로 — 흰 페이지 대비 아주 옅어 fringe가 사실상 없다). 이
        // 교정으로 다크모드 라운드 이미지의 흰 fringe가 docs 전역에서 사라진다.
        // radius는 모바일 10px(r2_5) / 데스크톱 12px(r3) — 랜딩의 카드·썸네일(section-blog,
        // section-showcase 등)과 같은 브레이크포인트·값을 써서 사이트 전체 이미지 결을 통일한다.
        "bg-palette-gray-100 dark:bg-palette-gray-100 rounded-r2_5 lg:rounded-r3 overflow-hidden",
      )}
      {...rest}
      src={typeof rest.src === "string" ? archivePaths.asset(rest.src) : rest.src}
    />
  );
}

/** MDX에서 직접 쓰는 `<ImageZoom>`. public 경로를 archive 채널 경로로 옮긴다. */
export function MdxImageZoom({ src, ...props }: ImageZoomProps) {
  return <ImageZoom {...props} src={typeof src === "string" ? archivePaths.asset(src) : src} />;
}
