import * as React from "react";
import { EditorToolbar, EditorToolbarItem, Icon } from "@/registry/ui/editor-toolbar";
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

export default function EditorToolbarIconOnly() {
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);

  const toggleSelection = (item: string) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  return (
    <EditorToolbar showKeyboard={false}>
      <EditorToolbarItem
        layout="iconOnly"
        aria-label="굵게"
        selected={selectedItems.includes("bold")}
        onClick={() => toggleSelection("bold")}
      >
        <Icon svg={<IconBold />} />
      </EditorToolbarItem>
      <EditorToolbarItem
        layout="iconOnly"
        aria-label="기울임"
        selected={selectedItems.includes("italic")}
        onClick={() => toggleSelection("italic")}
      >
        <Icon svg={<IconItalic />} />
      </EditorToolbarItem>
      <EditorToolbarItem
        layout="iconOnly"
        aria-label="밑줄"
        selected={selectedItems.includes("underline")}
        onClick={() => toggleSelection("underline")}
      >
        <Icon svg={<IconUnderline />} />
      </EditorToolbarItem>
      <EditorToolbarItem
        layout="iconOnly"
        aria-label="취소선"
        selected={selectedItems.includes("strikethrough")}
        onClick={() => toggleSelection("strikethrough")}
      >
        <Icon svg={<IconStrikethrough />} />
      </EditorToolbarItem>
      <EditorToolbarItem
        layout="iconOnly"
        aria-label="링크"
        selected={selectedItems.includes("link")}
        onClick={() => toggleSelection("link")}
      >
        <Icon svg={<IconLink />} />
      </EditorToolbarItem>
      <EditorToolbarItem
        layout="iconOnly"
        aria-label="목록"
        selected={selectedItems.includes("bullet")}
        onClick={() => toggleSelection("bullet")}
      >
        <Icon svg={<IconListBulleted />} />
      </EditorToolbarItem>
      <EditorToolbarItem
        layout="iconOnly"
        aria-label="번호"
        selected={selectedItems.includes("number")}
        onClick={() => toggleSelection("number")}
      >
        <Icon svg={<IconListNumbered />} />
      </EditorToolbarItem>
      <EditorToolbarItem
        layout="iconOnly"
        aria-label="왼쪽 정렬"
        selected={selectedItems.includes("left")}
        onClick={() => toggleSelection("left")}
      >
        <Icon svg={<IconAlignLeft />} />
      </EditorToolbarItem>
      <EditorToolbarItem
        layout="iconOnly"
        aria-label="가운데 정렬"
        selected={selectedItems.includes("center")}
        onClick={() => toggleSelection("center")}
      >
        <Icon svg={<IconAlignCenter />} />
      </EditorToolbarItem>
      <EditorToolbarItem
        layout="iconOnly"
        aria-label="오른쪽 정렬"
        selected={selectedItems.includes("right")}
        onClick={() => toggleSelection("right")}
      >
        <Icon svg={<IconAlignRight />} />
      </EditorToolbarItem>
    </EditorToolbar>
  );
}