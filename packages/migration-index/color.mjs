export const semanticColorMappings = [
  {
    previous: "$semantic.color.on-primary",
    next: ["$color.palette.static-white"],
  },
  {
    previous: "$semantic.color.primary",
    next: ["$color.bg.brand-solid", "$color.fg.brand"],
    alternative: ["$color.palette.carrot-600"],
  },
  {
    previous: "$semantic.color.primary-low",
    next: ["$color.palette.carrot-100"],
  },
  {
    previous: "$semantic.color.secondary",
    next: ["$color.palette.gray-900"],
  },
  {
    previous: "$semantic.color.secondary-low",
    next: ["$color.bg.neutral-weak"],
    alternative: ["$color.palette.gray-200"],
  },
  {
    previous: "$semantic.color.success",
    next: ["$color.bg.positive-solid", "$color.fg.positive"],
    alternative: ["$color.fg.positive-contrast", "$color.palette.green-700"],
  },
  {
    previous: "$semantic.color.success-low",
    next: ["$color.bg.positive-weak"],
    alternative: ["$color.palette.green-100"],
  },
  {
    previous: "$semantic.color.warning",
    next: ["$color.bg.warning-solid"],
    alternative: ["$color.fg.warning-contrast", "$color.palette.yellow-500"],
  },
  {
    previous: "$semantic.color.warning-low",
    next: ["$color.bg.warning-weak"],
    alternative: ["$color.palette.yellow-100"],
  },
  {
    previous: "$semantic.color.danger",
    next: ["$color.bg.critical-solid", "$color.fg.critical"],
    alternative: ["$color.fg.critical-contrast", "$color.palette.red-700"],
  },
  {
    previous: "$semantic.color.danger-low",
    next: ["$color.bg.critical-weak"],
    alternative: ["$color.palette.red-100"],
  },
  {
    previous: "$semantic.color.overlay-dim",
    next: ["$color.bg.overlay"],
    alternative: ["$color.palette.static-black-alpha-500"],
  },
  {
    previous: "$semantic.color.overlay-low",
    next: ["$color.bg.overlay-muted"],
    alternative: ["$color.palette.static-black-alpha-200"],
  },
  {
    previous: "$semantic.color.paper-sheet",
    next: ["$color.bg.layer-floating"],
    alternative: ["$color.palette.gray-00"],
  },
  {
    previous: "$semantic.color.paper-dialog",
    next: ["$color.bg.layer-floating"],
    alternative: ["$color.palette.gray-00"],
  },
  {
    previous: "$semantic.color.paper-floating",
    next: ["$color.bg.layer-floating"],
    alternative: ["$color.palette.gray-00"],
  },
  {
    previous: "$semantic.color.paper-contents",
    next: ["$color.bg.layer-fill"],
    alternative: ["$color.palette.gray-100"],
  },
  {
    previous: "$semantic.color.paper-default",
    next: ["$color.bg.layer-default"],
    alternative: ["$color.palette.gray-00"],
  },
  {
    previous: "$semantic.color.paper-background",
    next: ["$color.bg.layer-basement"],
    alternative: ["$color.palette.gray-200"],
  },
  {
    previous: "$semantic.color.paper-accent",
    next: ["$color.palette.carrot-100"],
  },
  {
    previous: "$semantic.color.primary-hover",
    next: ["$color.bg.brand-solid-pressed"],
    alternative: ["$color.palette.carrot-700"],
  },
  {
    previous: "$semantic.color.primary-pressed",
    next: ["$color.bg.brand-solid-pressed"],
    alternative: ["$color.palette.carrot-700"],
  },
  {
    previous: "$semantic.color.primary-low-hover",
    next: ["$color.palette.carrot-200"],
  },
  {
    previous: "$semantic.color.primary-low-active",
    next: ["$color.palette.carrot-100"],
  },
  {
    previous: "$semantic.color.primary-low-pressed",
    next: ["$color.palette.carrot-200"],
  },
  {
    previous: "$semantic.color.gray-hover",
    next: ["$color.bg.neutral-weak-pressed"],
    alternative: ["$color.palette.gray-300"],
  },
  {
    previous: "$semantic.color.gray-pressed",
    next: ["$color.bg.neutral-weak-pressed"],
    alternative: ["$color.palette.gray-300"],
  },
  {
    previous: "$semantic.color.on-primary-overlay-50",
    next: [],
    description: "V3에서 지원되지 않는 색상",
  },
  {
    previous: "$semantic.color.on-primary-overlay-200",
    next: [],
    description: "V3에서 지원되지 않는 색상",
  },
  {
    previous: "$semantic.color.on-primary-low-overlay-50",
    next: [],
    description: "V3에서 지원되지 않는 색상",
  },
  {
    previous: "$semantic.color.on-primary-low-overlay-100",
    next: [],
    description: "V3에서 지원되지 않는 색상",
  },
  {
    previous: "$semantic.color.on-primary-low-overlay-200",
    next: [],
    description: "V3에서 지원되지 않는 색상",
  },
  {
    previous: "$semantic.color.on-gray-overlay-50",
    next: ["$color.stroke.neutral-subtle"],
  },
  {
    previous: "$semantic.color.on-gray-overlay-100",
    next: [],
    description: "V3에서 지원되지 않는 색상",
  },
  {
    previous: "$semantic.color.divider-1",
    next: ["$color.stroke.neutral-subtle"],
    alternative: ["$color.palette.static-black-alpha-50"],
  },
  {
    previous: "$semantic.color.divider-2",
    next: ["$color.stroke.neutral-muted"],
    alternative: ["$color.palette.gray-300"],
  },
  {
    previous: "$semantic.color.divider-3",
    next: ["$color.palette.gray-400"],
  },
  {
    previous: "$semantic.color.accent",
    next: ["$color.bg.informative-solid", "$color.fg.informative"],
    alternative: ["$color.fg.informative-contrast", "$color.palette.blue-700"],
  },
  {
    previous: "$semantic.color.ink-text",
    next: ["$color.fg.neutral"],
    alternative: ["$color.palette.gray-1000"],
  },
  {
    previous: "$semantic.color.ink-text-low",
    next: ["$color.fg.neutral-subtle"],
    alternative: ["$color.palette.gray-700"],
  },
  {
    previous: "$semantic.color.gray-active",
    next: ["$color.fg.neutral-muted"],
    alternative: ["$color.palette.gray-800"],
  },
];

