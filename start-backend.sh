#!/bin/bash

echo "Starting Aegis Backend Server..."

# Unset any existing GEMINI_API_KEY env var (let .env file take precedence)
unset GEMINI_API_KEY

cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install/update dependencies
echo "Installing dependencies..."
PYO3_USE_ABI3_FORWARD_COMPATIBILITY=1 pip install -q -r requirements.txt

# Start the server
echo "Starting FastAPI server on http://localhost:8000"
python -m app.main
