// @ts-nocheck

const BannerIcon = styled('div', {
  flex: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  margin: '0 10px 0 0',
  
  variants: {
    theme: {
      blue: {
        background: "$palette.blue600",
        color: "$palette.staticWhite",
      },
      carrot: {
        background: "$palette.carrot600",
        color: "$palette.staticWhite",
      },
      green: {
        background: "$palette.green600",
        color: "$palette.staticBlack",
      },
    },
  },
});

const Text = styled('div', {
  color: "$palette.gray800",
  margin: '0 8px 0 6px',
  $text: 'caption1Bold',
})

const CashContainer = styled('div', {
  background: "$palette.gray200",
  borderRadius: '6px',
  border: "1px solid $stroke.neutralMuted",
  padding: '16px',
  margin: '16px',
})

const Container = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 16px',

  position: 'relative',
  '&:before': {
    content: '',
    position: 'absolute',
    left: 0,
    width: '100%',
    height: '100%',
    background: 'transparent',
    boxSizing: 'border-box',
    borderBottom: "1px solid $stroke.neutralMuted",
  },

  variants: {
    isTopOnDocument: {
      true: {
        background: "$bg.layerDefault",
      },
      false: {
        background: "$bg.layerFill",
      },
    },
  },

  defaultVariants: {
    isTopOnDocument: true,
  },
})

function generateCompoundVariants() {
  const priorities = ['primary', 'primaryLow', 'secondary', 'text'] as const

  return priorities.map((priority) => ({
    priority,
    disabled: true,
    css: {
      background: "$palette.gray400",
      color: "$palette.gray600",
    },
  }));
}
