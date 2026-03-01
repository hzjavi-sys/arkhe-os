#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$HOME/ARKHEOS/09_Experimentos/arkhe-os"
cd "$REPO_DIR"

TS="$(date +%Y%m%d_%H%M%S)"

# Snapshot del catálogo (si existe)
if [ -f "data/profesiones_catalogo.json" ]; then
  cp "data/profesiones_catalogo.json" "backups/autobackup/profesiones_catalogo.$TS.json"
fi

# Snapshot de Prisma schema (si existe)
if [ -f "prisma/schema.prisma" ]; then
  cp "prisma/schema.prisma" "backups/autobackup/schema.$TS.prisma"
fi

# Snapshot del estado Git (no pisa anteriores)
git add -A
git commit -m "auto-backup $TS" >/dev/null 2>&1 || true
