# Recipify Deployment Script for Windows PowerShell
# Pushes to GitHub and deploys to Heroku

# Heroku app name - CHANGE THIS TO YOUR APP NAME
$HEROKU_APP_NAME = "recipify"

# GitHub branch - change if you use a different branch
$GITHUB_BRANCH = "main"

# Color definitions for PowerShell
$Green = "Green"
$Yellow = "Yellow"
$Cyan = "Cyan"
$Red = "Red"

function Write-ColorOutput {
    param (
        [Parameter(Mandatory=$true)]
        [string]$Message,
        
        [Parameter(Mandatory=$true)]
        [string]$Color
    )
    
    Write-Host $Message -ForegroundColor $Color
}

# Display header
Write-Host "============================================" -ForegroundColor $Cyan
Write-Host "   Recipify Deployment Script" -ForegroundColor $Cyan
Write-Host "   Push to GitHub & Deploy to Heroku" -ForegroundColor $Cyan
Write-Host "============================================" -ForegroundColor $Cyan

# Check if git is installed
if (-not (Get-Command "git" -ErrorAction SilentlyContinue)) {
    Write-ColorOutput "Git is not installed. Please install Git and try again." $Red
    exit 1
}

# Check if heroku CLI is installed
if (-not (Get-Command "heroku" -ErrorAction SilentlyContinue)) {
    Write-ColorOutput "Heroku CLI is not installed. Please install the Heroku CLI and try again." $Red
    Write-ColorOutput "You can install it from: https://devcenter.heroku.com/articles/heroku-cli" $Yellow
    exit 1
}

# Check if we're in a git repository
if (-not (Test-Path ".git")) {
    Write-ColorOutput "Not a git repository. Please run this script from the root of your Recipify project." $Red
    exit 1
}

# Check if user is logged in to Heroku
try {
    $herokuWhoami = heroku auth:whoami 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Not logged in to Heroku"
    }
}
catch {
    Write-ColorOutput "You are not logged in to Heroku. Please login first:" $Red
    Write-ColorOutput "heroku login" $Yellow
    exit 1
}

# Check for Heroku app
try {
    $herokuApp = heroku apps:info --app $HEROKU_APP_NAME 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Heroku app not found"
    }
}
catch {
    Write-ColorOutput "Heroku app '$HEROKU_APP_NAME' not found." $Red
    Write-ColorOutput "Please create the app or update the `$HEROKU_APP_NAME variable in this script." $Yellow
    exit 1
}

# Check if Heroku remote exists, if not add it
$gitRemotes = git remote
if ($gitRemotes -notcontains "heroku") {
    Write-ColorOutput "Adding Heroku remote..." $Yellow
    git remote add heroku "https://git.heroku.com/$HEROKU_APP_NAME.git"
    Write-ColorOutput "Heroku remote added." $Green
}

# Check for uncommitted changes
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-ColorOutput "You have uncommitted changes:" $Yellow
    git status -s
    
    # Ask for commit message
    Write-ColorOutput "Enter commit message:" $Cyan
    $commit_message = Read-Host
    
    if ([string]::IsNullOrWhiteSpace($commit_message)) {
        $commit_message = "Update $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        Write-ColorOutput "Using default commit message: $commit_message" $Yellow
    }
    
    # Stage and commit changes
    Write-ColorOutput "Staging all changes..." $Cyan
    git add .
    
    Write-ColorOutput "Committing changes: $commit_message" $Cyan
    git commit -m $commit_message
    
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput "Git commit failed. Please fix any issues and try again." $Red
        exit 1
    }
}
else {
    Write-ColorOutput "No uncommitted changes detected." $Green
    
    # Check if there are commits to push
    $commits_to_push = git log "origin/$GITHUB_BRANCH..$GITHUB_BRANCH" 2>$null
    if (-not $commits_to_push) {
        Write-ColorOutput "No new commits to push to GitHub." $Yellow
        # Still ask if user wants to deploy to Heroku
        Write-ColorOutput "Do you still want to deploy to Heroku? (y/n)" $Cyan
        $deploy_anyway = Read-Host
        
        if ($deploy_anyway -notmatch '^[Yy]') {
            Write-ColorOutput "Deployment cancelled." $Yellow
            exit 0
        }
    }
}

# Push to GitHub
Write-ColorOutput "Pushing to GitHub..." $Cyan
git push origin $GITHUB_BRANCH

if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput "Failed to push to GitHub. Please check your connection or repository settings." $Red
    
    # Ask if they still want to deploy to Heroku
    Write-ColorOutput "Do you still want to deploy to Heroku despite GitHub push failure? (y/n)" $Cyan
    $deploy_anyway = Read-Host
    
    if ($deploy_anyway -notmatch '^[Yy]') {
        Write-ColorOutput "Deployment cancelled." $Yellow
        exit 1
    }
}
else {
    Write-ColorOutput "Successfully pushed to GitHub." $Green
}

# Deploy to Heroku
Write-ColorOutput "Deploying to Heroku..." $Cyan
git push heroku "${GITHUB_BRANCH}:main"

if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput "Failed to deploy to Heroku. Check the error messages above." $Red
    exit 1
}
else {
    Write-ColorOutput "Successfully deployed to Heroku!" $Green
}

# Show deployed app URL
Write-ColorOutput "Your application is running at:" $Cyan
$appInfo = heroku apps:info --app $HEROKU_APP_NAME
$webUrl = ($appInfo | Select-String "Web URL").ToString().Trim()
$webUrl = $webUrl.Split(" ")[-1]
Write-Host $webUrl

Write-Host "============================================" -ForegroundColor $Green
Write-Host "   Deployment Complete!" -ForegroundColor $Green
Write-Host "============================================" -ForegroundColor $Green

# Ask if user wants to open the app
Write-ColorOutput "Do you want to open the app in your browser? (y/n)" $Cyan
$open_app = Read-Host

if ($open_app -match '^[Yy]') {
    heroku open --app $HEROKU_APP_NAME
} 