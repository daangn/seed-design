import { EditorToolbar, EditorToolbarItem, PrefixIcon } from "@/registry/ui/editor-toolbar";
import {
  IconAUppercaseALowercaseFill,
  IconAppleFill,
  IconBUppercaseFill,
  IconILowercaseSerifCircleFill,
  IconTUppercaseSerifFill,
} from "@karrotmarket/react-monochrome-icon";
import * as React from "react";

export default function EditorToolbarPreview() {
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);

  const toggleSelection = (item: string) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  return (
    <EditorToolbar showKeyboard={false}>
      <EditorToolbarItem
        selected={selectedItems.includes("bold")}
        onClick={() => toggleSelection("bold")}
      >
        <PrefixIcon svg={<IconBUppercaseFill />} />
        굵게
      </EditorToolbarItem>
      <EditorToolbarItem
        selected={selectedItems.includes("italic")}
        onClick={() => toggleSelection("italic")}
      >
        <PrefixIcon svg={<IconILowercaseSerifCircleFill />} />
        기울임
      </EditorToolbarItem>
      <EditorToolbarItem
        selected={selectedItems.includes("underline")}
        onClick={() => toggleSelection("underline")}
      >
        <PrefixIcon svg={<IconTUppercaseSerifFill />} />
        밑줄
      </EditorToolbarItem>
      <EditorToolbarItem
        selected={selectedItems.includes("strikethrough")}
        onClick={() => toggleSelection("strikethrough")}
      >
        <PrefixIcon svg={<IconAUppercaseALowercaseFill />} />
        취소선
      </EditorToolbarItem>
      <EditorToolbarItem
        selected={selectedItems.includes("link")}
        onClick={() => toggleSelection("link")}
      >
        <PrefixIcon svg={<IconAppleFill />} />
        링크
      </EditorToolbarItem>
      <EditorToolbarItem
        selected={selectedItems.includes("bullet")}
        onClick={() => toggleSelection("bullet")}
      >
        <PrefixIcon svg={<IconAUppercaseALowercaseFill />} />
        목록
      </EditorToolbarItem>
      <EditorToolbarItem
        selected={selectedItems.includes("number")}
        onClick={() => toggleSelection("number")}
      >
        <PrefixIcon svg={<IconAUppercaseALowercaseFill />} />
        번호
      </EditorToolbarItem>
    </EditorToolbar>
  );
}
