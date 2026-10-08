import { useState } from "@lynx-js/react";
import { Sortable } from "@seed-design/lynx-react-sortable";

type Card = {
  id: string;
  label: string;
  backgroundColor: string;
  foregroundColor: string;
};

const INITIAL_CARDS: Card[] = [
  {
    id: "sunset",
    label: "노을",
    backgroundColor: "var(--seed-color-bg-brand-solid)",
    foregroundColor: "var(--seed-color-fg-on-brand-solid)",
  },
  {
    id: "city",
    label: "도시",
    backgroundColor: "var(--seed-color-bg-informative-solid)",
    foregroundColor: "var(--seed-color-fg-on-informative-solid)",
  },
  {
    id: "coffee",
    label: "커피",
    backgroundColor: "var(--seed-color-bg-warning-solid)",
    foregroundColor: "var(--seed-color-fg-on-warning-solid)",
  },
  {
    id: "forest",
    label: "숲",
    backgroundColor: "var(--seed-color-bg-positive-solid)",
    foregroundColor: "var(--seed-color-fg-on-positive-solid)",
  },
  {
    id: "sea",
    label: "바다",
    backgroundColor: "var(--seed-color-bg-neutral-solid)",
    foregroundColor: "var(--seed-color-fg-on-neutral-solid)",
  },
];

const MOVE_ACTION_LABELS = { previous: "앞으로 이동", next: "뒤로 이동" };

export default function HeadlessSortableExample() {
  const [cards, setCards] = useState(INITIAL_CARDS);

  function handleReorder(fromIndex: number, toIndex: number) {
    "background only";
    setCards((current) => {
      const next = [...current];
      const [moved] = next.splice(fromIndex, 1);
      if (moved) next.splice(toIndex, 0, moved);
      return next;
    });
  }

  return (
    <view style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
      <Sortable.Root
        items={cards}
        getItemKey={(card) => card.id}
        id="headless-sortable"
        scrollableBoundaryId="headless-sortable-scroll"
        onReorder={handleReorder}
      >
        {({ onScroll, dragging }) => (
          <scroll-view
            id="headless-sortable-scroll"
            scroll-orientation="horizontal"
            enable-scroll={!dragging}
            main-thread:bindscroll={onScroll}
            style={{ width: "100%" }}
          >
            <view style={{ display: "flex", flexDirection: "row", gap: "8px" }}>
              {cards.map((card, index) => (
                <Sortable.Item
                  key={card.id}
                  itemId={card.id}
                  index={index}
                  accessibility-element={true}
                  accessibility-label={card.label}
                  accessibility-value={`${index + 1}번째`}
                  moveActionLabels={MOVE_ACTION_LABELS}
                >
                  {(itemDragging) => (
                    <view
                      style={{
                        width: "88px",
                        height: "88px",
                        borderRadius: "12px",
                        backgroundColor: card.backgroundColor,
                        opacity: itemDragging ? 0.8 : 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <text style={{ color: card.foregroundColor, fontSize: "16px" }}>
                        {card.label}
                      </text>
                    </view>
                  )}
                </Sortable.Item>
              ))}
            </view>
          </scroll-view>
        )}
      </Sortable.Root>
      <text style={{ fontSize: "14px", color: "var(--seed-color-fg-neutral-muted)" }}>
        {cards.map((card) => card.label).join(" · ")}
      </text>
    </view>
  );
}
