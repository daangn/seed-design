const { createClassName } = require("./className.cjs");
const { mergeVariants } = require("./mergeVariants.cjs");
const { splitVariantProps } = require("./splitVariantProps.cjs");

const pullToRefreshSlotNames = [
  [
    "root",
    "seed-pull-to-refresh__root"
  ],
  [
    "indicator",
    "seed-pull-to-refresh__indicator"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

const pullToRefreshVariantMap = {};

const pullToRefreshVariantKeys = Object.keys(pullToRefreshVariantMap);

function pullToRefresh(props) {
  return Object.fromEntries(
    pullToRefreshSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(pullToRefresh, { splitVariantProps: (props) => splitVariantProps(props, pullToRefreshVariantMap) });

module.exports = pullToRefresh;
module.exports.pullToRefreshVariantMap = pullToRefreshVariantMap;
module.exports.pullToRefreshVariantKeys = pullToRefreshVariantKeys;