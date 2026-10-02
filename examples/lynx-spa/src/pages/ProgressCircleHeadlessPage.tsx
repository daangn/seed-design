import { useState } from "@lynx-js/react";
import { ProgressCircle, useProgressCircleContext } from "@seed-design/lynx-react-progress";

import { CatalogExamples, CatalogSectionTitle } from "../components/catalog-examples.jsx";
import "../styles/progress-circle-headless.css";

/** Recipe 없이 Context의 진행률만으로 막대를 그린다. */
function Bar() {
  const { indeterminate, percent } = useProgressCircleContext();

  return (
    <ProgressCircle.Track className="progress-headless-track">
      <ProgressCircle.Range
        className="progress-headless-range"
        style={{ width: indeterminate ? "30%" : `${percent}%` }}
      />
    </ProgressCircle.Track>
  );
}

function Status() {
  const { indeterminate, percent, minValue, maxValue } = useProgressCircleContext();

  return (
    <text className="progress-headless-status">
      {indeterminate ? "indeterminate" : `percent=${percent} (min=${minValue}, max=${maxValue})`}
    </text>
  );
}

const STEPS = [undefined, 0, 25, 100, 150] as const;

export function ProgressCircleHeadlessPage() {
  const [step, setStep] = useState(0);
  const value = STEPS[step % STEPS.length];

  function next() {
    "background only";
    setStep((current) => current + 1);
  }

  return (
    <CatalogExamples title="ProgressCircle (Headless)" gap="16px">
      <CatalogSectionTitle>value만 지정 (기본 0–100)</CatalogSectionTitle>
      <view className="progress-headless-button" bindtap={next}>
        <text>{`value: ${value ?? "없음"} (탭해서 변경)`}</text>
      </view>
      <ProgressCircle.Root className="progress-headless-root" value={value}>
        <Bar />
        <Status />
      </ProgressCircle.Root>

      <CatalogSectionTitle>minValue·maxValue 지정</CatalogSectionTitle>
      <ProgressCircle.Root className="progress-headless-root" minValue={0} maxValue={1} value={0.4}>
        <Bar />
        <Status />
      </ProgressCircle.Root>

      <CatalogSectionTitle>접근성 값 덮어쓰기</CatalogSectionTitle>
      <ProgressCircle.Root
        className="progress-headless-root"
        value={40}
        accessibility-value="40% 업로드됨"
      >
        <Bar />
        <Status />
      </ProgressCircle.Root>
    </CatalogExamples>
  );
}
