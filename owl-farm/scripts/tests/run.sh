#!/usr/bin/env bash
# Runs Owl Farm's backend functions under Node against a mock Base44 SDK, Telegram and Readwise.
# Usage: bash owl-farm/scripts/tests/run.sh   (needs Node 18+; fetches esbuild with npx)
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
fns="$here/../../base44/functions"
out="$(mktemp -d)"
cp "$here"/*.mjs "$out/"
cd "$out"  # esbuild resolves the alias from the working directory
for f in telegramHook dailyWire editLessons weeklyDigest dailyNudge; do
  npx -y esbuild@0.24.0 "$fns/$f/entry.ts" --bundle --format=esm --platform=node \
    --alias:npm:@base44/sdk@0.8.54=./mock.mjs --outfile="$out/$f.mjs" --log-level=error
done
status=0
for t in test_*.mjs; do echo "# $t"; node "$t" || status=1; done
exit $status
