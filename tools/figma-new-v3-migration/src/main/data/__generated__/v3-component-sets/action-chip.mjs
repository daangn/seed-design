export const metadata = {
  "name": "🟢 Action Chip",
  "key": "3d21594ef116e94a9465d507447b858aea062575",
  "componentPropertyDefinitions": {
    "Icon#8714:0": {
      "type": "INSTANCE_SWAP",
      "defaultValue": "17019:3007",
      "preferredValues": []
    },
    "Prefix Icon#8711:0": {
      "type": "INSTANCE_SWAP",
      "defaultValue": "17019:3006",
      "preferredValues": [
        {
          "type": "COMPONENT_SET",
          "key": "8ed05ef62a40f2dc034ee7eb6945bd0e63ad49aa"
        }
      ]
    },
    "Suffix Icon#8711:3": {
      "type": "INSTANCE_SWAP",
      "defaultValue": "17024:98688",
      "preferredValues": []
    },
    "Label#7185:0": {
      "type": "TEXT",
      "defaultValue": "라벨"
    },
    "Show Count#7185:42": {
      "type": "BOOLEAN",
      "defaultValue": false
    },
    "Count#7185:21": {
      "type": "TEXT",
      "defaultValue": "10"
    },
    "Size": {
      "type": "VARIANT",
      "defaultValue": "Medium",
      "variantOptions": [
        "Medium",
        "Small"
      ]
    },
    "Layout": {
      "type": "VARIANT",
      "defaultValue": "Text Only",
      "variantOptions": [
        "Text Only",
        "Icon First",
        "Icon Last",
        "Icon Both",
        "Icon Only"
      ]
    },
    "State": {
      "type": "VARIANT",
      "defaultValue": "Enabled",
      "variantOptions": [
        "Enabled",
        "Pressed",
        "Disabled"
      ]
    }
  }
};
