#!/bin/bash

# This script runs the build completely ignoring ESLint errors
echo "Building project (bypassing ESLint completely)..."

# Set environment variables to disable ESLint during build
export DISABLE_ESLINT_PLUGIN=true 
export NEXT_DISABLE_ESLINT=1

# Make script exit on any command failure
set -e

# Check Node.js version
echo "Using Node.js $(node -v)"

# Create a simple runtime config to ensure Next.js has API routes
cat > .env.production << EOL
# Runtime environment
OPENAI_API_KEY=${OPENAI_API_KEY}
NEXT_PUBLIC_BASE_URL=${URL:-https://chatpagelingo.netlify.app}
EOL

# Install dependencies if needed
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.bin/next" ]; then
  echo "Installing dependencies..."
  npm ci
fi

# Run the Next.js build with no-lint option
echo "Running Next.js build..."
npx next build --no-lint

# Ensure netlify directory exists for edge functions
mkdir -p netlify/edge-functions

# Verify build output exists
if [ -d ".next" ]; then
  echo "Build completed successfully! Output directory .next exists."
  # List some of the files to verify
  echo "Build output files:"
  ls -la .next
else
  echo "ERROR: Build failed - .next directory does not exist."
  exit 1
fi 