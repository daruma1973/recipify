#!/bin/bash

# Print with colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Stopping all Node.js processes...${NC}"

# Try to use stored PIDs first (more targeted approach)
if [ -f "./.server.pid" ]; then
  SERVER_PID=$(cat ./.server.pid)
  if ps -p $SERVER_PID > /dev/null; then
    echo -e "${CYAN}Stopping backend server (PID: $SERVER_PID)${NC}"
    kill $SERVER_PID
    rm ./.server.pid
  else
    echo -e "${CYAN}Backend server PID $SERVER_PID not found, may have already stopped${NC}"
  fi
fi

if [ -f "./.client.pid" ]; then
  CLIENT_PID=$(cat ./.client.pid)
  if ps -p $CLIENT_PID > /dev/null; then
    echo -e "${CYAN}Stopping frontend client (PID: $CLIENT_PID)${NC}"
    kill $CLIENT_PID
    rm ./.client.pid
  else
    echo -e "${CYAN}Frontend client PID $CLIENT_PID not found, may have already stopped${NC}"
  fi
fi

# Fallback: find and kill all Node.js related processes
echo -e "${CYAN}Looking for any remaining Node.js processes...${NC}"

# Find and kill node processes
NODE_PIDS=$(pgrep -f "node" || echo "")
if [ -n "$NODE_PIDS" ]; then
  echo -e "${CYAN}Found node processes: $NODE_PIDS${NC}"
  pkill -f "node" && echo -e "${CYAN}Node.js processes terminated${NC}" || echo -e "${RED}Failed to kill Node.js processes${NC}"
else
  echo -e "${CYAN}No Node.js processes found${NC}"
fi

# Find and kill npm processes
NPM_PIDS=$(pgrep -f "npm" || echo "")
if [ -n "$NPM_PIDS" ]; then
  echo -e "${CYAN}Found npm processes: $NPM_PIDS${NC}"
  pkill -f "npm" && echo -e "${CYAN}npm processes terminated${NC}" || echo -e "${RED}Failed to kill npm processes${NC}"
else
  echo -e "${CYAN}No npm processes found${NC}"
fi

# Find and kill nodemon processes
NODEMON_PIDS=$(pgrep -f "nodemon" || echo "")
if [ -n "$NODEMON_PIDS" ]; then
  echo -e "${CYAN}Found nodemon processes: $NODEMON_PIDS${NC}"
  pkill -f "nodemon" && echo -e "${CYAN}nodemon processes terminated${NC}" || echo -e "${RED}Failed to kill nodemon processes${NC}"
else
  echo -e "${CYAN}No nodemon processes found${NC}"
fi

echo -e "${GREEN}All Node.js processes have been stopped.${NC}"
echo -e "${GREEN}You can now start the application again with ./start-app.sh${NC}"

# Make the start script executable if it exists but isn't executable
if [ -f "./start-app.sh" ] && [ ! -x "./start-app.sh" ]; then
  chmod +x ./start-app.sh
  echo -e "${CYAN}Made start-app.sh executable${NC}"
fi 