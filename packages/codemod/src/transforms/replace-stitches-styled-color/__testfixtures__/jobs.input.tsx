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
        background: '$blue500',
        color: '$white-static',
      },
      carrot: {
        background: '$carrot500',
        color: '$gray900-static',
      },
      green: {
        background: '$green500',
        color: '$black-static',
      },
    },
  },
});

const Text = styled('div', {
  color: '$gray700',
  margin: '0 8px 0 6px',
  $text: 'caption1Bold',
})

const CashContainer = styled('div', {
  background: '$gray100',
  borderRadius: '6px',
  border: '1px solid $divider1-semantic',
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
    borderBottom: '1px solid $divider1-semantic',
  },

  variants: {
    isTopOnDocument: {
      true: {
        background: '$paperDefault-semantic',
      },
      false: {
        background: '$paperContents-semantic',
      },
    },
    achievement: {
      pro: {
        background: 'linear-gradient(180deg, $blue50 0%, $paperDefault-semantic 100%)',
      },
      master: {
        background: 'linear-gradient(180deg, $yellow50 0%, $paperDefault-semantic 100%)',
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
      background: '$gray300',
      color: '$gray500',
    },
  }))
}
