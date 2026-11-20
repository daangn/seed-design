import { commitLog } from "./install";
import { root, runOnBackground, useEffect, useRef, useState } from "@lynx-js/react";
import { AttachmentDisplay } from "@seed-design/lynx-react/AttachmentDisplay";
import { AttachmentInput } from "@seed-design/lynx-react/AttachmentInput";
import { ReactionButton } from "@seed-design/lynx-react/ReactionButton";
import * as Switch from "@seed-design/lynx-react/Switch";
import * as Avatar from "@seed-design/lynx-react/Avatar";
import * as Checkbox from "@seed-design/lynx-react/Checkbox";
import { ImageFrame } from "@seed-design/lynx-react/ImageFrame";
import * as ChipTabs from "@seed-design/lynx-react/ChipTabs";
import * as Tabs from "@seed-design/lynx-react/Tabs";
import "@seed-design/lynx-css/all.css";
import { summarizeCommitLog } from "./commit-log";
import {
  COMMIT_PROBE_FLAG_PREFIX,
  type CommitSample,
  commitProbeFlag,
  summarizeCommitSamples,
  toCommitSample,
} from "./pipeline";

import {
  AppBarProbe,
  FieldProbe,
  SegmentedControlProbe,
  SliderProbe,
  type UpdateProbe,
} from "./state-fixtures";

declare const PROBE_SOURCE: string;
declare const PROBE_RUNTIME: string;

type PressScene =
  | "checkbox"
  | "switch"
  | "attachment-display"
  | "attachment-input"
  | "reaction-button";
type StateScene = "app-bar" | "field-focus" | "segment-registration" | "slider-values";
type Scene = StateScene | "tabs" | "chip-tabs" | "avatar" | "image-frame" | PressScene;
const displayEntry = { id: "probe", status: "error" as const };
const fileEntry = {
  id: "probe",
  status: "error" as const,
  file: { uri: "probe.png", name: "probe.png", type: "image/png", size: 10 },
};
type Operation = "mount" | "select" | "rerender";

