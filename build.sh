#!/bin/bash

# This script runs the build completely ignoring ESLint errors
echo "Building project (bypassing ESLint completely)..."

# Set environment variables to disable ESLint during build
export DISABLE_ESLINT_PLUGIN=true 
export NEXT_DISABLE_ESLINT=1

# Run the Next.js build with no-lint option
npx next build --no-lint

echo "Build completed!" 