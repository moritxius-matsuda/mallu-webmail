#!/usr/bin/env bash
# Baut das mallu-Webmail als Bulwark-Lite-Paket für Stalwart.
# Der Lite-Build löscht Server-Teile aus dem Checkout, deshalb läuft er in einer Wegwerf-Kopie.
#
#   bash deploy/mallu/build-lite.sh            # Ergebnis: dist-mallu/mallu-webmail-stalwart.zip (+ .sha256)
#
# Eigener Dateiname mit Absicht: Bulwarks Release-Workflows laden bei jedem Release ein unverändertes
# bulwark-lite-stalwart.zip hoch und würden ein gleichnamiges mallu-Paket überschreiben.
set -euo pipefail

repo="$(cd "$(dirname "$0")/../.." && pwd)"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

git -c core.longpaths=true clone -q --no-hardlinks "$repo" "$work/src"
cd "$work/src"
npm ci --ignore-scripts --no-audit --no-fund

LITE_APP_NAME="mallu Webmail" \
LITE_EXTRA_CONFIG="$work/src/deploy/mallu/lite-config.json" \
NEXT_PUBLIC_DEFAULT_LOCALE=de \
GIT_COMMIT="$(git rev-parse HEAD)" \
  npm run build:lite -- --in-place --target=stalwart

mkdir -p "$repo/dist-mallu"
cp bulwark-lite-stalwart.zip "$repo/dist-mallu/mallu-webmail-stalwart.zip"
cd "$repo/dist-mallu"
sha256sum mallu-webmail-stalwart.zip | cut -c1-64 > mallu-webmail-stalwart.zip.sha256
echo "Fertig: $repo/dist-mallu/mallu-webmail-stalwart.zip"
