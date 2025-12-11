import { IconXmarkCircleFill } from "@karrotmarket/react-monochrome-icon";
import { Icon } from "@seed-design/react";
import clsx from "clsx";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";

interface DontImageProps {
  src: string;
  alt: string;
  body: string;
  className?: string;
}

export function DontImage({ src, alt, body, className }: DontImageProps) {
  return (
    <figure className={clsx("flex flex-col gap-1.5 not-prose my-4", className)}>
      <ImageZoom
        src={src}
        alt={alt}
        width={773}
        height={396}
        className="w-full object-cover border border-bg-critical-solid rounded-r2"
        loading="lazy"
        draggable={false}
      />
      <div className="w-full flex gap-2 p-3 bg-bg-critical-weak rounded-r2">
        <Icon
          svg={<IconXmarkCircleFill className="shrink-0" />}
          size="x5"
          color="fg.criticalContrast"
        />
        <div className="text-fg-critical-contrast text-sm flex flex-col break-keep">
          <div className="font-bold leading-5">Don’t</div>
          <div>{body}</div>
        </div>
      </div>
    </figure>
  );
}
