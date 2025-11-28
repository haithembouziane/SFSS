#!/bin/bash

# Run Frontend Service
set -e

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

echo "Starting Frontend Service..."
cd "$FRONTEND_DIR"

# Install dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start development server
echo "Starting React development server..."
npm start
