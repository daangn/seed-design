import * as changeCase from "change-case";
import { cva } from "class-variance-authority";
import * as React from "react";
import { useIcon } from "./icon-context";
import { Tag } from "./tags";

// 타입 정의
type IconComponentType = React.ForwardRefExoticComponent<
  Omit<React.SVGProps<SVGSVGElement> & { size?: number | string }, "ref"> &
    React.RefAttributes<SVGSVGElement>
>;

// 아이콘 컴포넌트
const IconItem = ({
  iconName,
  IconComponent,
  isSelected,
  isCritical,
  metadataString,
  onSelect,
}: {
  iconName: string;
  IconComponent: IconComponentType;
  isSelected: boolean;
  isCritical: boolean;
  metadataString: string;
  onSelect: (name: string) => void;
}) => {
  const iconComponentVariants = cva(
    "relative aspect-square rounded-md flex items-center justify-center cursor-pointer transition-colors",
    {
      variants: {
        selected: {
          true: "bg-bg-brand-weak hover:bg-bg-brand-weak-pressed border-stroke-brand",
          false: "bg-bg-layer-default hover:bg-bg-layer-default-pressed",
        },
        critical: {
          true: "border-seed-stroke-critical border-[1px] bg-seed-bg-critical-weak",
          false: "border-[1px]",
        },
      },
    },
  );

  return (
    <button
      type="button"
      onClick={() => onSelect(iconName)}
      className={iconComponentVariants({
        critical: isCritical,
        selected: isSelected,
      })}
      data-metadatas={metadataString}
      aria-label={iconName}
      aria-pressed={isSelected}
    >
      <IconComponent />
    </button>
  );
};

// 메인 컴포넌트
export const IconGrid = () => {
  const {
    iconComponents,
    iconData,
    search,
    setSelectedIconName,
    setIconStyle,
    selectedIcon,
    iconStyle,
  } = useIcon();

  const handleIconSelect = (iconName: string, iconStyle: "monochrome" | "multicolor") => {
    const isSameIcon = selectedIcon?.name === iconName;
    if (isSameIcon) {
      setSelectedIconName("");
      return;
    }

    setIconStyle(iconStyle);
    setSelectedIconName(iconName);
  };

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(56px,1fr))] gap-4">
      {Object.keys(iconComponents[iconStyle]).map((iconName) => {
        const snakeCaseIconName = changeCase.snakeCase(iconName);
        const metadataString = iconData[iconStyle][snakeCaseIconName]?.metadatas.join(", ");
        const criticalTags = [Tag.figmaNotPublished, Tag.fat, Tag.service];
        const isCritical =
          iconStyle === "multicolor" ||
          iconData[iconStyle][snakeCaseIconName]?.metadatas.some((metadata) =>
            criticalTags.includes(metadata),
          );

        const shouldRenderIcon =
          search === "" || metadataString?.includes(search) || snakeCaseIconName.includes(search);
        if (!shouldRenderIcon) {
          return null;
        }

        return (
          <IconItem
            key={iconName}
            iconName={snakeCaseIconName}
            IconComponent={iconComponents[iconStyle][iconName] as IconComponentType}
            isSelected={selectedIcon?.name === snakeCaseIconName}
            isCritical={isCritical}
            metadataString={metadataString}
            onSelect={(iconName) => handleIconSelect(iconName, iconStyle)}
          />
        );
      })}
    </div>
  );
};
