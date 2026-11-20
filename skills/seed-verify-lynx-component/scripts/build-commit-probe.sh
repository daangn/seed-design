#!/usr/bin/env bash
set -euo pipefail

if [[ $# != 3 ]]; then
  echo "Usage: bash $0 <seed-design-lynx checkout> <git ref|working-tree> <new output directory>" >&2
  exit 2
fi

assets=$(cd "$(dirname "$0")/../assets/commit-probe" && pwd)
seed=$(cd "$assets/../../../.." && pwd)
playground=$(cd "$1" && pwd)
revision=$2
mkdir "$3"
output=$(cd "$3" && pwd)

cp "$assets/"*.ts "$assets/"*.tsx "$output/"
ln -s "$playground/node_modules" "$output/node_modules"
source=$seed
label="$(git -C "$seed" rev-parse HEAD)+working-tree"
if [[ "$revision" != working-tree ]]; then
  label=$(git -C "$seed" rev-parse --verify "$revision^{commit}")
  source="$output/source"
  mkdir "$source"
  git -C "$seed" archive "$label" packages/lynx-react/src packages/lynx-react-headless/tabs/src packages/lynx-react-headless/image/src \
    packages/lynx-react-headless/app-bar/src packages/lynx-react-headless/text-field/src \
    packages/lynx-react-headless/segmented-control/src |
    tar -x -C "$source"
fi

(
  cd "$playground"
  SEED_PROBE_CHECKOUT="$seed" SEED_PROBE_SOURCE="$source" SEED_PROBE_LABEL="$label" \
    bun "$playground/node_modules/.bin/rspeedy" build --config "$output/lynx.config.ts"
)
shasum -a 256 "$output/dist/main.lynx.bundle"
