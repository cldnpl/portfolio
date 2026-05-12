#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MODELS_DIR="$ROOT_DIR/public/models"

if [ ! -d "$MODELS_DIR" ]; then
  echo "Models directory not found: $MODELS_DIR" >&2
  exit 1
fi

echo "Model sizes BEFORE:"
du -h "$MODELS_DIR"/*.{glb,gltf,dae} 2>/dev/null || true

# Optimize textures (webp) and apply Draco compression in place.
for model in "$MODELS_DIR"/*.glb; do
  [ -e "$model" ] || continue
  echo "\nOptimizing $model"
  npx @gltf-transform/cli optimize "$model" "$model" --texture-compress webp
  echo "Applying Draco $model"
  npx @gltf-transform/cli draco "$model" "$model"
done

echo "\nModel sizes AFTER:"
du -h "$MODELS_DIR"/*.{glb,gltf,dae} 2>/dev/null || true
