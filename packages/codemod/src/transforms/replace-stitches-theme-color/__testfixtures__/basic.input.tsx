// @ts-nocheck

import { theme } from '@src/stitches/stitches.config'

const Component = () => {
  return (
    <div>
      <IconCloseRegular
        width={20}
        height={20}
        color={theme.colors.gray900.computedValue}
        onClick={closeFilterHalfview}
      />
      <IconWrapper onClick={handleShareClick}>
      {bridge.environment === "Android" ? (
        <IconAndroidshareLine width={24} height={24} color={theme.colors.gray900.computedValue} />
        ) : (
        <IconArrowUpBracketDownLine width={24} height={24} color={theme.colors.gray900.computedValue} />
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
          outerCircleFill={theme.colors.gray200.computedValue}
          middleCircleFill={theme.colors['paperDefault-semantic'].computedValue}
          innerCircleFill={theme.colors.gray200.computedValue}
        />
      )
    case isSelected && !isDisabled:
      return (
        <RadioIcon
          outerCircleFill={theme.colors['primary-semantic'].computedValue}
          middleCircleFill={theme.colors['primary-semantic'].computedValue}
          innerCircleFill={theme.colors['onPrimary-semantic'].computedValue}
        />
      )
    case !isSelected && isDisabled:
      return (
        <RadioIcon
          outerCircleFill={theme.colors.gray300.computedValue}
          middleCircleFill={theme.colors.gray200.computedValue}
          innerCircleFill={theme.colors.gray200.computedValue}
        />
      )
    case !isSelected && !isDisabled:
      return (
        <RadioIcon
          outerCircleFill={theme.colors.gray500.computedValue}
          middleCircleFill={theme.colors['paperDefault-semantic'].computedValue}
          innerCircleFill={theme.colors['paperDefault-semantic'].computedValue}
        />
      )
    default:
      return null
  }
}
