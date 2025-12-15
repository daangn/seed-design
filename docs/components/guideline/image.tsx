import clsx from "clsx";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function Image({ src, alt, className }: ImageProps) {
  return (
    <figure className={clsx("flex flex-col gap-1.5 not-prose mt-1 mb-4", className)}>
      <ImageZoom
        src={src}
        alt={alt}
        width={773}
        height={396}
        className="w-full object-cover rounded-r2"
        loading="lazy"
        draggable={false}
      />
      <figcaption className="text-sm text-center text-fg-neutral-subtle">{alt}</figcaption>
    </figure>
  );
}
