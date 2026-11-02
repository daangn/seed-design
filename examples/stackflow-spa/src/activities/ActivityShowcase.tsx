import { useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import { useEffect } from "react";
import * as cases from "../showcase/cases";

declare module "@stackflow/config" {
  interface Register {
    ActivityShowcase: { c?: string };
  }
}

declare global {
  interface Window {
    __showcasePush?: (c: string) => void;
  }
}

const ActivityShowcase: StaticActivityComponentType<"ActivityShowcase"> = ({ params }) => {
  const { push } = useFlow();

  useEffect(() => {
    window.__showcasePush = (c) => push("ActivityShowcase", { c });
  }, [push]);

  const Case =
    Object.entries(cases).find(([name]) => name === `Case${params.c ?? "Behind"}`)?.[1] ??
    cases.CaseBehind;

  return <Case />;
};

export default ActivityShowcase;
