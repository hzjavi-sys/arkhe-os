#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

# Agregar cambios
git add -A

# Si no hay cambios, salir
if git diff --cached --quiet; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Sin cambios."
  exit 0
fi

# Commit + push
git commit -m "auto-backup $(date '+%Y-%m-%d %H:%M:%S')" >/dev/null
git push >/dev/null

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Backup OK."
