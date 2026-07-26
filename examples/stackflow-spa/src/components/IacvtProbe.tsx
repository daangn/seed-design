import { Box } from "@seed-design/react";
import * as React from "react";

/**
 * Reads the computed style of a ref'd element after layout settles, re-measuring
 * on resize. Surfaces the real *used* values on-device so the WebKit 241433
 * inheritance leak can be verified on old iOS without DevTools.
 */
export function useComputedStyle(cssProps: string[], deps: React.DependencyList = []) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [values, setValues] = React.useState<Record<string, string>>({});
  const key = cssProps.join("|");

  React.useLayoutEffect(() => {
    const measure = () => {
      const el = ref.current;
      if (!el) return;

      const cs = getComputedStyle(el);
      setValues(Object.fromEntries(key.split("|").map((p) => [p, cs.getPropertyValue(p).trim()])));
    };

    measure();
    const raf = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [key, ...deps]);

  return [ref, values] as const;
}

/**
 * Measures `--seed-*` custom properties on whatever element `getEl` resolves to
 * (e.g. an overlay part reached via `closest()` or `document.querySelector`).
 * Polls briefly after each deps change so it catches the element mounting and any
 * enter transition, and re-measures on resize. The custom-property value is the
 * inheritance signal itself — unlike resolved layout, it has no `auto→0px` /
 * implicit-track artifacts — so it stays accurate for overlays that portal or
 * position out of flow.
 */
export function useElementVars(
  getEl: () => Element | null | undefined,
  varNames: string[],
  deps: React.DependencyList = [],
) {
  const getElRef = React.useRef(getEl);
  getElRef.current = getEl;

  const [values, setValues] = React.useState<Record<string, string>>({});
  const key = varNames.join("|");

  React.useEffect(() => {
    let frame = 0;
    let raf = 0;

    const measure = () => {
      const el = getElRef.current();
      if (el) {
        const cs = getComputedStyle(el);
        setValues(
          Object.fromEntries(key.split("|").map((p) => [p, cs.getPropertyValue(p).trim()])),
        );
      }
      // Poll ~40 frames (~0.6s) to catch late mount / enter transition, then stop.
      if (frame++ < 40) raf = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("resize", measure);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [key, ...deps]);

  return values;
}

export function Verdict({ leaked, pending }: { leaked: boolean; pending: boolean }) {
  return (
    <Box
      mt="x2"
      px="x2"
      py="x1"
      borderRadius="r1"
      style={{
        display: "inline-block",
        fontSize: 12,
        fontWeight: 700,
        background: pending ? "#eef0f2" : leaked ? "#fdecec" : "#e7f6ec",
        color: pending ? "#5b6470" : leaked ? "#b42318" : "#137333",
      }}
    >
      {pending ? "측정 중…" : leaked ? "LEAK — 구형 WebKit 상속 버그" : "OK — 기대값"}
    </Box>
  );
}

/**
 * One leak test. The `children` render-prop builds a parent that sets a
 * distinctive value on `cssProp` and a child (with the probe `ref` attached)
 * that must reset it. On modern engines the child resets (OK). On WebKit before
 * the guaranteed-invalid fix (Safari <16.4, incl. iOS 16.0.x — webkit.org/b/241433)
 * the child inherits the ancestor value instead (LEAK).
 */
export function LeakCase({
  title,
  note,
  cssProp,
  expected,
  isLeak,
  children,
}: {
  title: string;
  note?: string;
  cssProp: string;
  expected: string;
  isLeak: (computed: string) => boolean;
  children: (ref: React.RefObject<HTMLDivElement | null>) => React.ReactNode;
}) {
  const [ref, values] = useComputedStyle([cssProp]);
  const computed = values[cssProp];
  const pending = computed === undefined || computed === "";
  const leaked = !pending && isLeak(computed);

  return (
    <Box bg="palette.gray50" p="x4" borderRadius="r2" mb="x3">
      <Box color="palette.gray900" mb="x1" style={{ fontSize: 15, fontWeight: 600 }}>
        {title}
      </Box>
      {note && (
        <Box color="palette.gray600" mb="x2" style={{ fontSize: 12, lineHeight: 1.5 }}>
          {note}
        </Box>
      )}
      <Box bg="palette.gray25" p="x3" borderRadius="r1" mb="x2">
        {children(ref)}
      </Box>
      <Box color="palette.gray700" style={{ fontSize: 12, fontFamily: "monospace" }}>
        computed {cssProp}: <b>{pending ? "…" : computed}</b>
      </Box>
      <Box color="palette.gray500" style={{ fontSize: 12, fontFamily: "monospace" }}>
        기대값(fix 적용): {expected}
      </Box>
      <Verdict leaked={leaked} pending={pending} />
    </Box>
  );
}
