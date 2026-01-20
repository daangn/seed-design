import { clsx } from "clsx";

interface ExternalImageProps {
  value: {
    imageUrl: string;
    alt?: string;
  };
  className?: string;
}

export const ExternalImage = ({ value, className }: ExternalImageProps) => {
  const { imageUrl, alt } = value;

  return (
    <div className={clsx("relative my-4", className)}>
      <img
        src={imageUrl}
        alt={alt || "외부 이미지"}
        className={clsx("w-full h-full object-cover rounded-2xl overflow-hidden", className)}
        loading="lazy"
      />
    </div>
  );
};
