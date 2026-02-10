#!/bin/bash

# Start Python HTTP server in the background
python -m http.server 8000 &

# Wait a moment for the server to start
sleep 1

# Open default browser at localhost
# macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    open http://localhost:8000/
# Linux
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open http://localhost:8000/
# Windows Git Bash
elif [[ "$OSTYPE" == "msys" ]]; then
    start http://localhost:8000/
fi