const tabs = Array.from({ length: 26 }, (_, index) => String(index));
const imageSlots = tabs.slice(0, 8);
const settle = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function App() {
  const [scene, setScene] = useState<Scene | null>(null);
  const [selected, setSelected] = useState("0");
  const [step, setStep] = useState(0);
  const [imageSource, setImageSource] = useState("");
  const updateProbe: UpdateProbe = useRef(null);
  const imageStatuses = useRef<string[]>([]);
  const touches = useRef<string[]>([]);
  const recordStatus = (status: string) => {
    "background only";
    imageStatuses.current.push(status);
  };
  const recordTouch = (event: string) => {
    "background only";
    touches.current.push(event);
  };

  useEffect(() => {
    const samples: CommitSample[] = [];
    let measuring = false;
    let pipelineEntries = 0;
    const observer = lynx.performance?.createObserver?.((entry: unknown) => {
      if (!measuring) return;
      const sample = toCommitSample(entry);
      if (sample) samples.push(sample);
      if (
        typeof entry === "object" &&
        entry !== null &&
        "identifier" in entry &&
        typeof entry.identifier === "string" &&
        entry.identifier.startsWith(COMMIT_PROBE_FLAG_PREFIX)
      ) {
        pipelineEntries++;
      }
    });
    observer?.observe(["pipeline"]);

    const log = commitLog;
    const probe = {
      source: PROBE_SOURCE,
      reactLynx: PROBE_RUNTIME,
      engine: SystemInfo.engineVersion,
      hasBridge: Boolean(log),
      hasObserver: Boolean(observer),
      async preparePress(target: PressScene = "checkbox") {
        setScene(target);
        await settle(350);
      },
      async prepareState(target: StateScene) {
        setScene(target);
        await settle(350);
      },
      updateState() {
        if (!updateProbe.current) throw new Error("state probe is not ready");
        updateProbe.current();
      },
      async prepareCheckbox() {
        setScene("checkbox");
        await settle(350);
      },
      reset() {
        if (!log) throw new Error("rLynxChange hook was not installed");
        log.records.length = 0;
        touches.current.length = 0;
      },
      capture() {
        if (!log) throw new Error("rLynxChange hook was not installed");
        return {
          ...summarizeCommitLog(log.records),
          records: log.records.slice(),
          touches: touches.current.slice(),
        };
      },
      async run(target: Scene, operation: Operation, runs = 5, interval = 350, src = "") {
        if (!log) throw new Error("rLynxChange hook was not installed");
        if (measuring) throw new Error("commit probe already running");
        if (
          !Number.isInteger(runs) ||
          runs < 1 ||
          runs > 200 ||
          !Number.isFinite(interval) ||
          interval < 150 ||
          interval > 5_000
        ) {
          throw new Error("invalid runs or interval");
        }
        measuring = true;
        try {
          setScene(operation === "mount" ? null : target);
          setSelected("0");
          setImageSource(src);
          await settle(interval);
          samples.length = 0;
          pipelineEntries = 0;
          const updates = [];
          const statuses = [];
          for (let index = 0; index < runs; index++) {
            if (operation === "mount" && index > 0) {
              setScene(null);
              await settle(interval);
            }
            const start = log.records.length;
            imageStatuses.current.length = 0;
            setStep((current) => current + 1);
            if (operation === "mount") setScene(target);
            if (operation === "select") setSelected((current) => (current === "0" ? "1" : "0"));
            await settle(interval);
            const records = log.records.slice(start);
            updates.push(records);
            statuses.push(imageStatuses.current.slice());
          }
          await settle(Math.max(interval, 500));
          return {
            source: PROBE_SOURCE,
            target,
            operation,
            updates: updates.map((records) => ({ records, ...summarizeCommitLog(records) })),
            statuses,
            pipelineEntries,
            pipelineSamples: samples.slice(),
            pipeline: samples.length ? summarizeCommitSamples(samples) : null,
          };
        } finally {
          measuring = false;
          log.records.length = 0;
        }
      },
    };
    Reflect.set(globalThis, "__seedCommitProbe", probe);
    return () => observer?.disconnect();
  }, []);

  const pressProps = {
    "accessibility-label": "Probe action",
    style: { width: "200px", height: "64px", marginTop: "16px" },
    "main-thread:bindtouchstart": () => {
      "main thread";
      runOnBackground(recordTouch)("start");
    },
    "main-thread:bindtouchcancel": () => {
      "main thread";
      runOnBackground(recordTouch)("cancel");
    },
    bindtap: () => {
      "background only";
      recordTouch("tap");
    },
  };
  const flag = step > 0 ? { __lynx_timing_flag: commitProbeFlag(step) } : {};
  return (
    <view {...flag}>
      <text>SEED commit probe {step}</text>
      {scene === "app-bar" && <AppBarProbe update={updateProbe} />}
      {scene === "segment-registration" && <SegmentedControlProbe update={updateProbe} />}
      {scene === "slider-values" && <SliderProbe update={updateProbe} />}
      {scene === "field-focus" && <FieldProbe update={updateProbe} />}
      {scene === "checkbox" && (
        <Checkbox.Root {...pressProps} accessibility-label="Probe checkbox">
          <Checkbox.Control />
          <Checkbox.Label>Probe checkbox</Checkbox.Label>
        </Checkbox.Root>
      )}
      {scene === "switch" && (
        <Switch.Root {...pressProps}>
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
          <Switch.Label>Probe action</Switch.Label>
        </Switch.Root>
      )}
      {scene === "attachment-display" && (
        <AttachmentDisplay.Root defaultEntries={[displayEntry]}>
          <AttachmentDisplay.Item entry={displayEntry}>
            <AttachmentDisplay.ItemActionButton {...pressProps}>
              Probe action
            </AttachmentDisplay.ItemActionButton>
          </AttachmentDisplay.Item>
        </AttachmentDisplay.Root>
      )}
      {scene === "attachment-input" && (
        <AttachmentInput.Root defaultAcceptedFileEntries={[fileEntry]}>
          <AttachmentInput.Item fileEntry={fileEntry}>
            <AttachmentInput.ItemActionButton {...pressProps}>
              Probe action
            </AttachmentInput.ItemActionButton>
          </AttachmentInput.Item>
        </AttachmentInput.Root>
      )}
      {scene === "reaction-button" && (
        <ReactionButton {...pressProps}>
          <text>Probe action</text>
        </ReactionButton>
      )}
      {scene === "avatar" &&
        imageSlots.map((key) => (
          <Avatar.Root key={key} onLoadingStatusChange={recordStatus}>
            <Avatar.Image alt={`Avatar ${key}`} src={imageSource} />
            <Avatar.Fallback>
              <text>Avatar fallback</text>
            </Avatar.Fallback>
          </Avatar.Root>
        ))}
      {scene === "image-frame" &&
        imageSlots.map((key) => (
          <ImageFrame
            key={key}
            alt={`ImageFrame ${key}`}
            src={imageSource}
            width="48px"
            onLoadingStatusChange={recordStatus}
            fallback={<text>Frame fallback</text>}
          />
        ))}
      {scene === "tabs" && (
        <Tabs.Root value={selected} onValueChange={setSelected}>
          <Tabs.List>
            {tabs.map((tab) => (
              <Tabs.Trigger key={tab} value={tab}>
                Tab {tab}
              </Tabs.Trigger>
            ))}
            <Tabs.Indicator />
          </Tabs.List>
        </Tabs.Root>
      )}
      {scene === "chip-tabs" && (
        <ChipTabs.Root value={selected} onValueChange={setSelected}>
          <ChipTabs.List>
            {tabs.map((tab) => (
              <ChipTabs.Trigger key={tab} value={tab}>{`Tab ${tab}`}</ChipTabs.Trigger>
            ))}
          </ChipTabs.List>
        </ChipTabs.Root>
      )}
    </view>
  );
}

root.render(<App />);
