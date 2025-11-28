#!/bin/bash

# Run Backend Service
set -e

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"

echo "Starting Backend Service..."
cd "$BACKEND_DIR"

# Build with Maven
echo "Building backend..."
mvn clean install

# Run with Maven
echo "Starting Jersey server..."
mvn jetty:run
