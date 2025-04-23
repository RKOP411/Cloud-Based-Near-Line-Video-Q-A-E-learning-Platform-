@echo off
echo Starting Frontend...
start cmd /k "cd Frontend && npm install && npm run dev"

echo Starting Backend...
start cmd /k "cd Backend && npm install && npm run dev"

echo Both Frontend and Backend are running.

echo Starting Queue Timer...
cd timer
python .\CloseQueue.py
