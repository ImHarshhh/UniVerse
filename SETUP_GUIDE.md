# Authentication Fix Setup Guide

## Issues Found and Fixed:

1. **Environment Variables**: The app was using `process.env.REACT_APP_API_BASE_URL` instead of Vite's `import.meta.env.VITE_APP_API_BASE_URL`
2. **Missing JWT Secret**: The backend was using a hardcoded secret instead of environment variables
3. **Inconsistent API Calls**: Login/Signup pages were using direct axios instead of the configured api service
4. **Missing Logout Route**: Backend was missing the logout endpoint

## Environment Variables Setup:

### For Client (Frontend):
Create a file named `.env` in the `client` directory with:
```
VITE_APP_API_BASE_URL=https://universe-backend-zoi9.onrender.com
```

### For Server (Backend):
Create a file named `.env` in the `server` directory with:
```
JWT_SECRET=ccec080928a33eaa9935e6cadd63dd4cb1abc93dd192cbc8f394e934ff0e663c4af271360c9c32e1ade2b5c1990897971446fb3820a064e66cec93f4f1bdea5d
MONGODB_URI=your_mongodb_connection_string_here
```

## Commands to Run:

### 1. Set up environment variables on Render:

Go to your Render dashboard and add these environment variables to your backend service:

**Backend Environment Variables:**
- `JWT_SECRET`: `ccec080928a33eaa9935e6cadd63dd4cb1abc93dd192cbc8f394e934ff0e663c4af271360c9c32e1ade2b5c1990897971446fb3820a064e66cec93f4f1bdea5d`
- `MONGODB_URI`: Your MongoDB connection string

**Frontend Environment Variables:**
- `VITE_APP_API_BASE_URL`: `https://universe-backend-zoi9.onrender.com`

### 2. Deploy the changes:

```bash
# Commit and push your changes
git add .
git commit -m "Fix authentication issues"
git push origin main
```

### 3. Test the application:

Your frontend should be available at: `https://universe-frontend-zoi9.onrender.com`

## What was fixed:

1. **Login.jsx**: Now uses `authServices` instead of direct axios
2. **Signup.jsx**: Now uses `authServices` instead of direct axios  
3. **auth.js controller**: Fixed JWT token generation to use environment variables
4. **Added logout route**: Backend now has proper logout functionality
5. **Error handling**: Added proper error messages and loading states

## Testing Steps:

1. Go to your frontend URL
2. Try to sign up with a new account
3. Try to log in with existing credentials
4. Check if the token is properly stored in localStorage
5. Verify that protected routes work correctly

## Debugging:

If you still have issues, check the browser console and server logs for:
- JWT_SECRET errors
- CORS issues
- Database connection problems
- Token generation/validation errors 