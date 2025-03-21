// @ts-nocheck

import { theme } from '@src/stitches/stitches.config'

const Component = () => {
  return (
    (<div>
      <IconCloseRegular
        width={20}
        height={20}
        color={theme.colors["palette.gray1000"].computedValue}
        onClick={closeFilterHalfview}
      />
      <IconWrapper onClick={handleShareClick}>
      {bridge.environment === "Android" ? (
        <IconAndroidshareLine width={24} height={24} color={theme.colors["palette.gray1000"].computedValue} />
        ) : (
        <IconArrowUpBracketDownLine width={24} height={24} color={theme.colors["palette.gray1000"].computedValue} />
      )}
      </IconWrapper>
    </div>)
  );
};

const Radio: React.FCC<RadioProps> = ({ isSelected, isDisabled = false }) => {
  switch (true) {
    case isSelected && isDisabled:
      return (
        (<RadioIcon
          outerCircleFill={theme.colors["palette.gray300"].computedValue}
          middleCircleFill={theme.colors["bg.layerDefault"].computedValue}
          innerCircleFill={theme.colors["palette.gray300"].computedValue}
        />)
      );
    case isSelected && !isDisabled:
      return (
        (<RadioIcon
          outerCircleFill={theme.colors["fg.brand"].computedValue}
          middleCircleFill={theme.colors["fg.brand"].computedValue}
          innerCircleFill={theme.colors["palette.staticWhite"].computedValue}
        />)
      );
    case !isSelected && isDisabled:
      return (
        (<RadioIcon
          outerCircleFill={theme.colors["palette.gray400"].computedValue}
          middleCircleFill={theme.colors["palette.gray300"].computedValue}
          innerCircleFill={theme.colors["palette.gray300"].computedValue}
        />)
      );
    case !isSelected && !isDisabled:
      return (
        (<RadioIcon
          outerCircleFill={theme.colors["palette.gray600"].computedValue}
          middleCircleFill={theme.colors["bg.layerDefault"].computedValue}
          innerCircleFill={theme.colors["bg.layerDefault"].computedValue}
        />)
      );
    default:
      return null
  }
}
