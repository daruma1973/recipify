# Recipify Authentication System

This document provides an overview of the authentication system implemented in Recipify, including how to use it, test it, and extend it.

## Overview

The authentication system provides the following features:
- User registration
- User login
- User profile management
- Password management
- Role-based access control

## API Endpoints

### Authentication

- **POST /api/auth**: Login a user
  - Request body: `{ email, password }`
  - Response: `{ token }`

- **GET /api/auth**: Get the current user's profile (requires authentication)
  - Headers: `x-auth-token: <token>`
  - Response: User object without password

### User Management

- **POST /api/users**: Register a new user
  - Request body: `{ name, email, password, role (optional) }`
  - Response: `{ token }`

- **PUT /api/users/profile**: Update user profile (requires authentication)
  - Headers: `x-auth-token: <token>`
  - Request body: `{ name }`
  - Response: Updated user object

- **PUT /api/users/password**: Change user password (requires authentication)
  - Headers: `x-auth-token: <token>`
  - Request body: `{ currentPassword, newPassword }`
  - Response: `{ msg: 'Password updated successfully' }`

## Environment Variables

The authentication system uses the following environment variables:
- `JWT_SECRET`: Secret key for JWT token generation and verification
- `MONGO_URI`: MongoDB connection string

These variables can be set in a `.env` file in the server directory. If not set, default values will be used.

## Testing

Several test scripts are provided to verify the authentication system:

- `verify-auth-system.js`: Comprehensive test of all authentication features
- `test-login.js`: Test user login
- `test-auth.js`: Test authentication flow
- `check-user.js`: Check if a user exists in the database
- `reset-password.js`: Reset a user's password directly in the database

To run the tests:
```
node verify-auth-system.js
```

## Client-Side Integration

The authentication system is integrated with the client-side using React Context API. The following components are provided:

- `AuthState`: Context provider for authentication state
- `PrivateRoute`: Route component that requires authentication
- `Profile`: Component for user profile management

## Security Considerations

- Passwords are hashed using bcrypt before storage
- JWT tokens are used for authentication
- Protected routes require a valid token
- Role-based access control is implemented

## Extending the System

To add new features to the authentication system:

1. **Add new routes**: Create new routes in `server/routes/users.js` or `server/routes/auth.js`
2. **Add new middleware**: Create new middleware in `server/middleware/`
3. **Update client components**: Update the client-side components to use the new features

## Troubleshooting

If you encounter issues with the authentication system:

1. Check the server logs for error messages
2. Verify that the environment variables are set correctly
3. Ensure that the MongoDB database is running
4. Run the test scripts to verify the system is working correctly

## Role-Based Access Control

The system supports three roles:
- `admin`: Full access to all features
- `chef`: Access to recipe management and costing features
- `user`: Basic access to view recipes and ingredients

To implement role-based access control in your routes, use the following pattern:

```javascript
// Example of role-based access control
router.get('/admin-only', [auth, checkRole('admin')], (req, res) => {
  // Only admins can access this route
  res.json({ msg: 'Admin access granted' });
});
```

Where `checkRole` is a middleware function that checks if the user has the required role. 