export const scaleColorMappings = [
  {
    previous: "$scale.color.gray-00",
    next: ["$color.palette.gray-00"],
  },
  {
    previous: "$scale.color.gray-50",
    next: ["$color.palette.gray-100"],
  },
  {
    previous: "$scale.color.gray-100",
    next: ["$color.palette.gray-200"],
  },
  {
    previous: "$scale.color.gray-200",
    next: ["$color.palette.gray-300"],
  },
  {
    previous: "$scale.color.gray-300",
    next: ["$color.palette.gray-400"],
  },
  {
    previous: "$scale.color.gray-400",
    next: ["$color.palette.gray-500"],
  },
  {
    previous: "$scale.color.gray-500",
    next: ["$color.palette.gray-600"],
  },
  {
    previous: "$scale.color.gray-600",
    next: ["$color.palette.gray-700"],
  },
  {
    previous: "$scale.color.gray-700",
    next: ["$color.palette.gray-800"],
  },
  {
    previous: "$scale.color.gray-800",
    next: ["$color.palette.gray-900"],
  },
  {
    previous: "$scale.color.gray-900",
    next: ["$color.palette.gray-1000"],
  },
  {
    previous: "$scale.color.gray-alpha-50",
    next: ["$color.palette.gray-200", "$color.stroke.neutral-subtle"],
  },
  {
    previous: "$scale.color.gray-alpha-100",
    next: ["$color.palette.gray-300"],
  },
  {
    previous: "$scale.color.gray-alpha-200",
    next: ["$color.palette.gray-500"],
  },
  {
    previous: "$scale.color.gray-alpha-500",
    next: ["$color.palette.gray-700"],
  },
  {
    previous: "$scale.color.carrot-50",
    next: ["$color.palette.carrot-100"],
  },
  {
    previous: "$scale.color.carrot-100",
    next: ["$color.palette.carrot-200"],
  },
  {
    previous: "$scale.color.carrot-200",
    next: ["$color.palette.carrot-300"],
  },
  {
    previous: "$scale.color.carrot-300",
    next: ["$color.palette.carrot-400"],
  },
  {
    previous: "$scale.color.carrot-400",
    next: ["$color.palette.carrot-500"],
  },
  {
    previous: "$scale.color.carrot-500",
    next: ["$color.palette.carrot-600"],
  },
  {
    previous: "$scale.color.carrot-600",
    next: ["$color.palette.carrot-600"],
  },
  {
    previous: "$scale.color.carrot-700",
    next: ["$color.palette.carrot-700"],
  },
  {
    previous: "$scale.color.carrot-800",
    next: ["$color.palette.carrot-700"],
  },
  {
    previous: "$scale.color.carrot-900",
    next: ["$color.palette.carrot-800"],
  },
  {
    previous: "$scale.color.carrot-950",
    next: ["$color.palette.carrot-800"],
  },
  {
    previous: "$scale.color.carrot-alpha-50",
    next: ["$color.palette.carrot-100"],
  },
  {
    previous: "$scale.color.carrot-alpha-100",
    next: ["$color.palette.carrot-200"],
  },
  {
    previous: "$scale.color.carrot-alpha-200",
    next: ["$color.palette.carrot-200"],
  },
  {
    previous: "$scale.color.blue-50",
    next: ["$color.palette.blue-100"],
  },
  {
    previous: "$scale.color.blue-100",
    next: ["$color.palette.blue-200"],
  },
  {
    previous: "$scale.color.blue-200",
    next: ["$color.palette.blue-300"],
  },
  {
    previous: "$scale.color.blue-300",
    next: ["$color.palette.blue-400"],
  },
  {
    previous: "$scale.color.blue-400",
    next: ["$color.palette.blue-400"],
  },
  {
    previous: "$scale.color.blue-500",
    next: ["$color.palette.blue-600"],
  },
  {
    previous: "$scale.color.blue-600",
    next: ["$color.palette.blue-600"],
  },
  {
    previous: "$scale.color.blue-700",
    next: ["$color.palette.blue-800"],
  },
  {
    previous: "$scale.color.blue-800",
    next: ["$color.palette.blue-900"],
  },
  {
    previous: "$scale.color.blue-900",
    next: ["$color.palette.blue-900"],
  },
  {
    previous: "$scale.color.blue-950",
    next: ["$color.palette.blue-1000"],
  },
  {
    previous: "$scale.color.blue-alpha-50",
    next: ["$color.palette.blue-100"],
  },
  {
    previous: "$scale.color.blue-alpha-100",
    next: ["$color.palette.blue-100"],
  },
  {
    previous: "$scale.color.blue-alpha-200",
    next: ["$color.palette.blue-200"],
  },
  {
    previous: "$scale.color.red-50",
    next: ["$color.palette.red-100"],
  },
  {
    previous: "$scale.color.red-100",
    next: ["$color.palette.red-200"],
  },
  {
    previous: "$scale.color.red-200",
    next: ["$color.palette.red-300"],
  },
  {
    previous: "$scale.color.red-300",
    next: ["$color.palette.red-400"],
  },
  {
    previous: "$scale.color.red-400",
    next: ["$color.palette.red-600"],
  },
  {
    previous: "$scale.color.red-500",
    next: ["$color.palette.red-700"],
  },
  {
    previous: "$scale.color.red-600",
    next: ["$color.palette.red-700"],
  },
  {
    previous: "$scale.color.red-700",
    next: ["$color.palette.red-800"],
  },
  {
    previous: "$scale.color.red-800",
    next: ["$color.palette.red-900"],
  },
  {
    previous: "$scale.color.red-900",
    next: ["$color.palette.red-900"],
  },
  {
    previous: "$scale.color.red-950",
    next: ["$color.palette.red-900"],
  },
  {
    previous: "$scale.color.red-alpha-50",
    next: ["$color.palette.red-100"],
  },
  {
    previous: "$scale.color.red-alpha-100",
    next: ["$color.palette.red-200"],
  },
  {
    previous: "$scale.color.red-alpha-200",
    next: ["$color.palette.red-300"],
  },
  {
    previous: "$scale.color.green-50",
    next: ["$color.palette.green-100"],
  },
  {
    previous: "$scale.color.green-100",
    next: ["$color.palette.green-200"],
  },
  {
    previous: "$scale.color.green-200",
    next: ["$color.palette.green-300"],
  },
  {
    previous: "$scale.color.green-300",
    next: ["$color.palette.green-400"],
  },
  {
    previous: "$scale.color.green-400",
    next: ["$color.palette.green-500"],
  },
  {
    previous: "$scale.color.green-500",
    next: ["$color.palette.green-600"],
  },
  {
    previous: "$scale.color.green-600",
    next: ["$color.palette.green-700"],
  },
  {
    previous: "$scale.color.green-700",
    next: ["$color.palette.green-800"],
  },
  {
    previous: "$scale.color.green-800",
    next: ["$color.palette.green-900"],
  },
  {
    previous: "$scale.color.green-900",
    next: ["$color.palette.green-900"],
  },
  {
    previous: "$scale.color.green-950",
    next: ["$color.palette.green-900"],
  },
  {
    previous: "$scale.color.green-alpha-50",
    next: ["$color.palette.green-100"],
  },
  {
    previous: "$scale.color.green-alpha-100",
    next: ["$color.palette.green-200"],
  },
  {
    previous: "$scale.color.green-alpha-200",
    next: ["$color.palette.green-200"],
  },
  {
    previous: "$scale.color.yellow-50",
    next: ["$color.palette.yellow-100"],
  },
  {
    previous: "$scale.color.yellow-100",
    next: ["$color.palette.yellow-200"],
  },
  {
    previous: "$scale.color.yellow-200",
    next: ["$color.palette.yellow-300"],
  },
  {
    previous: "$scale.color.yellow-300",
    next: ["$color.palette.yellow-400"],
  },
  {
    previous: "$scale.color.yellow-400",
    next: ["$color.palette.yellow-500"],
  },
  {
    previous: "$scale.color.yellow-500",
    next: ["$color.palette.yellow-700"],
  },
  {
    previous: "$scale.color.yellow-600",
    next: ["$color.palette.yellow-700"],
  },
  {
    previous: "$scale.color.yellow-700",
    next: ["$color.palette.yellow-800"],
  },
  {
    previous: "$scale.color.yellow-800",
    next: ["$color.palette.yellow-800"],
  },
  {
    previous: "$scale.color.yellow-900",
    next: ["$color.palette.yellow-900"],
  },
  {
    previous: "$scale.color.yellow-950",
    next: ["$color.palette.yellow-900"],
  },
  {
    previous: "$scale.color.yellow-alpha-50",
    next: ["$color.palette.yellow-100"],
  },
  {
    previous: "$scale.color.yellow-alpha-100",
    next: ["$color.palette.yellow-100"],
  },
  {
    previous: "$scale.color.yellow-alpha-200",
    next: ["$color.palette.yellow-100"],
  },
  {
    previous: "$scale.color.purple-50",
    next: ["$color.palette.purple-100"],
  },
  {
    previous: "$scale.color.purple-100",
    next: ["$color.palette.purple-300"],
  },
  {
    previous: "$scale.color.purple-200",
    next: ["$color.palette.purple-400"],
  },
  {
    previous: "$scale.color.purple-300",
    next: ["$color.palette.purple-400"],
  },
  {
    previous: "$scale.color.purple-400",
    next: ["$color.palette.purple-500"],
  },
  {
    previous: "$scale.color.purple-500",
    next: ["$color.palette.purple-600"],
  },
  {
    previous: "$scale.color.purple-600",
    next: ["$color.palette.purple-700"],
  },
  {
    previous: "$scale.color.purple-700",
    next: ["$color.palette.purple-800"],
  },
  {
    previous: "$scale.color.purple-800",
    next: ["$color.palette.purple-900"],
  },
  {
    previous: "$scale.color.purple-900",
    next: ["$color.palette.purple-900"],
  },
  {
    previous: "$scale.color.purple-950",
    next: ["$color.palette.purple-1000"],
  },
];

