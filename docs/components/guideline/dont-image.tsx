import { IconXmarkCircleFill } from "@karrotmarket/react-monochrome-icon";
import { vars } from "@seed-design/css/vars";
import clsx from "clsx";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";

interface DontImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function DontImage({ src, alt, className }: DontImageProps) {
  return (
    <figure className={clsx("flex flex-col", className)}>
      <ImageZoom
        src={src}
        alt={alt}
        width={773}
        height={396}
        className="w-full object-cover mt-2 mb-2 border border-bg-critical-solid rounded-r2"
        loading="lazy"
        draggable={false}
      />
      <div className="w-full flex gap-3 p-3 items-center bg-bg-critical-weak rounded-r2">
        <IconXmarkCircleFill
          className="shrink-0"
          color={vars.$color.fg.criticalContrast}
          size={16}
        />
        <span className="text-fg-critical-contrast text-sm font-bold shrink-0">Don&apos;t</span>
        <span className="text-fg-critical-contrast text-sm">{alt}</span>
      </div>
    </figure>
  );
}
