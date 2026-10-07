import { useState } from "@lynx-js/react";

export const PARAGRAPH =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam autem deserunt reprehenderit ducimus sunt. Quod laudantium excepturi tempora fuga repellendus accusantium nam maiores? Quas debitis, neque ullam eligendi minus sit?";

export function useRefreshObservation() {
  const [refreshCount, setRefreshCount] = useState(0);
  const [lastEvent, setLastEvent] = useState("idle");

  function onPtrPullStart() {
    "background only";
    setLastEvent("pullStart");
  }

  function onPtrReady() {
    "background only";
    setLastEvent("ready");
  }

  function onPtrPullEnd() {
    "background only";
    setLastEvent("pullEnd");
  }

  async function onPtrRefresh() {
    "background only";
    setRefreshCount((count) => count + 1);
    setLastEvent("refresh 진행 중");
    await new Promise<void>((resolve) => setTimeout(resolve, 1000));
    setLastEvent("refresh 완료");
  }

  return {
    refreshCount,
    lastEvent,
    callbacks: { onPtrPullStart, onPtrReady, onPtrPullEnd, onPtrRefresh },
  };
}
