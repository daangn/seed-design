"use client";

import { IconExclamationmarkCircleFill } from "@karrotmarket/react-monochrome-icon";
import {
  Slider as SeedSlider,
  Field as SeedField,
  VisuallyHidden,
  PrefixIcon,
} from "@seed-design/react";
import * as React from "react";

export interface SliderProps extends SeedSlider.RootProps {
  label?: React.ReactNode;
  indicator?: React.ReactNode;
  description?: React.ReactNode;
  errorMessage?: React.ReactNode;
  showRequiredIndicator?: boolean;

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
  (
    {
      label,
      indicator,
      description,
      errorMessage,
      showRequiredIndicator,

      ticks = [],
      markers = [],
      hideRange = false,

      ...props
    },
    ref,
  ) => {
    const values = props.values ?? props.defaultValues;

    const renderHeader = label || indicator;
    const renderDescription = !!description;
    const renderErrorMessage = errorMessage && props.invalid;
    const renderFooter = renderDescription || renderErrorMessage;

    if (
      process.env.NODE_ENV !== "production" &&
      !label &&
      !props["getAriaLabel"] &&
      !props["getAriaLabelledby"]
    ) {
      console.warn(
        "Slider: For better accessibility, provide a `label` prop or at least one of `getAriaLabel` or `getAriaLabelledby` props to tell the users which thumb is for what. This warning will not be shown in production builds.",
      );
    }

    return (
      <SeedField.Root
        name={props.name}
        disabled={props.disabled}
        invalid={props.invalid}
        readOnly={props.readOnly}
      >
        {renderHeader && (
          <SeedField.Header>
            <SeedField.Label>
              {label}
              {showRequiredIndicator && <SeedField.RequiredIndicator />}
              {indicator && <SeedField.IndicatorText>{indicator}</SeedField.IndicatorText>}
            </SeedField.Label>
            {/* You might want to put your custom element here */}
          </SeedField.Header>
        )}
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
              {markers.map((marker) => (
                <SeedSlider.Marker key={marker.value} value={marker.value}>
                  {marker.label}
                </SeedSlider.Marker>
              ))}
            </SeedSlider.Markers>
          )}
        </SeedSlider.Root>
        {renderFooter && (
          <SeedField.Footer>
            {renderDescription &&
              (renderErrorMessage ? (
                <VisuallyHidden asChild>
                  <SeedField.Description>{description}</SeedField.Description>
                </VisuallyHidden>
              ) : (
                <SeedField.Description>{description}</SeedField.Description>
              ))}
            {renderErrorMessage && (
              <SeedField.ErrorMessage>
                <PrefixIcon svg={<IconExclamationmarkCircleFill />} />
                {errorMessage}
              </SeedField.ErrorMessage>
            )}
          </SeedField.Footer>
        )}
      </SeedField.Root>
    );
  },
);
Slider.displayName = "Slider";
