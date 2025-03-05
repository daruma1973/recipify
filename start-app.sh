#!/bin/bash

# Print with colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting Recipify application...${NC}"
echo -e "${YELLOW}This script will start both the backend server and frontend client.${NC}"

# Check if we're in the project root
if [ ! -d "./server" ] || [ ! -d "./client" ]; then
  echo -e "${YELLOW}Warning: Make sure you're running this script from the Recipify project root directory.${NC}"
fi

# Start the backend server
echo -e "${CYAN}Starting backend server...${NC}"
cd ./server && npm run dev &
SERVER_PID=$!

# Wait a bit for server to initialize
echo -e "${CYAN}Waiting for server to initialize...${NC}"
sleep 5

# Start the frontend client
echo -e "${CYAN}Starting frontend client...${NC}"
cd ../client && npm start &
CLIENT_PID=$!

# Store the PIDs in a file for easier termination later
echo $SERVER_PID > ./.server.pid
echo $CLIENT_PID > ./.client.pid

echo -e "\n${GREEN}Application is starting!${NC}"
echo -e "${GREEN}Backend server is running (PID: $SERVER_PID).${NC}"
echo -e "${GREEN}Frontend client is running (PID: $CLIENT_PID).${NC}"
echo -e "\n${YELLOW}When asked if you want to run on a different port (if port 3000 is in use), type 'Y'.${NC}"
echo -e "\n${CYAN}To stop all processes, run ./stop-app.sh${NC}"

# Make the stop script executable if it exists but isn't executable
if [ -f "./stop-app.sh" ] && [ ! -x "./stop-app.sh" ]; then
  chmod +x ./stop-app.sh
  echo -e "${CYAN}Made stop-app.sh executable${NC}"
fi

# Keep the script running to make it easier to read the output
echo -e "\n${YELLOW}Press Ctrl+C to exit this script (this will NOT stop the application)${NC}"
echo -e "${YELLOW}The application will continue running in the background.${NC}"
# Wait for user to press Ctrl+C
wait 