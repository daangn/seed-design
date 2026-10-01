import { useState } from "@lynx-js/react";
import { Sortable } from "@seed-design/lynx-react-sortable";

type Card = { id: string; label: string; color: string };

const INITIAL_CARDS: Card[] = [
  { id: "sunset", label: "노을", color: "#ff7a45" },
  { id: "city", label: "도시", color: "#2f54eb" },
  { id: "coffee", label: "커피", color: "#8c5a3c" },
  { id: "forest", label: "숲", color: "#389e0d" },
  { id: "sea", label: "바다", color: "#13c2c2" },
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
    <view style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "16px" }}>
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
                        backgroundColor: card.color,
                        opacity: itemDragging ? 0.8 : 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <text style={{ color: "#ffffff", fontSize: "16px" }}>{card.label}</text>
                    </view>
                  )}
                </Sortable.Item>
              ))}
            </view>
          </scroll-view>
        )}
      </Sortable.Root>
      <text style={{ fontSize: "14px", color: "#555d6d" }}>
        {cards.map((card) => card.label).join(" · ")}
      </text>
    </view>
  );
}
