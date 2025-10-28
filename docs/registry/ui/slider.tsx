"use client";

import { Slider as SeedSlider } from "@seed-design/react";
import * as React from "react";

export interface SliderProps extends SeedSlider.RootProps {
  /**
   * @default []
   */
  ticks?: number[];
  /**
   * @default []
   */
  markers?: { value: number; label: React.ReactNode }[];
  /**
   * @default false
   */
  hideRange?: boolean;
}

export const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ hideRange = false, ticks = [], markers = [], ...props }, ref) => {
    const values = props.values ?? props.defaultValues;

    return (
      <SeedSlider.Root ref={ref} {...props}>
        <SeedSlider.Control>
          <SeedSlider.Track>
            {!hideRange && <SeedSlider.Range />}
            {ticks.map((value) => (
              <SeedSlider.Tick key={value} value={value} />
            ))}
          </SeedSlider.Track>
          {values?.map((_, index) => (
            <React.Fragment key={index}>
              <SeedSlider.Thumb thumbIndex={index} />
              <SeedSlider.HiddenInput thumbIndex={index} />
            </React.Fragment>
          ))}
        </SeedSlider.Control>
        {markers.length > 0 && (
          <SeedSlider.Markers>
            {markers.map((marker, index) => (
              <SeedSlider.Marker
                key={marker.value}
                value={marker.value}
                align={index === 0 ? "start" : index === markers.length - 1 ? "end" : "center"}
              >
                {marker.label}
              </SeedSlider.Marker>
            ))}
          </SeedSlider.Markers>
        )}
      </SeedSlider.Root>
    );
  },
);
