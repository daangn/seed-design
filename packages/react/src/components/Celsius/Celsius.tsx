import type * as React from "react";

export interface CelsiusProps {
  value: number;
}

export const Celsius: React.FC<CelsiusProps> = (props) => {
  return `${props.value}°C`;
};
