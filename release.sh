#!/bin/bash

# We use a custom nx release dist directory, see here:
# https://nx.dev/recipes/nx-release/updating-version-references#scenario-2-i-want-to-publish-from-a-custom-dist-directory-and-not-update-references-in-my-source-packagejson-files

bashPreBuild() {
  rm -rf dist
  rm -rf publish
  npx nx run-many --target=build --projects=api,ui
  mkdir -p publish
  cp -r dist/apps/api/. publish/api
  mkdir -p publish/api/browser
  cp -r dist/apps/ui/browser/. publish/api/browser
  cp apps/api/.npmignore publish/api/.npmignore
  cp README.md publish/api/README.md

  # inject the bin field into main.js
  sed -i '1i #!/usr/bin/env node' publish/api/main.js

  # check if all the dependencies are in the publish/api/package.json
  printf "\n\nAre all these dependencies in the publish/api/package.json?\n"
  grep -n "module.exports = require(" publish/api/main.js
}

bashPreBuild

echo ""
echo "Verify the publish directory is correct"
echo ""
echo "sanity check"
echo "cd publish/api && node ./main.js --anthropic-api-key=\$ANTHROPIC_API_KEY"
echo ""
read -p "Press Enter to continue"

npx nx release --skip-publish

echo ""
read "Verify the CHANGELOG.md is correct"
echo ""
read -p "Press Enter to continue"

# publish the package
cd publish/api
npm publish
