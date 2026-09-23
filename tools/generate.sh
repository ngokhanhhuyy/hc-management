#!/usr/bin/env bash

set -euo pipefail
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
sh "$SCRIPT_DIR/client-generators/orval/generate.sh"
cd "$SCRIPT_DIR/localization-generators"
bun run index.ts
