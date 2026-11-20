import { useEffect, useMemo, useState, type RefObject } from "@lynx-js/react";
import * as Slider from "@seed-design/lynx-react/Slider";
import { useAppBar } from "@seed-design/lynx-react-app-bar";
import { Field } from "@seed-design/lynx-react-field";
import {
  SegmentedControl,
  useSegmentedControlContext,
} from "@seed-design/lynx-react-segmented-control";
import { useTextField } from "@seed-design/lynx-react-text-field";

export type UpdateProbe = RefObject<(() => void) | null>;

export function AppBarProbe({ update }: { update: UpdateProbe }) {
  const { centeredTitlePaddingX, setLeftWidth, setRightWidth } = useAppBar();
  useEffect(() => {
    "background only";
    setLeftWidth(80);
    let rightWidth = 30;
    setRightWidth(rightWidth);
    update.current = () => {
      rightWidth = rightWidth === 30 ? 40 : 30;
      setRightWidth(rightWidth);
    };
    return () => {
      update.current = null;
    };
  }, [setLeftWidth, setRightWidth, update]);
  return <text id="probe-output">{centeredTitlePaddingX}</text>;
}

export function FieldProbe({ update }: { update: UpdateProbe }) {
  return (
    <Field.Root>
      <FieldInputProbe update={update} />
    </Field.Root>
  );
}

function FieldInputProbe({ update }: { update: UpdateProbe }) {
  const { setFocused, focused } = useTextField({});
  useEffect(() => {
    "background only";
    let next = false;
    update.current = () => {
      next = !next;
      setFocused(next);
    };
    return () => {
      update.current = null;
    };
  }, [setFocused, update]);
  return <text id="probe-output">{focused ? "focused" : "blurred"}</text>;
}

const segmentValues = Array.from({ length: 20 }, (_, index) => String(index));

export function SegmentedControlProbe({ update }: { update: UpdateProbe }) {
  return (
    <SegmentedControl.Root defaultValue="0">
      {segmentValues.map((value) => (
        <SegmentedControl.Item key={value} value={value}>
          <text>{value}</text>
        </SegmentedControl.Item>
      ))}
      <SegmentGeometryProbe update={update} />
    </SegmentedControl.Root>
  );
}

function SegmentGeometryProbe({ update }: { update: UpdateProbe }) {
  const { segmentCount, registerItem } = useSegmentedControlContext();
  useEffect(() => {
    "background only";
    let remove: (() => void) | undefined;
    update.current = () => {
      if (remove) {
        remove();
        remove = undefined;
      } else remove = registerItem("probe");
    };
    return () => {
      update.current = null;
    };
  }, [registerItem, update]);
  return <text id="probe-output">{String(segmentCount)}</text>;
}

export function SliderProbe({ update }: { update: UpdateProbe }) {
  const [values, setValues] = useState([10]);
  const parts = useMemo(
    () => (
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
          {Array.from({ length: 20 }, (_, index) => (
            <Slider.Tick key={index} value={index * 5} />
          ))}
          <Slider.Thumb thumbIndex={0} />
        </Slider.Track>
      </Slider.Control>
    ),
    [],
  );
  useEffect(() => {
    "background only";
    update.current = () => setValues(([current]) => [current === 10 ? 20 : 10]);
    return () => {
      update.current = null;
    };
  }, [update]);
  return (
    <>
      <Slider.Root values={values}>{parts}</Slider.Root>
      <text id="probe-output">{`slider-${values[0]}`}</text>
    </>
  );
}
