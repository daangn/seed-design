import type { Meta, StoryObj } from "@storybook/nextjs";

import { MiddleTruncate } from "@seed-design/react-middle-truncate";
import { SeedThemeDecorator } from "./components/decorator";

const SAMPLE_TEXTS = {
  short: "short.txt",
  korean: "법인사업자등록증_2024년도_갱신본.pdf",
  long: "summer-vacation-photo-of-the-year-2024-final-version.png",
  cjk: "가나다라마바사아자차카타파하가나다라마바사아자차카.pdf",
  noExtension: "README",
  multiDot: "archive.2024.01.15.tar.gz",
};

interface MiddleTruncateStoryProps {
  text: string;
  end: number;
  maxLines: number;
  ellipsis: string;
  width: number;
}

const MiddleTruncateForStory = ({
  text,
  end,
  maxLines,
  ellipsis,
  width,
}: MiddleTruncateStoryProps) => (
  <div
    style={{
      width,
      border: "1px dashed var(--seed-color-stroke-neutralMuted)",
      padding: 8,
      wordBreak: "break-all",
    }}
  >
    <MiddleTruncate end={end} maxLines={maxLines} ellipsis={ellipsis}>
      {text}
    </MiddleTruncate>
  </div>
);

const meta = {
  component: MiddleTruncateForStory,
  decorators: [SeedThemeDecorator],
  argTypes: {
    text: {
      control: "text",
      description: "Text content to truncate",
    },
    end: {
      control: { type: "number", min: 0, max: 20 },
      description: "Number of characters preserved from end",
    },
    maxLines: {
      control: { type: "number", min: 1, max: 5 },
      description: "Maximum lines before truncation",
    },
    ellipsis: {
      control: "text",
      description: "Ellipsis string",
    },
    width: {
      control: { type: "number", min: 50, max: 500 },
      description: "Container width (px)",
    },
  },
  args: {
    text: SAMPLE_TEXTS.korean,
    end: 4,
    maxLines: 1,
    ellipsis: "\u2026",
    width: 200,
  },
} satisfies Meta<typeof MiddleTruncateForStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const SingleLine: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {Object.entries(SAMPLE_TEXTS).map(([label, text]) => (
        <div key={label}>
          <div style={{ fontSize: 12, color: "var(--seed-color-fg-placeholder)", marginBottom: 4 }}>
            {label}: {text}
          </div>
          <div
            style={{
              width: 200,
              border: "1px dashed var(--seed-color-stroke-neutralMuted)",
              padding: 8,
              wordBreak: "break-all",
            }}
          >
            <MiddleTruncate end={4}>{text}</MiddleTruncate>
          </div>
        </div>
      ))}
    </div>
  ),
};

export const TwoLines: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {Object.entries(SAMPLE_TEXTS).map(([label, text]) => (
        <div key={label}>
          <div style={{ fontSize: 12, color: "var(--seed-color-fg-placeholder)", marginBottom: 4 }}>
            {label}: {text}
          </div>
          <div
            style={{
              width: 200,
              border: "1px dashed var(--seed-color-stroke-neutralMuted)",
              padding: 8,
              wordBreak: "break-all",
            }}
          >
            <MiddleTruncate end={4} maxLines={2}>
              {text}
            </MiddleTruncate>
          </div>
        </div>
      ))}
    </div>
  ),
};

export const VariousWidths: Story = {
  render: () => {
    const text = SAMPLE_TEXTS.korean;
    const widths = [100, 150, 200, 300];

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {widths.map((width) => (
          <div key={width}>
            <div
              style={{ fontSize: 12, color: "var(--seed-color-fg-placeholder)", marginBottom: 4 }}
            >
              width: {width}px
            </div>
            <div
              style={{
                width,
                border: "1px dashed var(--seed-color-stroke-neutralMuted)",
                padding: 8,
                wordBreak: "break-all",
              }}
            >
              <MiddleTruncate end={4} maxLines={2}>
                {text}
              </MiddleTruncate>
            </div>
          </div>
        ))}
      </div>
    );
  },
};

export const CustomEllipsis: Story = {
  render: () => {
    const text = SAMPLE_TEXTS.long;
    const ellipses = ["\u2026", "...", " (...) "];

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {ellipses.map((ellipsis) => (
          <div key={ellipsis}>
            <div
              style={{ fontSize: 12, color: "var(--seed-color-fg-placeholder)", marginBottom: 4 }}
            >
              ellipsis: "{ellipsis}"
            </div>
            <div
              style={{
                width: 200,
                border: "1px dashed var(--seed-color-stroke-neutralMuted)",
                padding: 8,
                wordBreak: "break-all",
              }}
            >
              <MiddleTruncate end={4} ellipsis={ellipsis}>
                {text}
              </MiddleTruncate>
            </div>
          </div>
        ))}
      </div>
    );
  },
};
