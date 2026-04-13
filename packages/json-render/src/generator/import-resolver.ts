interface ImportSource {
  module: string;
  named: string[];
}

const SNIPPET_IMPORTS: Record<string, { module: string; exportName: string }> = {
  ActionButton: { module: "./action-button", exportName: "ActionButton" },
  TextField: { module: "./text-field", exportName: "TextField" },
  TextFieldInput: { module: "./text-field", exportName: "TextFieldInput" },
  TextFieldTextarea: { module: "./text-field", exportName: "TextFieldTextarea" },
  Checkbox: { module: "./checkbox", exportName: "Checkbox" },
  CheckboxGroup: { module: "./checkbox", exportName: "CheckboxGroup" },
  Switch: { module: "./switch", exportName: "Switch" },
  RadioGroup: { module: "./radio-group", exportName: "RadioGroup" },
  RadioGroupItem: { module: "./radio-group", exportName: "RadioGroupItem" },
  RadioSelectBoxRoot: { module: "./select-box", exportName: "RadioSelectBoxRoot" },
  RadioSelectBoxItem: { module: "./select-box", exportName: "RadioSelectBoxItem" },
  CheckSelectBoxGroup: { module: "./select-box", exportName: "CheckSelectBoxGroup" },
  CheckSelectBox: { module: "./select-box", exportName: "CheckSelectBox" },
  TabsRoot: { module: "./tabs", exportName: "TabsRoot" },
  TabsList: { module: "./tabs", exportName: "TabsList" },
  TabsTrigger: { module: "./tabs", exportName: "TabsTrigger" },
  TabsContent: { module: "./tabs", exportName: "TabsContent" },
  AlertDialogRoot: { module: "./alert-dialog", exportName: "AlertDialogRoot" },
  AlertDialogContent: { module: "./alert-dialog", exportName: "AlertDialogContent" },
  AlertDialogHeader: { module: "./alert-dialog", exportName: "AlertDialogHeader" },
  AlertDialogTitle: { module: "./alert-dialog", exportName: "AlertDialogTitle" },
  AlertDialogDescription: { module: "./alert-dialog", exportName: "AlertDialogDescription" },
  AlertDialogFooter: { module: "./alert-dialog", exportName: "AlertDialogFooter" },
  AlertDialogAction: { module: "./alert-dialog", exportName: "AlertDialogAction" },
  Avatar: { module: "./avatar", exportName: "Avatar" },
  Callout: { module: "./callout", exportName: "Callout" },
};

const PACKAGE_IMPORTS: Record<string, { module: string; exportName: string }> = {
  Box: { module: "@seed-design/react", exportName: "Box" },
  VStack: { module: "@seed-design/react", exportName: "VStack" },
  HStack: { module: "@seed-design/react", exportName: "HStack" },
  Text: { module: "@seed-design/react", exportName: "Text" },
  Badge: { module: "@seed-design/react", exportName: "Badge" },
};

export function resolveImports(componentTypes: Set<string>): ImportSource[] {
  const moduleMap = new Map<string, Set<string>>();

  for (const type of componentTypes) {
    const snippetEntry = SNIPPET_IMPORTS[type];
    const packageEntry = PACKAGE_IMPORTS[type];
    const entry = snippetEntry ?? packageEntry;
    if (!entry) continue;

    const existing = moduleMap.get(entry.module);
    if (existing) {
      existing.add(entry.exportName);
    } else {
      moduleMap.set(entry.module, new Set([entry.exportName]));
    }
  }

  const result: ImportSource[] = [];

  // Package imports first, then snippet imports (sorted alphabetically)
  const sortedModules = [...moduleMap.entries()].sort(([a], [b]) => {
    const aIsPackage = a.startsWith("@");
    const bIsPackage = b.startsWith("@");
    if (aIsPackage && !bIsPackage) return -1;
    if (!aIsPackage && bIsPackage) return 1;
    return a.localeCompare(b);
  });

  for (const [module, names] of sortedModules) {
    result.push({ module, named: [...names].sort() });
  }

  return result;
}
