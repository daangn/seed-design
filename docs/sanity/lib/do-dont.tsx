import { SanityImageAsset } from "@sanity/asset-utils";
import { SanityImage } from "./image";
import { ExternalImage } from "./external-image";
import clsx from "clsx";
import { IconCheckmarkCircleFill, IconXmarkCircleFill } from "@karrotmarket/react-monochrome-icon";

// TODO: typescript generate from sanity
interface ImageField {
  alt: string;
  imageType: "upload" | "external";
  uploadImage?: SanityImageAsset;
  externalUrl?: string;
}

interface Section {
  type: "do" | "dont";
  title: string;
  description: string;
  imageField: ImageField;
}

interface DoDontProps {
  value: {
    first: Section;
    second?: Section;
  };
  className?: string;
}

export function DoDont({ value, className }: DoDontProps) {
  const renderSection = (section: Section) => {
    const isDo = section.type === "do";

    return (
      <div className="flex flex-col gap-5 rounded-lg">
        <div className="w-full overflow-hidden rounded-lg">
          {section.imageField.imageType === "upload" ? (
            section.imageField?.uploadImage && (
              <SanityImage value={section.imageField.uploadImage} className="rounded-2xl m-0" />
            )
          ) : (
            <ExternalImage
              value={{ imageUrl: section.imageField?.externalUrl || "" }}
              className="rounded-2xl m-0"
            />
          )}
        </div>
        <div className="flex items-start gap-3 px-[6px] w-full">
          {isDo ? (
            <IconCheckmarkCircleFill className="text-seed-fg-positive shrink-0" size={30} />
          ) : (
            <IconXmarkCircleFill className="text-seed-fg-critical shrink-0" size={30} />
          )}
          <div className="flex flex-col gap-2 break-all">
            <span className="text-lg font-bold text-seed-fg-neutral mt-[2px]">{section.title}</span>
            <span className="text-md text-seed-fg-neutral-subtle">{section.description}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={clsx(
        "grid gap-6 my-8",
        value.second ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1",
        className,
      )}
    >
      {renderSection(value.first)}
      {value.second && renderSection(value.second)}
    </div>
  );
}
