"use client";

import type { ReactElement } from "react";
import {
  IconBellFill,
  IconBellLine,
  IconBookmarkFill,
  IconBookmarkLine,
  IconCalendarFill,
  IconCalendarLine,
  IconCheckmarkFill,
  IconCheckmarkLine,
  IconChevronDownFill,
  IconChevronDownLine,
  IconChevronRightFill,
  IconChevronRightLine,
  IconClockFill,
  IconClockLine,
  IconExclamationmarkCircleFill,
  IconExclamationmarkCircleLine,
  IconEyeFill,
  IconEyeLine,
  IconEyeSlashFill,
  IconEyeSlashLine,
  IconFaceSmileCircleFill,
  IconFaceSmileCircleLine,
  IconGearFill,
  IconGearLine,
  IconGiftFill,
  IconGiftLine,
  IconHeartFill,
  IconHeartLine,
  IconILowercaseSerifCircleFill,
  IconILowercaseSerifCircleLine,
  IconLocationpinFill,
  IconLocationpinLine,
  IconMagnifyingglassFill,
  IconMagnifyingglassLine,
  IconPencilFill,
  IconPencilLine,
  IconPersonCircleFill,
  IconPersonCircleLine,
  IconPlusFill,
  IconPlusLine,
  IconQuestionmarkCircleFill,
  IconQuestionmarkCircleLine,
  IconStarFill,
  IconStarLine,
  IconTagFill,
  IconTagLine,
  IconTrashcanFill,
  IconTrashcanLine,
  IconXmarkFill,
  IconXmarkLine,
} from "@karrotmarket/react-monochrome-icon";

/**
 * Two mirrored icon sets offered as predefined options in story icon controls.
 * The concept list is identical between fill and line so a component's story can
 * pick whichever weight matches its convention (see per-component usage in
 * `docs/examples/react/*`): fill for decorative/emphasis slots
 * (callout, tag-group, reaction-button, help-bubble…), line for functional
 * affixes (field-button, text-field, menu, list, FAB…).
 *
 * Keyed by the icon component name so fill/line keys never collide, letting the
 * story control (components/story/arg-form.tsx) resolve a selected key back to
 * the same element the story wrapper injects.
 */
export const fillIconSet = {
  IconPlusFill: <IconPlusFill />,
  IconBellFill: <IconBellFill />,
  IconHeartFill: <IconHeartFill />,
  IconStarFill: <IconStarFill />,
  IconBookmarkFill: <IconBookmarkFill />,
  IconChevronRightFill: <IconChevronRightFill />,
  IconChevronDownFill: <IconChevronDownFill />,
  IconMagnifyingglassFill: <IconMagnifyingglassFill />,
  IconPersonCircleFill: <IconPersonCircleFill />,
  IconFaceSmileCircleFill: <IconFaceSmileCircleFill />,
  IconTrashcanFill: <IconTrashcanFill />,
  IconPencilFill: <IconPencilFill />,
  IconGearFill: <IconGearFill />,
  IconCheckmarkFill: <IconCheckmarkFill />,
  IconXmarkFill: <IconXmarkFill />,
  IconExclamationmarkCircleFill: <IconExclamationmarkCircleFill />,
  IconQuestionmarkCircleFill: <IconQuestionmarkCircleFill />,
  IconILowercaseSerifCircleFill: <IconILowercaseSerifCircleFill />,
  IconEyeFill: <IconEyeFill />,
  IconEyeSlashFill: <IconEyeSlashFill />,
  IconClockFill: <IconClockFill />,
  IconCalendarFill: <IconCalendarFill />,
  IconLocationpinFill: <IconLocationpinFill />,
  IconGiftFill: <IconGiftFill />,
  IconTagFill: <IconTagFill />,
} satisfies Record<string, ReactElement>;

export const lineIconSet = {
  IconPlusLine: <IconPlusLine />,
  IconBellLine: <IconBellLine />,
  IconHeartLine: <IconHeartLine />,
  IconStarLine: <IconStarLine />,
  IconBookmarkLine: <IconBookmarkLine />,
  IconChevronRightLine: <IconChevronRightLine />,
  IconChevronDownLine: <IconChevronDownLine />,
  IconMagnifyingglassLine: <IconMagnifyingglassLine />,
  IconPersonCircleLine: <IconPersonCircleLine />,
  IconFaceSmileCircleLine: <IconFaceSmileCircleLine />,
  IconTrashcanLine: <IconTrashcanLine />,
  IconPencilLine: <IconPencilLine />,
  IconGearLine: <IconGearLine />,
  IconCheckmarkLine: <IconCheckmarkLine />,
  IconXmarkLine: <IconXmarkLine />,
  IconExclamationmarkCircleLine: <IconExclamationmarkCircleLine />,
  IconQuestionmarkCircleLine: <IconQuestionmarkCircleLine />,
  IconILowercaseSerifCircleLine: <IconILowercaseSerifCircleLine />,
  IconEyeLine: <IconEyeLine />,
  IconEyeSlashLine: <IconEyeSlashLine />,
  IconClockLine: <IconClockLine />,
  IconCalendarLine: <IconCalendarLine />,
  IconLocationpinLine: <IconLocationpinLine />,
  IconGiftLine: <IconGiftLine />,
  IconTagLine: <IconTagLine />,
} satisfies Record<string, ReactElement>;

export type FillIconName = keyof typeof fillIconSet;
export type LineIconName = keyof typeof lineIconSet;

/**
 * Sentinel for an optional icon control's "no icon" choice. Add it to a story's
 * icon union (`OptionalFillIconName` / `OptionalLineIconName`) when the slot is
 * optional — e.g. an ActionButton prefix/suffix composed into `children` — and
 * arg-form renders it as a glyph-less "None" chip. Leave it out to keep the icon
 * required (FAB-style slots always show one). `resolveStoryIcon` returns
 * undefined for it, so a wrapper renders nothing when it is selected.
 */
export const NO_ICON = "none";
export type OptionalFillIconName = typeof NO_ICON | FillIconName;
export type OptionalLineIconName = typeof NO_ICON | LineIconName;

const storyIconSet: Record<string, ReactElement> = { ...fillIconSet, ...lineIconSet };

/**
 * Resolves a selected icon-control key back to its element. Returns undefined for
 * non-icon enum values, which is how arg-form.tsx tells an icon enum apart from
 * an ordinary one (tone/size/variant): an enum is an icon picker only when every
 * member resolves here.
 */
export const resolveStoryIcon = (name: string): ReactElement | undefined => storyIconSet[name];

/** `IconChevronRightFill` -> `Chevron Right` for the chip label. */
export const prettifyIconName = (name: string) =>
  name
    .replace(/^Icon/, "")
    .replace(/(Fill|Line)$/, "")
    .replace(/([a-z])([A-Z])/g, "$1 $2");
