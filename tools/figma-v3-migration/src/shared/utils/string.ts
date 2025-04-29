export function stripBeforeIcon(name: string) {
  if (!name) return name;

  if (name.includes("icon_")) {
    return name.replace(/^.*?(icon_)/, "$1");
  }

  return name;
}
