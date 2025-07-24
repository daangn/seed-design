import * as React from "react";
import { EditorToolbar, EditorToolbarItem, PrefixIcon, Icon } from "@/registry/ui/editor-toolbar";
import { 
  IconBold,
  IconItalic,
  IconUnderline,
  IconStrikethrough,
  IconLink,
  IconListBulleted,
  IconListNumbered,
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconPhoto,
  IconVideoCamera,
  IconAttachment,
  IconEmoticon,
} from "@karrotmarket/react-monochrome-icon";

export default function EditorToolbarPreview() {
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);

  const toggleSelection = (item: string) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  return (
    <EditorToolbar showKeyboard={false}>
      <EditorToolbarItem
        selected={selectedItems.includes("bold")}
        onClick={() => toggleSelection("bold")}
      >
        <PrefixIcon svg={<IconBold />} />
        굵게
      </EditorToolbarItem>
      <EditorToolbarItem
        selected={selectedItems.includes("italic")}
        onClick={() => toggleSelection("italic")}
      >
        <PrefixIcon svg={<IconItalic />} />
        기울임
      </EditorToolbarItem>
      <EditorToolbarItem
        selected={selectedItems.includes("underline")}
        onClick={() => toggleSelection("underline")}
      >
        <PrefixIcon svg={<IconUnderline />} />
        밑줄
      </EditorToolbarItem>
      <EditorToolbarItem
        selected={selectedItems.includes("strikethrough")}
        onClick={() => toggleSelection("strikethrough")}
      >
        <PrefixIcon svg={<IconStrikethrough />} />
        취소선
      </EditorToolbarItem>
      <EditorToolbarItem
        selected={selectedItems.includes("link")}
        onClick={() => toggleSelection("link")}
      >
        <PrefixIcon svg={<IconLink />} />
        링크
      </EditorToolbarItem>
      <EditorToolbarItem
        selected={selectedItems.includes("bullet")}
        onClick={() => toggleSelection("bullet")}
      >
        <PrefixIcon svg={<IconListBulleted />} />
        목록
      </EditorToolbarItem>
      <EditorToolbarItem
        selected={selectedItems.includes("number")}
        onClick={() => toggleSelection("number")}
      >
        <PrefixIcon svg={<IconListNumbered />} />
        번호
      </EditorToolbarItem>
    </EditorToolbar>
  );
}