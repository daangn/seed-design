import type { NormalizeProps, PropTypes } from "@zag-js/types"
import { dom } from "./bottom-sheet.dom"
import {dataAttr} from '@zag-js/dom-utils'
import type { Send, State } from "./bottom-sheet.types"

export function connect<T extends PropTypes>(state: State, send: Send, normalize: NormalizeProps<T>) {
  const ariaLabel = state.context["aria-label"]
  const isOpen = state.matches("open")
  const isClosing = state.matches("closing")
  const rendered = state.context.renderedElements

  return {
    isOpen,
    isClosing,
    open() {
      send("OPEN")
    },
    close() {
      send("CLOSE")
    },

    triggerProps: normalize.button({
      "data-part": "trigger",
      id: dom.getTriggerId(state.context),
      "aria-haspopup": "dialog",
      type: "button",
      "aria-expanded": isOpen,
      "aria-controls": dom.getContentId(state.context),
      onClick() {
        send("TOGGLE")
      },
    }),

    backdropProps: normalize.element({
      "data-part": "backdrop",
      id: dom.getBackdropId(state.context),
    }),

    underlayProps: normalize.element({
      "data-part": "underlay",
      id: dom.getUnderlayId(state.context),
    }),

    contentProps: normalize.element({
      "data-part": "content",
      "data-open": dataAttr(isOpen),
      role: state.context.role,
      id: dom.getContentId(state.context),
      tabIndex: -1,
      "aria-modal": true,
      "aria-label": ariaLabel || undefined,
      "aria-labelledby": ariaLabel || !rendered.title ? undefined : dom.getTitleId(state.context),
      "aria-describedby": rendered.description ? dom.getDescriptionId(state.context) : undefined,
    }),

    titleProps: normalize.element({
      "data-part": "title",
      id: dom.getTitleId(state.context),
    }),

    descriptionProps: normalize.element({
      "data-part": "description",
      id: dom.getDescriptionId(state.context),
    }),
  }
}