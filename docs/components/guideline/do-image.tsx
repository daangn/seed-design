import { IconCheckmarkCircleFill } from "@karrotmarket/react-monochrome-icon";
import { vars } from "@seed-design/css/vars";
import clsx from "clsx";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";

interface DoImageProps {
  src: string;
  alt: string;
  body: string;
  className?: string;
}

export function DoImage({ src, alt, body, className }: DoImageProps) {
  return (
    <figure className={clsx("flex flex-col", className)}>
      <ImageZoom
        src={src}
        alt={alt}
        width={773}
        height={396}
        className="w-full object-cover mt-2 mb-2 border border-bg-positive-solid rounded-r2"
        loading="lazy"
        draggable={false}
      />
      <div className="w-full flex gap-3 p-3 items-center bg-bg-positive-weak rounded-r2">
        <IconCheckmarkCircleFill
          className="shrink-0"
          color={vars.$color.fg.positiveContrast}
          size={16}
        />
        <span className="text-fg-positive-contrast text-sm font-bold shrink-0">Do</span>
        <span className="text-fg-positive-contrast text-sm">{body}</span>
      </div>
    </figure>
  );
}
