// @ts-nocheck

import { theme } from '@src/stitches/stitches.config'

const Component = () => {
  return (
    <div>
      <IconCloseRegular
        width={20}
        height={20}
        color={theme.colors["palette-gray-1000"].computedValue}
        onClick={closeFilterHalfview}
      />
      <IconWrapper onClick={handleShareClick}>
      {bridge.environment === "Android" ? (
        <IconAndroidshareLine width={24} height={24} color={theme.colors["palette-gray-1000"].computedValue} />
        ) : (
        <IconArrowUpBracketDownLine width={24} height={24} color={theme.colors["palette-gray-1000"].computedValue} />
      )}
      </IconWrapper>
    </div>
  );
};

const Radio: React.FCC<RadioProps> = ({ isSelected, isDisabled = false }) => {
  switch (true) {
    case isSelected && isDisabled:
      return (
        <RadioIcon
          outerCircleFill={theme.colors["palette-gray-300"].computedValue}
          middleCircleFill={theme.colors["bg-layer-default"].computedValue}
          innerCircleFill={theme.colors["palette-gray-300"].computedValue}
        />
      );
    case isSelected && !isDisabled:
      return (
        <RadioIcon
          outerCircleFill={theme.colors["bg-brand-solid"].computedValue}
          middleCircleFill={theme.colors["bg-brand-solid"].computedValue}
          innerCircleFill={theme.colors["palette-static-white"].computedValue}
        />
      );
    case !isSelected && isDisabled:
      return (
        <RadioIcon
          outerCircleFill={theme.colors["palette-gray-400"].computedValue}
          middleCircleFill={theme.colors["palette-gray-300"].computedValue}
          innerCircleFill={theme.colors["palette-gray-300"].computedValue}
        />
      );
    case !isSelected && !isDisabled:
      return (
        <RadioIcon
          outerCircleFill={theme.colors["palette-gray-600"].computedValue}
          middleCircleFill={theme.colors["bg-layer-default"].computedValue}
          innerCircleFill={theme.colors["bg-layer-default"].computedValue}
        />
      );
    default:
      return null
  }
}
