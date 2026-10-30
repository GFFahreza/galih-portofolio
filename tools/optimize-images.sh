#!/usr/bin/env bash
# Resize, strip metadata (including GPS), and compress every JPEG/PNG/WebP in a folder.
# Needs ImageMagick 7 ("magick"). The website itself never runs this; it is optional.
# Usage: tools/optimize-images.sh assets/images/edm
set -euo pipefail
dir="${1:?Usage: tools/optimize-images.sh <folder>}"
command -v magick >/dev/null || { echo "ImageMagick (magick) is not installed."; exit 1; }
shopt -s nullglob nocaseglob
for f in "$dir"/*.jpg "$dir"/*.jpeg "$dir"/*.png "$dir"/*.webp; do
  magick "$f" -resize '1600x1600>' -strip -quality 82 "$f"
  echo "optimized: $f ($(du -k "$f" | cut -f1) KB)"
done
