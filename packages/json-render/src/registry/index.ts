import { defineRegistry } from "@json-render/react";
import { seedCatalog } from "../catalog/index";

import { Box, VStack, HStack } from "./components/layout";
import { Text } from "./components/text";
import { ActionButton } from "./components/action-button";
import { TextField, TextFieldInput, TextFieldTextarea } from "./components/text-field";
import { CheckboxGroup, Checkbox } from "./components/checkbox";
import { Switch } from "./components/switch";
import { RadioGroup, RadioGroupItem } from "./components/radio-group";
import {
  RadioSelectBoxRoot,
  RadioSelectBoxItem,
  CheckSelectBoxGroup,
  CheckSelectBox,
} from "./components/select-box";
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from "./components/tabs";
import {
  AlertDialogRoot,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "./components/alert-dialog";
import { Avatar } from "./components/avatar";
import { Badge } from "./components/badge";
import { Callout } from "./components/callout";

export const { registry: seedRegistry } = defineRegistry(seedCatalog, {
  components: {
    // Layout
    Box,
    VStack,
    HStack,
    Text,

    // Action
    ActionButton,

    // Form - TextField
    TextField,
    TextFieldInput,
    TextFieldTextarea,

    // Form - Checkbox
    CheckboxGroup,
    Checkbox,

    // Form - Switch
    Switch,

    // Form - RadioGroup
    RadioGroup,
    RadioGroupItem,

    // Form - SelectBox
    RadioSelectBoxRoot,
    RadioSelectBoxItem,
    CheckSelectBoxGroup,
    CheckSelectBox,

    // Tabs (compound)
    TabsRoot,
    TabsList,
    TabsTrigger,
    TabsContent,

    // AlertDialog (compound)
    AlertDialogRoot,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,

    // Display
    Avatar,
    Badge,
    Callout,
  },
});
