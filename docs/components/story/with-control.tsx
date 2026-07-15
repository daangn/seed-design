"use client";

import { cn } from "./cn";
import { useStf, StfProvider, useDataEngine, useListener } from "@fumari/stf";
import { ScrollFog } from "@seed-design/react";
import { Chip } from "seed-design/ui/chip";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { AlertCircle } from "lucide-react";
import { FC, useState, useRef, useDeferredValue, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { FieldSet } from "./arg-form";
import type { TypeNode } from "@fumadocs/story/type-tree";
import { useTranslations } from "@fuma-translate/react";

export interface WithControlProps {
  Component: FC;
  presets: (VariantInfo & {
    controls: TypeNode;
    defaultValues?: Record<string, unknown>;
  })[];
}

export interface VariantInfo {
  variant: string;
  description?: string;
}

export function WithControl({ presets, Component }: WithControlProps) {
  const t = useTranslations({ note: "story controls" });
  const [variant, setVariant] = useState(presets[0].variant);
  const preset = presets.find((preset) => preset.variant === variant);
  const stf = useStf({
    defaultValues: preset?.defaultValues,
  });

  return (
    <StfProvider value={stf}>
      <div className="not-prose flex flex-col gap-1 p-1 border rounded-md shadow-sm bg-fd-card text-fd-card-foreground">
        <div className="flex flex-row items-center gap-2 empty:hidden">
          {presets.length > 1 && (
            <ScrollFog
              placement={["left", "right"]}
              size={16}
              hideScrollBar
              className="ms-auto min-w-0"
            >
              <Chip.RadioRoot
                aria-label={t("Variant")}
                value={variant}
                onValueChange={(value) => {
                  const preset = presets.find((preset) => preset.variant === value);
                  if (preset) {
                    setVariant(value);
                    stf.dataEngine.reset(preset.defaultValues ?? {});
                  }
                }}
                className="flex w-max flex-row gap-1.5"
              >
                {presets.map((item) => (
                  <Chip.RadioItem
                    key={item.variant}
                    value={item.variant}
                    variant="outlineWeak"
                    size="small"
                  >
                    <Chip.Label>{item.variant}</Chip.Label>
                  </Chip.RadioItem>
                ))}
              </Chip.RadioRoot>
            </ScrollFog>
          )}
        </div>
        <StoryComponent Component={Component} />
        {preset && (
          <FieldSet
            field={preset.controls}
            fieldName={[]}
            name={t("Props")}
            className="max-h-[600px] overflow-auto"
          />
        )}
      </div>
    </StfProvider>
  );
}

function StoryComponent({ Component }: { Component: FC }) {
  const t = useTranslations({ note: "story error boundary" });
  const engine = useDataEngine();
  const timerRef = useRef(0);
  const [args, setArgs] = useState(() => engine.getData());
  const deferredArgs = useDeferredValue(args);
  useListener({
    onUpdate() {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setArgs({ ...engine.getData() }), 100);
    },
  });

  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <div className="p-3 border rounded-lg bg-fd-card text-fd-card-foreground text-sm">
          <p className="inline-flex items-center gap-2 font-medium mb-2">
            <AlertCircle className="text-fd-error size-4" />
            {t("Encountered error when rendering the component.")}
          </p>
          <p className="text-fd-muted-foreground mb-2">{String(error)}</p>
          <button
            type="button"
            className={cn(buttonVariants({ variant: "primary", size: "sm" }))}
            onClick={() => resetErrorBoundary()}
          >
            {t("Reset")}
          </button>
        </div>
      )}
    >
      <Suspense>
        <Component {...deferredArgs} key={undefined} />
      </Suspense>
    </ErrorBoundary>
  );
}
