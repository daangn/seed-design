'use client';

import { Box, Flex } from '@seed-design/react';
import { useEffect, useRef, useState } from 'react';
import { ProgressCircle } from 'seed-design/ui/progress-circle';

export function LynxIframePreview() {
  const [isLoaded, setIsLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => setRendered(true), []);

  if (!rendered) return null;

  return (
    <Box
      width="360px"
      height="640px"
      position="relative"
      borderWidth={1}
      borderColor="stroke.neutralWeak"
      borderRadius="r2"
      overflowX="hidden"
      overflowY="hidden"
    >
      <iframe
        ref={iframeRef}
        src={getLynxSpaUrl()}
        title="Lynx Preview"
        onLoad={() => setIsLoaded(true)}
        style={{ width: '100%', height: '100%', border: 'none' }}
        sandbox="allow-scripts allow-same-origin"
        loading="lazy"
      />
      {!isLoaded && (
        <Flex
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          justify="center"
          align="center"
        >
          <ProgressCircle size="24" />
        </Flex>
      )}
    </Box>
  );
}

function getLynxSpaUrl(): string {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:4173';
  }

  // TODO: 배포 URL 추가
  return 'http://localhost:4173';
}
