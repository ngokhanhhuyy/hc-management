#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
DESTINATION_DIR="$SCRIPT_DIR/../../../frontend/src/api/generated"

cd "$SCRIPT_DIR"

mkdir -p ./src/client
rm -rf ./src/client/*

pnpm generate

pnpm exec prettier ./src/client --write

mkdir -p "$DESTINATION_DIR"
rm -rf "$DESTINATION_DIR"

cp -a ./src/. "$DESTINATION_DIR/"
