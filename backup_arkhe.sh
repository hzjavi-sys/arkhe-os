#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
git add -A
if git diff --cached --quiet; then
  echo "Sin cambios."
  exit 0
fi
git commit -m "auto-backup $(date '+%Y-%m-%d %H:%M:%S')"
git push
