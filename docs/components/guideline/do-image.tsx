import { IconCheckmarkCircleFill } from "@karrotmarket/react-monochrome-icon";
import { Icon } from "@ride-developer/react";
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
    <figure className={clsx("flex flex-col gap-1.5 not-prose my-4", className)}>
      <ImageZoom
        src={src}
        alt={alt}
        width={773}
        height={396}
        className="w-full object-cover border border-bg-positive-solid rounded-r2 [&_img]:my-0 bg-palette-gray-100 dark:bg-palette-gray-900"
        loading="lazy"
        draggable={false}
      />
      <div className="w-full flex gap-2 p-3 bg-bg-positive-weak rounded-r2">
        <Icon
          svg={<IconCheckmarkCircleFill className="shrink-0" />}
          size="x5"
          color="fg.positiveContrast"
        />
        <div className="text-fg-positive-contrast text-sm flex flex-col break-keep">
          <div className="font-bold leading-5">Do</div>
          <div>{body}</div>
        </div>
      </div>
    </figure>
  );
}
