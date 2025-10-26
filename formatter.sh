#!/bin/bash

# This script formats the code in the project.

# Exit immediately if a command exits with a non-zero status.
set -e

echo "🚀 Starting Code Formatting..."

# --- 1. Format Frontend Projects ---
echo "--> Formatting real-time-user-tracker-demo..."
(cd services/real-time-user-tracker-demo && npm install && npm run format)

echo "--> Formatting react-user-tracker..."
(cd services/react-user-tracker && npm install && npm install prettier && npm run format)

# --- 2. Format Python Projects ---
echo "--> Formatting Python services..."

# Install formatters if not present
pip install black isort

# Format Python files
black services/real-time-events-collector/
black services/real-time-events-processor/
black services/real-time-events-service/

isort services/real-time-events-collector/
isort services/real-time-events-processor/
isort services/real-time-events-service/

echo "✅ Code formatting complete!"
