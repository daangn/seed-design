import "@seed-design/css/base.css";

// All from consumer-owned snippets (layer 2).
import "./seed-design/ui/action-button";
import "./seed-design/ui/checkbox";
import "./seed-design/ui/text";
import "./seed-design/ui/skeleton";
import "./seed-design/ui/badge";
import "./seed-design/ui/switch";
import "./seed-design/ui/segmented-control";
import "./seed-design/ui/radio-group";
import "./seed-design/ui/text-field";

const w = window as unknown as { __results?: unknown };

customElements.whenDefined("seed-text-field").then(() => {
  requestAnimationFrame(() => {
    const sw = document.getElementById("sw") as (HTMLElement & { checked: boolean }) | null;
    const seg = document.getElementById("seg") as (HTMLElement & { value: string }) | null;
    const rg = document.getElementById("rg") as (HTMLElement & { value: string }) | null;
    const tf = document.getElementById("tf") as (HTMLElement & { value: string }) | null;
    if (!sw || !seg || !rg || !tf) return;

    // drive each component programmatically
    sw.checked = true;
    seg.value = "sell";
    rg.value = "c";
    tf.value = "안녕";

    requestAnimationFrame(() => {
      const indicator = seg.querySelector<HTMLElement>(
        '[class*="seed-segmented-control__indicator"]',
      );
      const selectedRadio = [...rg.querySelectorAll("seed-radio")].find((r) =>
        r.hasAttribute("data-checked"),
      );
      w.__results = {
        switch_checked: sw.checked,
        segmented_value: seg.value,
        segmented_indicatorIndex: indicator?.style.getPropertyValue("--segment-index"),
        radio_selectedValue: selectedRadio?.getAttribute("value"),
        textfield_value: tf.querySelector("input")?.value,
      };
      console.log("__elements_demo__", JSON.stringify(w.__results, null, 2));
    });
  });
});