export const staticColorMappings = [
  {
    previous: "$static.color.static-black",
    next: ["$color.palette.static-black"],
  },
  {
    previous: "$static.color.static-white",
    next: ["$color.palette.static-white"],
  },
  {
    previous: "$static.color.static-gray-900",
    next: ["$color.palette.static-black"],
    description: "static에서 palette로 변경되는 색상으로 용도 파악 필요",
    needsVerification: true,
  },
  {
    previous: "$static.color.static-carrot-50",
    next: ["$color.palette.carrot-100"],
    description: "static에서 palette로 변경되는 색상으로 용도 파악 필요",
    needsVerification: true,
  },
  {
    previous: "$static.color.static-carrot-800",
    next: ["$color.palette.carrot-700"],
    description: "static에서 palette로 변경되는 색상으로 용도 파악 필요",
    needsVerification: true,
  },
  {
    previous: "$static.color.static-green-50",
    next: ["$color.palette.green-100"],
    description: "static에서 palette로 변경되는 색상으로 용도 파악 필요",
    needsVerification: true,
  },
  {
    previous: "$static.color.static-green-800",
    next: ["$color.palette.green-700"],
    description: "static에서 palette로 변경되는 색상으로 용도 파악 필요",
    needsVerification: true,
  },
  {
    previous: "$static.color.static-yellow-50",
    next: ["$color.palette.yellow-100"],
    description: "static에서 palette로 변경되는 색상으로 용도 파악 필요",
    needsVerification: true,
  },
  {
    previous: "$static.color.static-yellow-800",
    next: ["$color.palette.yellow-700"],
    description: "static에서 palette로 변경되는 색상으로 용도 파악 필요",
    needsVerification: true,
  },
  {
    previous: "$static.color.static-red-50",
    next: ["$color.palette.red-100"],
    description: "static에서 palette로 변경되는 색상으로 용도 파악 필요",
    needsVerification: true,
  },
  {
    previous: "$static.color.static-red-800",
    next: ["$color.palette.red-700"],
    description: "static에서 palette로 변경되는 색상으로 용도 파악 필요",
    needsVerification: true,
  },
  {
    previous: "$static.color.static-blue-50",
    next: ["$color.palette.blue-100"],
    description: "static에서 palette로 변경되는 색상으로 용도 파악 필요",
    needsVerification: true,
  },
  {
    previous: "$static.color.static-blue-800",
    next: ["$color.palette.blue-700"],
    description: "static에서 palette로 변경되는 색상으로 용도 파악 필요",
    needsVerification: true,
  },
  {
    previous: "$static.color.static-black-alpha-200",
    next: ["$color.palette.static-black-alpha-500"],
  },
  {
    previous: "$static.color.static-black-alpha-500",
    next: ["$color.palette.static-black-alpha-700"],
  },
  {
    previous: "$static.color.static-white-alpha-50",
    next: ["$color.palette.static-white-alpha-50"],
  },
  {
    previous: "$static.color.static-white-alpha-200",
    next: ["$color.palette.static-white-alpha-300"],
  },
];

export const colorMappings = [
  ...semanticColorMappings,
  ...scaleColorMappings,
  ...staticColorMappings,
];
