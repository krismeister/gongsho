#!/bin/bash

# Exit immediately if any command fails
set -e

mkdir -p apps/api/src/assets/tpl/ || exit 1

find libs/core/src -name "*.tpl" -exec bash -c '
  file="$1"
  # Get just the filename without the path
  filename=$(basename "$file")
  dest="apps/api/src/assets/tpl/$filename"
  
  # Only copy if file does not exist or contents are different
  if [ ! -f "$dest" ] || ! cmp -s "$file" "$dest"; then
    cp "$file" "$dest" || exit 1
  fi
' bash {} \;