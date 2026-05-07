import Image from "next/image";

interface BrandLogoProps {
  width?: number;
  className?: string;
  priority?: boolean;
}

const ASPECT_RATIO = 534 / 180;

export function BrandLogo({ width = 500, className, priority = false }: BrandLogoProps) {
  const height = Math.round(width / ASPECT_RATIO);
  return (
    <Image
      src="/brand/seed-logo.svg"
      alt="SEED Design"
      width={width}
      height={height}
      priority={priority}
      className={className}
    />
  );
}
