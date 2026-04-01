import { Primitive } from "@seed-design/react-primitive";
import { useRef } from "react";
import { usePresence } from "./usePresence";

export interface PresenceProps {
  present: boolean;
  unmountOnExit: boolean;
  lazyMount: boolean;
  children: React.ReactNode;
}

export const Presence = (props: PresenceProps) => {
  const { isPresent, ref } = usePresence(props.present);
  const wasEverPresent = useRef(false);

  if (isPresent) {
    wasEverPresent.current = true;
  }

  const unmounted =
    (!isPresent && !wasEverPresent.current && props.lazyMount) ||
    (props.unmountOnExit && !isPresent && wasEverPresent.current);

  if (unmounted) {
    return null;
  }

  return (
    <Primitive.div ref={ref as any} asChild>
      {props.children}
    </Primitive.div>
  );
};
Presence.displayName = "Presence";
