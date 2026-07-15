"use client";

import { type ComponentProps, type HTMLAttributes, type ReactNode } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  FieldKey,
  useArray,
  useDataEngine,
  useFieldValue,
  useNamespace,
  useObject,
} from "@fumari/stf";
import { Icon, ScrollFog } from "@seed-design/react";
import { Input } from "./input";
import { ActionButton } from "seed-design/ui/action-button";
import { Chip } from "seed-design/ui/chip";
import { NO_ICON, prettifyIconName, resolveStoryIcon } from "./icon-set";
import { Switch } from "seed-design/ui/switch";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";
// Import runtime helpers from the client-safe type-tree submodules (like upstream's
// own client arg-form) instead of the barrel, whose `builder.js` re-export drags
// `ts-morph` (a Node-only compiler) into the browser bundle. Types stay on the barrel
// since `import type` is erased at build time.
import { getDefaultValue } from "@fumadocs/story/type-tree/sampler";
import { FormatFlags, typeToString } from "@fumadocs/story/type-tree/stringify";
import { validate } from "@fumadocs/story/type-tree/validator";
import type { ObjectNode, TypeNode } from "@fumadocs/story/type-tree";
import { cn } from "./cn";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { stringifyFieldKey } from "@fumari/stf/lib/utils";
import { formatDateForInput } from "./date";
import { cva } from "class-variance-authority";
import { useTranslations } from "@fuma-translate/react";

