import * as React from "react";
import { Resizable } from "@figmazing/resizable";

export const App = () => {
  const [url, setUrl] = React.useState("");

  window.onmessage = (event) => {
    const [type, data] = event.data.pluginMessage;
    if (type === "OPEN") {
      setUrl(data.url);
    }
  };

  return  (
    <>
      <iframe src={url} title={url} style={{ width: "100%", height: "100%" }} />
      <Resizable
        style={{
          position: "fixed",
          bottom: "1px",
          right: "1px",
          width: "16px",
          height: "16px",
          zIndex: 9999,
          cursor: "nwse-resize",
        }}
      />
    </>
  )
};
