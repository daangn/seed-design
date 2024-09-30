import { ActionButton } from "@/seed-design/ui/action-button";
import { useUrlParamSync } from "@/src/hooks/useUrlParamSync";
import {
  useProgressCircleActions,
  useProgressCircleDuration,
  useProgressCircleEasing,
} from "@/src/stores/progress-circle";

import { useRouter } from "next/router";
import * as css from "./ProgressCircleControls.css";

export const ProgressCircleControls = () => {
  const { set } = useProgressCircleActions();
  const router = useRouter();

  const storeDuration = useProgressCircleDuration();
  const storeEasing = useProgressCircleEasing();

  const [duration, setDuration] = useUrlParamSync({
    paramName: "duration",
    storeValue: storeDuration,
    setStoreValue: (value) => set({ duration: value }),
  });

  const [easing, setEasing] = useUrlParamSync({
    paramName: "easing",
    storeValue: storeEasing,
    setStoreValue: (value) => set({ easing: value }),
  });

  const setAll = () => {
    set({ duration, easing });

    const params = new URLSearchParams();
    params.set("duration", duration);
    params.set("easing", easing);
    router.push(`?${params.toString()}`);
  };

  return (
    <div>
      <ActionButton type="button" onClick={() => set({ value: 0 })}>
        0%
      </ActionButton>
      <ActionButton type="button" onClick={() => set({ value: 25 })}>
        25%
      </ActionButton>
      <ActionButton type="button" onClick={() => set({ value: 50 })}>
        50%
      </ActionButton>
      <ActionButton type="button" onClick={() => set({ value: 75 })}>
        75%
      </ActionButton>
      <ActionButton type="button" onClick={() => set({ value: 100 })}>
        100%
      </ActionButton>

      <div>
        <div className={css.controlBlock}>
          <label className={css.controlLabel} htmlFor="duration">
            Duration
          </label>
          <input
            className={css.controlInput}
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
        <div className={css.controlBlock}>
          <label className={css.controlLabel} htmlFor="easing">
            Easing
          </label>
          <input
            className={css.controlInput}
            id="easing"
            value={easing}
            onChange={(e) => setEasing(e.target.value)}
          />
        </div>
        <ActionButton type="button" onClick={setAll}>
          적용
        </ActionButton>
      </div>
    </div>
  );
};
