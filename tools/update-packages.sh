#!/bin/bash

# Update ai and @ai-sdk/anthropic to the latest versions
npm install ai@latest
npm install @ai-sdk/anthropic@latest

# Update other dependencies
./tools/sync-updates.sh ai @ai-sdk/anthropic

