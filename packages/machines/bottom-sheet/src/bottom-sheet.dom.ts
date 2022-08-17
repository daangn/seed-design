import { defineDomHelpers } from "@zag-js/dom-utils"
import type { MachineContext as Ctx } from "./bottom-sheet.types"

export const dom = defineDomHelpers({
  getUnderlayId: (ctx: Ctx) => ctx.ids?.underlay ?? `bottom-sheet:${ctx.id}:underlay`,
  getBackdropId: (ctx: Ctx) => ctx.ids?.backdrop ?? `bottom-sheet:${ctx.id}:backdrop`,
  getContentId: (ctx: Ctx) => ctx.ids?.content ?? `bottom-sheet:${ctx.id}:content`,
  getTriggerId: (ctx: Ctx) => ctx.ids?.trigger ?? `bottom-sheet:${ctx.id}:trigger`,
  getTitleId: (ctx: Ctx) => ctx.ids?.title ?? `bottom-sheet:${ctx.id}:title`,
  getDescriptionId: (ctx: Ctx) => ctx.ids?.description ?? `bottom-sheet:${ctx.id}:description`,

  getContentEl: (ctx: Ctx) => dom.getById(ctx, dom.getContentId(ctx)),
  getTriggerEl: (ctx: Ctx) => dom.getById(ctx, dom.getTriggerId(ctx)),
  getUnderlayEl: (ctx: Ctx) => dom.getById(ctx, dom.getUnderlayId(ctx)),
  getTitleEl: (ctx: Ctx) => dom.getById(ctx, dom.getTitleId(ctx)),
  getDescriptionEl: (ctx: Ctx) => dom.getById(ctx, dom.getDescriptionId(ctx)),
})