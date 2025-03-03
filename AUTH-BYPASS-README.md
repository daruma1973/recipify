# Authentication Bypass for Development

This document explains how authentication has been temporarily disabled in the Recipify application to facilitate development and testing of features without authentication interruptions.

## Current Status

Authentication is currently **DISABLED** for development purposes. This means:

1. **No Login Required**: You can access all features without logging in
2. **All API Endpoints Accessible**: No authentication token is required for API calls
3. **Role-Based Access Controls Bypassed**: Admin-only features are accessible to everyone
4. **Automatic User Context**: A mock admin user is automatically provided for all requests

## How It Works

The authentication bypass is implemented through several key changes:

1. **Server-Side Middleware**:
   - `server/middleware/auth.js`: Modified to always provide a mock user and bypass token verification
   - `server/middleware/checkRole.js`: Modified to bypass role checks and allow access to all routes

2. **Client-Side Authentication**:
   - `client/src/utils/setAuthToken.js`: Modified to always set a dummy token
   - `client/src/components/routing/PrivateRoute.js`: Modified to always render protected routes
   - Login and Register components updated to make it clear authentication is bypassed

3. **Development Scripts**:
   - Added `auth-status` script to show the current authentication status
   - Modified `dev` script to show authentication status on startup

## Using the Application

With authentication bypassed:

1. You can navigate directly to any page without logging in
2. The login and register forms will accept any values
3. All API endpoints will work without requiring a token
4. Admin-only features are accessible to everyone

## Re-Enabling Authentication

When you're ready to re-enable authentication:

1. **Restore Original Middleware**:
   - Restore the original code in `server/middleware/auth.js`
   - Restore the original code in `server/middleware/checkRole.js`

2. **Restore Client Authentication**:
   - Restore the original code in `client/src/utils/setAuthToken.js`
   - Update `client/src/components/routing/PrivateRoute.js` to check authentication
   - Restore the original Login and Register components

3. **Create Admin User**:
   - Run `npm run create-admin` to ensure you have an admin user
   - Default credentials: admin@recipify.com / password123

## Security Warning

This configuration is for **DEVELOPMENT ONLY**. 

**DO NOT** deploy this application with authentication disabled. Re-enable authentication before deploying to production.

## Helpful Commands

- `npm run auth-status`: Show the current authentication status
- `npm run create-admin`: Create/update the admin user (for when auth is re-enabled)
- `npm run fix-auth`: Run the authentication fix script (for when auth is re-enabled)

## Original Authentication Files

The original authentication code is preserved as comments in the modified files, making it easy to restore when needed. 