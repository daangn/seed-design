import * as React from "@lynx-js/react";
import { Field as SeedField, Slider as SeedSlider } from "@seed-design/lynx-react";

type SliderRootRef = React.ComponentRef<typeof SeedSlider.Root>;
type FieldRootRef = React.ComponentRef<typeof SeedField.Root>;

export interface SliderProps extends Omit<SeedSlider.RootProps, "children"> {
  label?: React.ReactNode;
  /**
   * @default "medium"
   */
  labelWeight?: SeedField.LabelProps["weight"];
  indicator?: React.ReactNode;
  description?: React.ReactNode;
  errorMessage?: React.ReactNode;
  showRequiredIndicator?: boolean;
  required?: SeedField.RootProps["required"];

  /**
   * @default []
   */
  markers?:
    | Array<
        | {
            value: number;
            label?: React.ReactNode;
            align?: SeedSlider.MarkerProps["align"];
          }
        | number
      >
    | undefined;
  /**
   * @default []
   */
  ticks?: number[];
  /**
   * @default "thin"
   */
  tickWeight?: SeedSlider.TickProps["weight"];

  /**
   * @default false
   */
  hideRange?: boolean;
  /**
   * @default false
   */
  hideValueIndicator?: boolean;

  fieldRef?: React.Ref<FieldRootRef>;
}

/**
 * @see https://seed-design.io/lynx/components/slider
 */
export const Slider = React.forwardRef<SliderRootRef, SliderProps>(
  (
    {
      label,
      labelWeight,
      indicator,
      description,
      errorMessage,
      showRequiredIndicator,
      required,
      min = 0,
      max = 100,
      markers = [],
      ticks = [],
      tickWeight,
      hideRange = false,
      hideValueIndicator = false,
      fieldRef,
      disabled,
      invalid,
      readOnly,
      values,
      defaultValues,
      getAccessibilityLabel,
      ...rootProps
    },
    ref,
  ) => {
    const renderHeader = label != null || indicator != null;
    const renderErrorMessage = invalid === true && errorMessage != null;
    const renderDescription = description != null && !renderErrorMessage;
    const renderFooter = renderDescription || renderErrorMessage;
    const thumbCount = Math.max(values?.length ?? defaultValues?.length ?? 1, 1);
    const defaultAccessibilityLabel = typeof label === "string" ? () => label : undefined;

    if (
      process.env.NODE_ENV !== "production" &&
      !getAccessibilityLabel &&
      !defaultAccessibilityLabel
    ) {
      console.warn(
        "Slider: Provide a string `label` or `getAccessibilityLabel` so every thumb has an accessible name.",
      );
    }

    return (
      <SeedField.Root
        ref={fieldRef}
        required={required}
        disabled={disabled}
        invalid={invalid}
        readOnly={readOnly}
      >
        {renderHeader ? (
          <SeedField.Header>
            <SeedField.Label weight={labelWeight}>
              {label}
              {showRequiredIndicator ? <SeedField.RequiredIndicator /> : null}
              {indicator != null ? (
                <SeedField.IndicatorText>{indicator}</SeedField.IndicatorText>
              ) : null}
            </SeedField.Label>
          </SeedField.Header>
        ) : null}
        <SeedSlider.Root
          ref={ref}
          min={min}
          max={max}
          values={values}
          defaultValues={defaultValues}
          disabled={disabled}
          invalid={invalid}
          readOnly={readOnly}
          getAccessibilityLabel={getAccessibilityLabel ?? defaultAccessibilityLabel}
          {...rootProps}
        >
          <SeedSlider.Control>
            <SeedSlider.Track>
              {!hideRange ? <SeedSlider.Range /> : null}
              {ticks.map((value) => (
                <SeedSlider.Tick key={value} value={value} weight={tickWeight} />
              ))}
            </SeedSlider.Track>
            {Array.from({ length: thumbCount }, (_, index) => (
              <React.Fragment key={index}>
                {!hideValueIndicator ? (
                  <SeedSlider.ValueIndicatorRoot index={index}>
                    <SeedSlider.ValueIndicatorArrow>
                      <SeedSlider.ValueIndicatorArrowTip />
                    </SeedSlider.ValueIndicatorArrow>
                    <SeedSlider.ValueIndicatorLabel index={index} />
                  </SeedSlider.ValueIndicatorRoot>
                ) : null}
                <SeedSlider.Thumb index={index} />
              </React.Fragment>
            ))}
          </SeedSlider.Control>
          {markers.length > 0 ? (
            <SeedSlider.Markers>
              {markers.map((marker) =>
                typeof marker === "number" ? (
                  <SeedSlider.Marker
                    key={marker}
                    value={marker}
                    align={marker === min ? "start" : marker === max ? "end" : "center"}
                  >
                    {marker}
                  </SeedSlider.Marker>
                ) : (
                  <SeedSlider.Marker
                    key={marker.value}
                    value={marker.value}
                    align={
                      marker.align ??
                      (marker.value === min ? "start" : marker.value === max ? "end" : "center")
                    }
                  >
                    {marker.label ?? marker.value}
                  </SeedSlider.Marker>
                ),
              )}
            </SeedSlider.Markers>
          ) : null}
        </SeedSlider.Root>
        {renderFooter ? (
          <SeedField.Footer>
            {renderDescription ? (
              <SeedField.Description>{description}</SeedField.Description>
            ) : null}
            {renderErrorMessage ? (
              <SeedField.ErrorMessage>{errorMessage}</SeedField.ErrorMessage>
            ) : null}
          </SeedField.Footer>
        ) : null}
      </SeedField.Root>
    );
  },
);
Slider.displayName = "Slider";
