import { ActionButton } from "@/seed-design/ui/action-button";
import {
  useSkeletonActions,
  useSkeletonDuration,
  useSkeletonGradient,
  useSkeletonLoading,
  useSkeletonTimingFunction,
  useLoadingDurationMs,
  useSkeletonInitTransitionDuration,
  useRealLoadingStartTimeMs,
  useIsRealLoading,
} from "@/src/stores/skeleton";

import * as React from "react";
import * as css from "./SkeletonControls.css";

export const SkeletonControls = () => {
  const { setControls } = useSkeletonActions();

  const isLoading = useSkeletonLoading();
  const isRealLoading = useIsRealLoading();
  const [realLoadingStartTime, setRealLoadingStartTime] = React.useState(
    useRealLoadingStartTimeMs(),
  );
  const loadingDurationInStore = useLoadingDurationMs();
  const [duration, setDuration] = React.useState(useSkeletonDuration());
  const [gradient, setGradient] = React.useState(useSkeletonGradient());
  const [timingFunction, setTimingFunction] = React.useState(useSkeletonTimingFunction());
  const [loadingDuration, setLoadingDuration] = React.useState(loadingDurationInStore);
  const [initTransitionDuration, setInitTransitionDuration] = React.useState(
    useSkeletonInitTransitionDuration(),
  );

  const convertToMs = (duration: string) => {
    const [time, unit] = duration.split(/(?<=\d)(?=[a-zA-Z])/);
    const timeInMs = Number(time) * (unit === "s" ? 1000 : 1);
    return timeInMs;
  };

  const realLoadingStartTimeLeft = (realLoadingStartTime / loadingDuration) * 100;
  const initTransitionDurationLeft =
    (convertToMs(initTransitionDuration) / loadingDuration) * 100 + realLoadingStartTimeLeft;

  React.useEffect(() => {
    let offTimeout: NodeJS.Timeout;
    let onTimeout: NodeJS.Timeout;

    if (isLoading) {
      onTimeout = setTimeout(() => {
        setControls({ isRealLoading: true });
      }, realLoadingStartTime);

      offTimeout = setTimeout(() => {
        setControls({ isLoading: false, isRealLoading: false });
      }, loadingDuration);
    } else {
      setControls({ isRealLoading: false });
    }

    return () => {
      clearTimeout(offTimeout);
      clearTimeout(onTimeout);
    };
  }, [isLoading, realLoadingStartTime, loadingDuration, setControls]);

  return (
    <div>
      <ActionButton
        variant={isLoading ? "brandWeak" : "brandSolid"}
        onClick={() => setControls({ isLoading: !isLoading })}
      >
        {isLoading ? "Stop Loading" : "Start Loading"}
      </ActionButton>

      <div>
        <h2 className={css.controlTitle}>Timeline</h2>
        <div
          style={{
            width: "100%",
            height: "1px",
            background: "black",
            position: "relative",
          }}
        >
          {isLoading && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                width: "10px",
                height: "10px",
                background: "red",
                transform: "translateY(-50%)",
                animation: `${css.leftToRight} ${loadingDuration}ms linear`,
              }}
            />
          )}

          {/* realLoadingStartTime Point */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              width: "10px",
              height: "10px",
              background: "blue",
              transform: "translateY(-50%)",
              left: `${realLoadingStartTimeLeft}%`,
            }}
          >
            <span
              style={{
                position: "absolute",
                top: "100%",
                left: "-50%",
                transform: "translateX(-50%)",
                fontSize: "10px",
                whiteSpace: "nowrap",
              }}
            >
              실제 로딩 시작 시간: {realLoadingStartTime}ms
            </span>
          </div>

          {/* initTransitionDuration  */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              width: "10px",
              height: "10px",
              background: "green",
              transform: "translateY(-50%)",
              left: `${initTransitionDurationLeft}%`,
            }}
          >
            <span
              style={{
                position: "absolute",
                top: "-150%",
                left: "-50%",
                transform: "translateX(-50%)",
                fontSize: "10px",
                whiteSpace: "nowrap",
              }}
            >
              스켈레톤 트랜지션: {convertToMs(initTransitionDuration)}ms
            </span>
          </div>
        </div>
      </div>
      <div>
        <h2 className={css.controlTitle}>Transition</h2>

        <div>isLoading : {`${isLoading}`}</div>
        <div>isRealLoading : {`${isRealLoading}`}</div>

        <div className={css.controlBlock}>
          <label className={css.controlLabel} htmlFor="initTransitionDuration">
            스켈레톤 트랜지션 시간
          </label>
          <input
            className={css.controlInput}
            id="initTransitionDuration"
            type="string"
            value={initTransitionDuration}
            onChange={(e) => setInitTransitionDuration(e.target.value)}
          />
        </div>
        <div className={css.controlBlock}>
          <label className={css.controlLabel} htmlFor="realLoadingStartTime">
            실제 로딩 시작 시간
          </label>
          <input
            className={css.controlInput}
            id="realLoadingStartTime"
            type="number"
            value={realLoadingStartTime}
            onChange={(e) => setRealLoadingStartTime(+e.target.value)}
          />
        </div>
      </div>
      <div>
        <h2 className={css.controlTitle}>Loading</h2>
        <div className={css.controlBlock}>
          <label className={css.controlLabel} htmlFor="loadingDuration">
            총 로딩 길이
          </label>
          <input
            className={css.controlInput}
            id="loadingDuration"
            type="number"
            value={loadingDuration}
            onChange={(e) => setLoadingDuration(+e.target.value)}
          />
        </div>
        <p>{loadingDurationInStore}ms 후에 로딩이 멈춥니다.</p>
      </div>
      <div>
        <h2 className={css.controlTitle}>Transition</h2>
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
          <label className={css.controlLabel} htmlFor="gradient">
            Gradient
          </label>
          <input
            className={css.controlInput}
            id="gradient"
            value={gradient}
            onChange={(e) => setGradient(e.target.value)}
          />
        </div>
        <div className={css.controlBlock}>
          <label className={css.controlLabel} htmlFor="timing-function">
            Timing Function
          </label>
          <input
            className={css.controlInput}
            id="timing-function"
            value={timingFunction}
            onChange={(e) => setTimingFunction(e.target.value)}
          />
        </div>
      </div>
      <ActionButton
        className={css.adapt}
        type="button"
        onClick={() =>
          setControls({
            duration,
            gradient,
            isLoading,
            loadingDurationMs: loadingDuration,
            timingFunction,
            initTransitionDuration,
            realLoadingStartTimeMs: realLoadingStartTime,
            isRealLoading,
          })
        }
      >
        적용
      </ActionButton>
    </div>
  );
};
