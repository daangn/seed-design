import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

function Portal({ children }: { children: ReactNode }) {
  const [el, setEl] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (document) {
      const portalRoot = document.getElementById("portal") as HTMLDivElement;
      const containerElement = document.createElement("div");

      portalRoot.appendChild(containerElement);
      setEl(containerElement);
    }

    return () => {
      if (document && el) {
        const portalRoot = document.getElementById("portal") as HTMLDivElement;
        portalRoot.removeChild(el as HTMLDivElement);
      }
    };
  }, []);

  if (!el) return null;

  return ReactDOM.createPortal(children, el);
}

export default Portal;
