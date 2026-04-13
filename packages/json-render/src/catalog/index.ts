import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";

import { actionButtonSchema, actionButtonDescription } from "./schemas/action-button";
import {
  alertDialogActionDescription,
  alertDialogActionSchema,
  alertDialogContentDescription,
  alertDialogContentSchema,
  alertDialogDescriptionDescription,
  alertDialogDescriptionSchema,
  alertDialogFooterDescription,
  alertDialogFooterSchema,
  alertDialogHeaderDescription,
  alertDialogHeaderSchema,
  alertDialogRootDescription,
  alertDialogRootSchema,
  alertDialogTitleDescription,
  alertDialogTitleSchema,
} from "./schemas/alert-dialog";
import { avatarDescription, avatarSchema } from "./schemas/avatar";
import { badgeDescription, badgeSchema } from "./schemas/badge";
import { calloutDescription, calloutSchema } from "./schemas/callout";
import {
  checkboxDescription,
  checkboxGroupDescription,
  checkboxGroupSchema,
  checkboxSchema,
} from "./schemas/checkbox";
import {
  boxDescription,
  boxSchema,
  hStackDescription,
  hStackSchema,
  vStackDescription,
  vStackSchema,
} from "./schemas/layout";
import {
  radioGroupDescription,
  radioGroupItemDescription,
  radioGroupItemSchema,
  radioGroupSchema,
} from "./schemas/radio-group";
import {
  checkSelectBoxDescription,
  checkSelectBoxGroupDescription,
  checkSelectBoxGroupSchema,
  checkSelectBoxSchema,
  radioSelectBoxItemDescription,
  radioSelectBoxItemSchema,
  radioSelectBoxRootDescription,
  radioSelectBoxRootSchema,
} from "./schemas/select-box";
import { switchDescription, switchSchema } from "./schemas/switch";
import {
  tabsContentDescription,
  tabsContentSchema,
  tabsListDescription,
  tabsListSchema,
  tabsRootDescription,
  tabsRootSchema,
  tabsTriggerDescription,
  tabsTriggerSchema,
} from "./schemas/tabs";
import { textDescription, textSchema } from "./schemas/text";
import {
  textFieldDescription,
  textFieldInputDescription,
  textFieldInputSchema,
  textFieldSchema,
  textFieldTextareaDescription,
  textFieldTextareaSchema,
} from "./schemas/text-field";

export const seedCatalog = defineCatalog(schema, {
  actions: {},
  components: {
    // Layout
    Box: { props: boxSchema, description: boxDescription },
    VStack: { props: vStackSchema, description: vStackDescription },
    HStack: { props: hStackSchema, description: hStackDescription },
    Text: { props: textSchema, description: textDescription },

    // Action
    ActionButton: { props: actionButtonSchema, description: actionButtonDescription },

    // Form - TextField
    TextField: { props: textFieldSchema, description: textFieldDescription },
    TextFieldInput: { props: textFieldInputSchema, description: textFieldInputDescription },
    TextFieldTextarea: {
      props: textFieldTextareaSchema,
      description: textFieldTextareaDescription,
    },

    // Form - Checkbox
    CheckboxGroup: { props: checkboxGroupSchema, description: checkboxGroupDescription },
    Checkbox: { props: checkboxSchema, description: checkboxDescription },

    // Form - Switch
    Switch: { props: switchSchema, description: switchDescription },

    // Form - RadioGroup
    RadioGroup: { props: radioGroupSchema, description: radioGroupDescription },
    RadioGroupItem: { props: radioGroupItemSchema, description: radioGroupItemDescription },

    // Form - SelectBox
    RadioSelectBoxRoot: {
      props: radioSelectBoxRootSchema,
      description: radioSelectBoxRootDescription,
    },
    RadioSelectBoxItem: {
      props: radioSelectBoxItemSchema,
      description: radioSelectBoxItemDescription,
    },
    CheckSelectBoxGroup: {
      props: checkSelectBoxGroupSchema,
      description: checkSelectBoxGroupDescription,
    },
    CheckSelectBox: { props: checkSelectBoxSchema, description: checkSelectBoxDescription },

    // Tabs (compound)
    TabsRoot: { props: tabsRootSchema, description: tabsRootDescription },
    TabsList: { props: tabsListSchema, description: tabsListDescription },
    TabsTrigger: { props: tabsTriggerSchema, description: tabsTriggerDescription },
    TabsContent: { props: tabsContentSchema, description: tabsContentDescription },

    // AlertDialog (compound)
    AlertDialogRoot: { props: alertDialogRootSchema, description: alertDialogRootDescription },
    AlertDialogContent: {
      props: alertDialogContentSchema,
      description: alertDialogContentDescription,
    },
    AlertDialogHeader: {
      props: alertDialogHeaderSchema,
      description: alertDialogHeaderDescription,
    },
    AlertDialogTitle: {
      props: alertDialogTitleSchema,
      description: alertDialogTitleDescription,
    },
    AlertDialogDescription: {
      props: alertDialogDescriptionSchema,
      description: alertDialogDescriptionDescription,
    },
    AlertDialogFooter: {
      props: alertDialogFooterSchema,
      description: alertDialogFooterDescription,
    },
    AlertDialogAction: {
      props: alertDialogActionSchema,
      description: alertDialogActionDescription,
    },

    // Display
    Avatar: { props: avatarSchema, description: avatarDescription },
    Badge: { props: badgeSchema, description: badgeDescription },
    Callout: { props: calloutSchema, description: calloutDescription },
  },
});
