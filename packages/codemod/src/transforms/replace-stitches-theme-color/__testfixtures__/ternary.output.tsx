// @ts-nocheck

import { theme } from '@src/stitches/stitches.config'

const Component = () => {
  const isActive = true;
  const isDisabled = false;
  
  return (
    <div>
      <Button 
        backgroundColor={isActive ? theme.colors["bg-brand-solid"].computedValue : theme.colors["palette-gray-300"].computedValue}
        color={isActive ? theme.colors["palette-static-white"].computedValue : theme.colors["palette-gray-1000"].computedValue}
        border={isDisabled ? `1px solid ${theme.colors["palette-gray-400"].computedValue}` : 'none'}
      >
        버튼
      </Button>
      <Badge 
        style={{
          backgroundColor: isActive 
            ? isDisabled 
              ? theme.colors["palette-gray-200"].computedValue 
              : theme.colors["bg-positive-solid"].computedValue
            : theme.colors["bg-warning-solid"].computedValue,
          color: isDisabled 
            ? theme.colors["palette-gray-600"].computedValue 
            : theme.colors["palette-static-white"].computedValue
        }}
      >
        상태 표시
      </Badge>
      <StatusIcon fill={isActive ? isDisabled ? theme.colors["palette-gray-500"].computedValue : theme.colors["bg-informative-solid"].computedValue : theme.colors["bg-critical-solid"].computedValue} />
    </div>
  );
};

export { Component }; 