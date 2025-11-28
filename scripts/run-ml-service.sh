#!/bin/bash

# Run ML Service
set -e

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ML_SERVICE_DIR="$PROJECT_ROOT/ml-service"

echo "Starting ML Service..."
cd "$ML_SERVICE_DIR"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Run the service
echo "Starting Flask server..."
python app.py
