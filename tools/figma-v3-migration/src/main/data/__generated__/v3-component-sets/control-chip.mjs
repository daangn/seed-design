export const metadata = {
  "name": "🟢 Control Chip",
  "key": "5780d56fc2f9bc4bbd6bc3db93949d8a8b7b7563",
  "componentPropertyDefinitions": {
    "Label#7185:0": {
      "type": "TEXT",
      "defaultValue": "라벨"
    },
    "Count#7185:21": {
      "type": "TEXT",
      "defaultValue": "10"
    },
    "Show Count#7185:42": {
      "type": "BOOLEAN",
      "defaultValue": false
    },
    "Prefix Icon#8722:0": {
      "type": "INSTANCE_SWAP",
      "defaultValue": "26621:20914",
      "preferredValues": [
        {
          "type": "COMPONENT_SET",
          "key": "8ed05ef62a40f2dc034ee7eb6945bd0e63ad49aa"
        }
      ]
    },
    "Icon#8722:41": {
      "type": "INSTANCE_SWAP",
      "defaultValue": "26621:24682",
      "preferredValues": []
    },
    "Suffix Icon#8722:82": {
      "type": "INSTANCE_SWAP",
      "defaultValue": "26621:23688",
      "preferredValues": []
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
        "Disabled",
        "Selected",
        "Selected-Pressed",
        "Selected-Disabled"
      ]
    }
  }
};
