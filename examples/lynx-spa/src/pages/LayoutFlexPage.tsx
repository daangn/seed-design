import { Flex, Box } from '@seed-design/lynx-react';

function ColorBox({
  label,
  bg = 'bg.brandWeak',
}: {
  label: string;
  bg?: string;
}) {
  return (
    <Box bg={bg} px="x3" py="x2" borderRadius="r1">
      <text>{label}</text>
    </Box>
  );
}

export function LayoutFlexPage() {
  return (
    <scroll-view
      scroll-y
      style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}
    >
      <text style={{ fontSize: '20px', fontWeight: 'bold' }}>Flex</text>

      <text style={{ fontSize: '16px', fontWeight: 'bold' }}>
        Direction: Row (default)
      </text>
      <Flex direction="row" gap="x2">
        <ColorBox label="A" />
        <ColorBox label="B" />
        <ColorBox label="C" />
      </Flex>

      <text style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '8px' }}>
        Direction: Column
      </text>
      <Flex direction="column" gap="x2">
        <ColorBox label="A" />
        <ColorBox label="B" />
        <ColorBox label="C" />
      </Flex>

      <text style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '8px' }}>
        Align & Justify
      </text>
      <Flex
        direction="row"
        gap="x2"
        justify="space-between"
        align="center"
        bg="bg.neutralWeak"
        p="x3"
        borderRadius="r2"
      >
        <ColorBox label="Start" />
        <ColorBox label="Center" bg="bg.criticalWeak" />
        <ColorBox label="End" />
      </Flex>

      <text style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '8px' }}>
        Justify: Center
      </text>
      <Flex
        direction="row"
        gap="x2"
        justify="center"
        bg="bg.neutralWeak"
        p="x3"
        borderRadius="r2"
      >
        <ColorBox label="A" />
        <ColorBox label="B" />
      </Flex>

      <text style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '8px' }}>
        Wrap
      </text>
      <Flex
        direction="row"
        gap="x2"
        wrap="wrap"
        bg="bg.neutralWeak"
        p="x3"
        borderRadius="r2"
      >
        <ColorBox label="Item 1" />
        <ColorBox label="Item 2" />
        <ColorBox label="Item 3" />
        <ColorBox label="Item 4" />
        <ColorBox label="Item 5" />
        <ColorBox label="Item 6" />
      </Flex>

      <text style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '8px' }}>
        Grow
      </text>
      <Flex direction="row" gap="x2">
        <Box bg="bg.brandWeak" px="x3" py="x2" borderRadius="r1" flexGrow={1}>
          <text>grow=1</text>
        </Box>
        <Box
          bg="bg.criticalWeak"
          px="x3"
          py="x2"
          borderRadius="r1"
          flexGrow={2}
        >
          <text>grow=2</text>
        </Box>
      </Flex>
    </scroll-view>
  );
}
