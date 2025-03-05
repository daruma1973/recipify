#!/bin/bash

# Colors for output formatting
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Heroku app name - CHANGE THIS TO YOUR APP NAME
HEROKU_APP_NAME="recipify"

# GitHub branch - change if you use a different branch
GITHUB_BRANCH="main"

echo -e "${BOLD}${CYAN}============================================${NC}"
echo -e "${BOLD}${CYAN}   Recipify Deployment Script${NC}"
echo -e "${BOLD}${CYAN}   Push to GitHub & Deploy to Heroku${NC}"
echo -e "${BOLD}${CYAN}============================================${NC}"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}Git is not installed. Please install Git and try again.${NC}"
    exit 1
fi

# Check if heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo -e "${RED}Heroku CLI is not installed. Please install the Heroku CLI and try again.${NC}"
    echo -e "${YELLOW}You can install it from: https://devcenter.heroku.com/articles/heroku-cli${NC}"
    exit 1
fi

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo -e "${RED}Not a git repository. Please run this script from the root of your Recipify project.${NC}"
    exit 1
fi

# Check if user is logged in to Heroku
if ! heroku auth:whoami &> /dev/null; then
    echo -e "${RED}You are not logged in to Heroku. Please login first:${NC}"
    echo -e "${YELLOW}heroku login${NC}"
    exit 1
fi

# Check for Heroku app
if ! heroku apps:info --app $HEROKU_APP_NAME &> /dev/null; then
    echo -e "${RED}Heroku app '$HEROKU_APP_NAME' not found.${NC}"
    echo -e "${YELLOW}Please create the app or update the HEROKU_APP_NAME variable in this script.${NC}"
    exit 1
fi

# Check if Heroku remote exists, if not add it
if ! git remote | grep -q heroku; then
    echo -e "${YELLOW}Adding Heroku remote...${NC}"
    git remote add heroku https://git.heroku.com/$HEROKU_APP_NAME.git
    echo -e "${GREEN}Heroku remote added.${NC}"
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}You have uncommitted changes:${NC}"
    git status -s
    
    # Ask for commit message
    echo -e "${CYAN}Enter commit message:${NC}"
    read -r commit_message
    
    if [ -z "$commit_message" ]; then
        commit_message="Update $(date +"%Y-%m-%d %H:%M:%S")"
        echo -e "${YELLOW}Using default commit message: ${commit_message}${NC}"
    fi
    
    # Stage and commit changes
    echo -e "${CYAN}Staging all changes...${NC}"
    git add .
    
    echo -e "${CYAN}Committing changes: ${commit_message}${NC}"
    git commit -m "$commit_message"
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}Git commit failed. Please fix any issues and try again.${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}No uncommitted changes detected.${NC}"
    
    # Check if there are commits to push
    if [ -z "$(git log origin/$GITHUB_BRANCH..$GITHUB_BRANCH 2>/dev/null)" ]; then
        echo -e "${YELLOW}No new commits to push to GitHub.${NC}"
        # Still ask if user wants to deploy to Heroku
        echo -e "${CYAN}Do you still want to deploy to Heroku? (y/n)${NC}"
        read -r deploy_anyway
        
        if [[ ! $deploy_anyway =~ ^[Yy]$ ]]; then
            echo -e "${YELLOW}Deployment cancelled.${NC}"
            exit 0
        fi
    fi
fi

# Push to GitHub
echo -e "${CYAN}Pushing to GitHub...${NC}"
git push origin $GITHUB_BRANCH

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to push to GitHub. Please check your connection or repository settings.${NC}"
    
    # Ask if they still want to deploy to Heroku
    echo -e "${CYAN}Do you still want to deploy to Heroku despite GitHub push failure? (y/n)${NC}"
    read -r deploy_anyway
    
    if [[ ! $deploy_anyway =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Deployment cancelled.${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}Successfully pushed to GitHub.${NC}"
fi

# Deploy to Heroku
echo -e "${CYAN}Deploying to Heroku...${NC}"
git push heroku $GITHUB_BRANCH:main

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to deploy to Heroku. Check the error messages above.${NC}"
    exit 1
else
    echo -e "${GREEN}Successfully deployed to Heroku!${NC}"
fi

# Show deployed app URL
echo -e "${CYAN}Your application is running at:${NC}"
heroku apps:info --app $HEROKU_APP_NAME | grep "Web URL" | awk '{print $3}'

echo -e "${BOLD}${GREEN}============================================${NC}"
echo -e "${BOLD}${GREEN}   Deployment Complete!${NC}"
echo -e "${BOLD}${GREEN}============================================${NC}"

# Ask if user wants to open the app
echo -e "${CYAN}Do you want to open the app in your browser? (y/n)${NC}"
read -r open_app

if [[ $open_app =~ ^[Yy]$ ]]; then
    heroku open --app $HEROKU_APP_NAME
fi 