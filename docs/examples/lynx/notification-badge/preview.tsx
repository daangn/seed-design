import "./styles";

import { root, type ReactNode } from "@lynx-js/react";
import {
  Box,
  HStack,
  NotificationBadge,
  NotificationBadgePositioner,
  Text,
  useSeedClassName,
} from "@seed-design/lynx-react";

function IconAnchor({ children }: { children: ReactNode }) {
  return (
    <Box position="relative" width="24px" height="24px" bg="bg.neutralWeak" borderRadius="full">
      {children}
    </Box>
  );
}

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <HStack className="notification-badge-preview" gap="x8" align="center">
        <IconAnchor>
          <NotificationBadgePositioner size="small" attach="icon">
            <NotificationBadge accessibility-elements-hidden={true} />
          </NotificationBadgePositioner>
        </IconAnchor>

        <IconAnchor>
          <NotificationBadgePositioner size="large" attach="icon">
            <NotificationBadge>99+</NotificationBadge>
          </NotificationBadgePositioner>
        </IconAnchor>

        <Box position="relative">
          <Text color="fg.neutral">Inbox</Text>
          <NotificationBadgePositioner size="small" attach="text">
            <NotificationBadge accessibility-elements-hidden={true} />
          </NotificationBadgePositioner>
        </Box>
      </HStack>
    </page>
  );
}

root.render(<Root />);
