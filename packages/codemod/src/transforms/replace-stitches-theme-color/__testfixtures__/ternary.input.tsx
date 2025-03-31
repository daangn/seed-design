// @ts-nocheck

import { theme } from '@src/stitches/stitches.config'

const Component = () => {
  const isActive = true;
  const isDisabled = false;
  
  return (
    <div>
      <Button 
        backgroundColor={isActive ? theme.colors['primary-semantic'].computedValue : theme.colors.gray200.computedValue}
        color={isActive ? theme.colors['onPrimary-semantic'].computedValue : theme.colors.gray900.computedValue}
        border={isDisabled ? `1px solid ${theme.colors.gray300.computedValue}` : 'none'}
      >
        버튼
      </Button>
      <Badge 
        style={{
          backgroundColor: isActive 
            ? isDisabled 
              ? theme.colors.gray100.computedValue 
              : theme.colors['success-semantic'].computedValue
            : theme.colors['warning-semantic'].computedValue,
          color: isDisabled 
            ? theme.colors.gray500.computedValue 
            : theme.colors['white-static'].computedValue
        }}
      >
        상태 표시
      </Badge>
      <StatusIcon fill={isActive ? isDisabled ? theme.colors.gray400.computedValue : theme.colors['accent-semantic'].computedValue : theme.colors['danger-semantic'].computedValue} />
    </div>
  );
};

export { Component }; 