const labelVariants = cva(
  "text-xs font-mono font-medium text-fd-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

// Literal-enum member labels are JSON.stringify'd by the type-tree builder
// (e.g. `"outline"`), so strip the wrapping quotes for display.
const unquote = (label: string) => label.replace(/^"(.*)"$/, "$1");

function FieldLabel(props: ComponentProps<"label">) {
  return (
    <label {...props} className={cn("w-full inline-flex items-center gap-0.5", props.className)}>
      {props.children}
    </label>
  );
}

function FieldLabelRequired() {
  return <span className="text-red-400/80 mx-1">*</span>;
}

function FieldLabelType(props: ComponentProps<"code">) {
  return (
    <code {...props} className={cn("text-xs text-fd-muted-foreground", props.className)}>
      {props.children}
    </code>
  );
}

export function ObjectInput({
  field: node,
  fieldName,
  ...props
}: {
  field: ObjectNode;
  fieldName: FieldKey;
} & ComponentProps<"div">) {
  const { properties } = useObject(fieldName, {
    defaultValue: () => getDefaultValue(node) as object,
    properties: Object.fromEntries(node.properties.map((prop) => [prop.name, prop.type])),
  });

  return (
    <div {...props} className={cn("grid grid-cols-1 gap-4", props.className)}>
      {properties.map((child) => {
        const prop = node.properties.find((p) => p.name === child.key);
        if (!prop) return null;

        return (
          <FieldSet
            key={child.key}
            name={child.key}
            field={prop.type}
            fieldName={child.field}
            isRequired={prop.required}
          />
        );
      })}
    </div>
  );
}

export function FieldInput({
  field,
  fieldName,
  isRequired,
  ...props
}: HTMLAttributes<HTMLElement> & {
  field: TypeNode;
  isRequired?: boolean;
  fieldName: FieldKey;
}) {
  const engine = useDataEngine();
  const t = useTranslations({ note: "story arguments form" });
  const [value, setValue] = useFieldValue(fieldName);
  const id = stringifyFieldKey(fieldName);

  function renderUnset(children: ReactNode) {
    return (
      <div {...props} className={cn("flex flex-row gap-2", props.className)}>
        {children}
        {value !== undefined && !isRequired && (
          // Same height as the medium TextField (both --seed-dimension-x10, 40px).
          <ActionButton
            size="medium"
            variant="neutralWeak"
            type="button"
            onClick={() => engine.delete(fieldName)}
          >
            {t("Unset")}
          </ActionButton>
        )}
      </div>
    );
  }

  if (
    field.type === "null" ||
    field.type === "undefined" ||
    field.type === "never" ||
    field.type === "unknown" ||
    field.type === "literal"
  ) {
    return null;
  }

  // A Switch is binary, so an optional boolean collapses to on/off. The engine is
  // seeded with the prop's `@default` (via the controls loader), so the Switch
  // reflects the real default. SEED boolean props arrive as a `true | false`
  // literal enum (see the type-tree builder's literalEnumHandler), so treat those
  // the same as a plain boolean node.
  const isBooleanEnum =
    field.type === "enum" &&
    field.members.length > 0 &&
    field.members.every((m) => typeof m.value === "boolean");

  if (field.type === "boolean" || isBooleanEnum) {
    return (
      <Switch
        size="16"
        inputProps={{ id }}
        checked={value === true}
        onCheckedChange={(checked) => setValue(checked)}
      />
    );
  }

  if (field.type === "enum") {
    // RadioGroup values are strings, so members map to their index. The engine is
    // seeded with the prop's `@default`, so the matching chip is preselected.
    const idx = field.members.findIndex((m) => m.value === value);
    const selected = String(idx >= 0 ? idx : 0);

    // An icon enum (a story exposing an icon slot as fill/line set keys) renders
    // the actual glyph as a chip prefix, with a cleaned-up name as the label. It
    // is detected — not tagged — by every member resolving to a known icon (or the
    // `NO_ICON` sentinel of an optional slot, rendered as an "Unset" chip), so
    // ordinary enums (tone/size/variant) are untouched.
    const isIconEnum =
      field.members.some((m) => resolveStoryIcon(String(m.value))) &&
      field.members.every((m) => resolveStoryIcon(String(m.value)) || String(m.value) === NO_ICON);

    // Chips never wrap — the row scrolls horizontally with a fog on both edges.
    // `min-w-0` lets the fog shrink to the field column so the row scrolls inside
    // it instead of widening the whole props panel.
    return (
      <ScrollFog placement={["left", "right"]} size={16} hideScrollBar className="min-w-0">
        <Chip.RadioRoot
          id={id}
          aria-label={stringifyFieldKey(fieldName)}
          value={selected}
          onValueChange={(next) => {
            const i = Number(next);
            if (i >= 0 && i < field.members.length) setValue(field.members[i]!.value);
          }}
          className="flex w-max flex-row gap-1.5"
        >
          {field.members.map((member, i) => (
            <Chip.RadioItem
              key={String(member.value)}
              value={String(i)}
              variant="outlineWeak"
              size="small"
            >
              {isIconEnum && resolveStoryIcon(String(member.value)) && (
                <Chip.PrefixIcon>
                  <Icon svg={resolveStoryIcon(String(member.value))} />
                </Chip.PrefixIcon>
              )}
              <Chip.Label>
                {isIconEnum
                  ? String(member.value) === NO_ICON
                    ? t("Unset")
                    : prettifyIconName(String(member.value))
                  : unquote(member.label)}
              </Chip.Label>
            </Chip.RadioItem>
          ))}
        </Chip.RadioRoot>
      </ScrollFog>
    );
  }
  if (field.type === "date") {
    return renderUnset(
      <Input
        id={id}
        placeholder={t("Enter date")}
        type="date"
        value={value instanceof Date ? formatDateForInput(value) : ""}
        onChange={(e) => {
          setValue(e.target.valueAsDate ?? undefined);
        }}
      />,
    );
  }

  return renderUnset(
    <TextField
      size="medium"
      value={String(value ?? "")}
      onValueChange={({ value: next }) => {
        if (field.type === "bigint") {
          try {
            setValue(BigInt(next));
          } catch {
            setValue(undefined);
          }
        } else if (field.type === "number") {
          const parsed = next === "" ? Number.NaN : Number(next);
          setValue(Number.isNaN(parsed) ? undefined : parsed);
        } else {
          setValue(next);
        }
      }}
      className="flex-1"
    >
      <TextFieldInput
        id={id}
        aria-label={id}
        type={field.type === "number" || field.type === "bigint" ? "number" : "text"}
        placeholder={
          field.type === "number"
            ? t("Enter number")
            : field.type === "bigint"
              ? t("Enter bigint")
              : t("Enter text")
        }
      />
    </TextField>,
  );
}

export function FieldSet({
  depth = 0,
  field: _field,
  fieldName,
  toolbar,
  name,
  isRequired,
  slotType,
  ...rest
}: HTMLAttributes<HTMLElement> & {
  isRequired?: boolean;
  name?: ReactNode;
  field: TypeNode;
  fieldName: FieldKey;
  depth?: number;

  slotType?: ReactNode;
  toolbar?: ReactNode;
}) {
  const field = _field.type === "intersection" ? _field.intersection : _field;
  const { info, updateInfo } = useFieldInfo(fieldName, field, depth);
  const id = stringifyFieldKey(fieldName);

  if (field.type === "never") return;

  if (field.type === "union") {
    const showSelect = field.types.length > 1;
    const selectedType = field.types[info.unionIndex] ?? field.types[0]!;

    return (
      <FieldSet
        {...rest}
        name={name}
        depth={depth + 1}
        fieldName={fieldName}
        isRequired={isRequired}
        field={selectedType}
        slotType={showSelect ? false : slotType}
        toolbar={
          <>
            {showSelect && (
              <select
                className="text-xs font-mono"
                value={info.unionIndex}
                onChange={(e) => {
                  updateInfo({
                    unionIndex: Number(e.target.value),
                  });
                }}
              >
                {field.types.map((item, i) => (
                  <option key={i} value={i} className="bg-fd-popover text-fd-popover-foreground">
                    {typeToString(item, FormatFlags.UseAlias)}
                  </option>
                ))}
              </select>
            )}
            {toolbar}
          </>
        }
      />
    );
  }

  if (field.type === "object") {
    return (
      <fieldset
        {...rest}
        className={cn("flex flex-col gap-1.5 col-span-full min-w-0", rest.className)}
      >
        <FieldLabel htmlFor={id}>
          <span className={cn(labelVariants(), "me-auto")}>
            {name}
            {isRequired && <FieldLabelRequired />}
          </span>
          {slotType ?? <FieldLabelType>{typeToString(field)}</FieldLabelType>}
          {toolbar}
        </FieldLabel>
        <ObjectInput
          field={field}
          fieldName={fieldName}
          className="rounded-lg border border-fd-primary/20 bg-fd-background/50 p-2 shadow-sm"
        />
      </fieldset>
    );
  }

  if (field.type === "array") {
    return (
      <fieldset
        {...rest}
        className={cn("flex flex-col gap-1.5 col-span-full min-w-0", rest.className)}
      >
        <FieldLabel htmlFor={id}>
          <span className={cn(labelVariants(), "me-auto")}>
            {name}
            {isRequired && <FieldLabelRequired />}
          </span>
          {slotType ?? <FieldLabelType>{typeToString(field)}</FieldLabelType>}
          {toolbar}
        </FieldLabel>
        <ArrayInput
          fieldName={fieldName}
          items={field.elementType}
          className="rounded-lg border border-fd-primary/20 bg-fd-background/50 p-2 shadow-sm"
        />
      </fieldset>
    );
  }
  return (
    <fieldset {...rest} className={cn("flex flex-col gap-1.5 min-w-0", rest.className)}>
      <FieldLabel htmlFor={id}>
        <span className={cn(labelVariants(), "me-auto")}>
          {name}
          {isRequired && <FieldLabelRequired />}
        </span>
        {slotType ?? <FieldLabelType>{typeToString(field)}</FieldLabelType>}
        {toolbar}
      </FieldLabel>
      <FieldInput field={field} fieldName={fieldName} isRequired={isRequired} />
    </fieldset>
  );
}

function ArrayInput({
  fieldName,
  items: itemType,
  ...props
}: {
  fieldName: FieldKey;
  items: TypeNode;
} & ComponentProps<"div">) {
  const t = useTranslations({ note: "story arguments form" });
  const name = fieldName.at(-1) ?? "";
  const { items, insertItem, removeItem } = useArray(fieldName, {
    defaultValue: [],
  });

  return (
    <div {...props} className={cn("flex flex-col gap-2", props.className)}>
      {items.map((item) => (
        <FieldSet
          key={item.index}
          name={
            <span className="text-fd-muted-foreground">
              {name}[{item.index}]
            </span>
          }
          field={itemType}
          isRequired
          fieldName={item.field}
          toolbar={
            <button
              type="button"
              aria-label={t("Remove Item", { note: "aria-label" })}
              className={cn(
                buttonVariants({
                  color: "outline",
                  size: "icon-xs",
                }),
              )}
              onClick={() => removeItem(item.index)}
            >
              <Trash2 />
            </button>
          }
        />
      ))}
      <button
        type="button"
        className={cn(
          buttonVariants({
            color: "secondary",
            className: "gap-1.5 py-2",
            size: "sm",
          }),
        )}
        onClick={() => {
          insertItem(getDefaultValue(itemType));
        }}
      >
        <Plus className="size-4" />
        {t("New Item")}
      </button>
    </div>
  );
}

interface FieldInfo {
  unionIndex: number;
}

/**
 * A hook to store dynamic info of a field, such as selected type in union.
 */
function useFieldInfo(
  fieldName: FieldKey,
  node: TypeNode,
  depth = 0,
): {
  info: FieldInfo;
  updateInfo: (value: Partial<FieldInfo>) => void;
} {
  const engine = useDataEngine();
  const fieldData = useNamespace({
    namespace: `field-info:${depth}:${stringifyFieldKey(fieldName)}`,
    initial(): FieldInfo {
      const out: FieldInfo = {
        unionIndex: 0,
      };

      if (node.type === "union") {
        // Try to find which union type matches the current value
        const matchingIndex = node.types.findIndex(validate);
        out.unionIndex = matchingIndex === -1 ? 0 : matchingIndex;
      }

      return out;
    },
  });
  const [info, setInfo] = useFieldValue<FieldInfo>([], {
    stf: fieldData,
  });

  return {
    info,
    updateInfo(value) {
      const updated = {
        ...info,
        ...value,
      };

      if (updated.unionIndex === info.unionIndex) return;
      setInfo(updated);
      if (node.type === "union" && node.types[updated.unionIndex]) {
        engine.update(fieldName, getDefaultValue(node.types[updated.unionIndex]));
      }
    },
  };
}
