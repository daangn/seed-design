// @ts-nocheck

const BannerIcon = styled("div", {
  flex: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  margin: "0 10px 0 0",

  variants: {
    theme: {
      blue: {
        background: "$palette-blue-600",
        color: "$palette-static-white",
      },
      carrot: {
        background: "$palette-carrot-600",
        color: "$palette-static-black",
      },
      green: {
        background: "$palette-green-600",
        color: "$palette-static-black",
      },
    },
  },
});

const Text = styled("div", {
  color: "$palette-gray-800",
  margin: "0 8px 0 6px",
  $text: "caption1Bold",
});

const CashContainer = styled("div", {
  background: "$palette-gray-200",
  borderRadius: "6px",
  border: "1px solid $stroke-neutral-subtle",
  padding: "16px",
  margin: "16px",
});

const Container = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "10px 16px",

  position: "relative",
  "&:before": {
    content: "",
    position: "absolute",
    left: 0,
    width: "100%",
    height: "100%",
    background: "transparent",
    boxSizing: "border-box",
    borderBottom: "1px solid $stroke-neutral-subtle",
  },

  variants: {
    isTopOnDocument: {
      true: {
        background: "$bg-layer-default",
      },
      false: {
        background: "$bg-layer-fill",
      },
    },
    achievement: {
      pro: {
        background: "linear-gradient(180deg, $palette-blue-100 0%, $bg-layer-default 100%)",
      },
      master: {
        background: "linear-gradient(180deg, $palette-yellow-100 0%, $bg-layer-default 100%)",
      },
    },
  },

  defaultVariants: {
    isTopOnDocument: true,
  },
});

function generateCompoundVariants() {
  const priorities = ["primary", "primaryLow", "secondary", "text"] as const;

  return priorities.map((priority) => ({
    priority,
    disabled: true,
    css: {
      background: "$palette-gray-400",
      color: "$palette-gray-600",
    },
  }));
}
