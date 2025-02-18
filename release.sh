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

  printf "\n\nAre all these dependencies in the publish/api/package.json?\n"
  grep -n "module.exports = " publish/api/main.js
}

bashPreBuild

npx nx release --skip-publish

read -p "Verify the CHANGELOG and Publish directory is correct"

# publish the package
cd publish/api
npm publish
