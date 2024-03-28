"use strict";
(() => {
  // ../../node_modules/@create-figma-plugin/utilities/lib/events.js
  var eventHandlers = {};
  var currentId = 0;
  function on(name, handler) {
    const id = `${currentId}`;
    currentId += 1;
    eventHandlers[id] = { handler, name };
    return function() {
      delete eventHandlers[id];
    };
  }
  var emit = typeof window === "undefined" ? function(name, ...args) {
    figma.ui.postMessage([name, ...args]);
  } : function(name, ...args) {
    window.parent.postMessage({
      pluginMessage: [name, ...args]
    }, "*");
  };
  function invokeEventHandler(name, args) {
    let invoked = false;
    for (const id in eventHandlers) {
      if (eventHandlers[id].name === name) {
        eventHandlers[id].handler.apply(null, args);
        invoked = true;
      }
    }
    if (invoked === false) {
      throw new Error(`No event handler with name \`${name}\``);
    }
  }
  if (typeof window === "undefined") {
    figma.ui.onmessage = function(args) {
      if (!Array.isArray(args)) {
        return;
      }
      const [name, ...rest] = args;
      if (typeof name !== "string") {
        return;
      }
      invokeEventHandler(name, rest);
    };
  } else {
    window.onmessage = function(event) {
      if (typeof event.data.pluginMessage === "undefined") {
        return;
      }
      const args = event.data.pluginMessage;
      if (!Array.isArray(args)) {
        return;
      }
      const [name, ...rest] = event.data.pluginMessage;
      if (typeof name !== "string") {
        return;
      }
      invokeEventHandler(name, rest);
    };
  }

  // node_modules/@figmazing/resizable/dist/main.mjs
  var o = "FIGMAZING:windowSize";
  var r = () => on("FIGMAZING:RESIZE_WINDOW", (e, n) => {
    figma.ui.resize(e, n), figma.clientStorage.setAsync(o, { w: e, h: n });
  });
  r();

  // main/code.tsx
  var { widget } = figma;
  var { AutoLayout, Text, Input, SVG, useSyncedState, usePropertyMenu } = widget;
  var ShevronRight = `
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M11.5756 20.4241C11.3413 20.1898 11.3413 19.8099 11.5756 19.5756L18.5513 12.5999H3.99985C3.66848 12.5999 3.39985 12.3312 3.39985 11.9999C3.39985 11.6685 3.66848 11.3999 3.99985 11.3999H18.5513L11.5756 4.42412C11.3413 4.1898 11.3413 3.8099 11.5756 3.57559C11.8099 3.34127 12.1898 3.34127 12.4241 3.57559L20.4241 11.5756C20.6584 11.8099 20.6584 12.1898 20.4241 12.4241L12.4241 20.4241C12.1898 20.6584 11.8099 20.6584 11.5756 20.4241Z" fill="#212124"/>
  </svg>
`;
  var Widget = () => {
    const [url, setUrl] = useSyncedState("url", "");
    const [open, setOpen] = useSyncedState("open", false);
    usePropertyMenu(
      [
        {
          itemType: "toggle",
          isToggled: open,
          propertyName: "open",
          tooltip: "\uC8FC\uC18C \uBCC0\uACBD\uD558\uAE30"
        }
      ],
      ({ propertyName, propertyValue }) => {
        if (propertyName === "open") {
          setOpen(!open);
        }
      }
    );
    const handleTextEditEnd = (event) => {
      setUrl(event.characters);
    };
    const openPluginWithUrl = () => {
      figma.showUI(__html__, { width: 500, height: 500 });
      emit("OPEN", { url });
    };
    return /* @__PURE__ */ figma.widget.h(AutoLayout, { direction: "vertical", verticalAlignItems: "center" }, /* @__PURE__ */ figma.widget.h(
      AutoLayout,
      {
        direction: "horizontal",
        horizontalAlignItems: "center",
        verticalAlignItems: "center",
        padding: 8,
        onClick: () => new Promise(() => {
          openPluginWithUrl();
        })
      },
      /* @__PURE__ */ figma.widget.h(
        Text,
        {
          fontSize: 20,
          textDecoration: "underline",
          fontFamily: "Noto Sans KR",
          fontWeight: 400
        },
        "\uD53C\uADF8\uB9C8\uC5D0\uC11C \uAC00\uC774\uB4DC\uB77C\uC778 \uBCF4\uAE30"
      ),
      /* @__PURE__ */ figma.widget.h(SVG, { src: ShevronRight })
    ), open && /* @__PURE__ */ figma.widget.h(AutoLayout, { direction: "vertical" }, /* @__PURE__ */ figma.widget.h(Input, { value: url, placeholder: "seed design url", onTextEditEnd: handleTextEditEnd, fontSize: 14 })));
  };
  widget.register(Widget);
})();
