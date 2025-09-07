# Google OAuth Integration Setup Guide

## 🎯 Overview

Your frontend now has complete Google OAuth integration! When users click the Google login/register buttons, they'll be redirected to Google for authentication and then back to your app.

## 🔧 How It Works

### Frontend Flow:
1. User clicks "Sign in with Google" or "Sign up with Google" button
2. Button redirects to `http://localhost:3000/api/v1/auth/google`
3. Backend handles OAuth with Google
4. Google redirects back to `http://localhost:3000/api/v1/auth/google/callback`
5. Backend processes OAuth and redirects to `http://localhost:5173/tickets?auth=success`
6. Frontend `CheckAuth` component detects `?auth=success` and validates session
7. User is logged in automatically

### Backend Flow:
1. `/api/v1/auth/google` - Initiates OAuth flow
2. `/api/v1/auth/google/callback` - Handles OAuth callback
3. Creates or links user account
4. Sets up session-based authentication
5. Redirects to frontend with success/error status

## 🚀 Setup Requirements

### 1. Backend Environment (.env):
```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# App URLs
APP_URL=http://localhost:3000
CLIENT_URL=http://localhost:5173

# Session Secret
SESSION_SECRET=your-super-secret-session-key-here

# Other existing variables...
JWT_SECRET=your-jwt-secret
MONGO_URI=mongodb://localhost:27017/ai-ticketing-system
```

### 2. Frontend Environment (.env):
```env
VITE_SERVER_URL=http://localhost:3000
```

### 3. Google Cloud Console Setup:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable Google+ API and Google People API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Choose "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/v1/auth/google/callback`
   - For production: `https://yourdomain.com/api/v1/auth/google/callback`
7. Copy Client ID and Client Secret to your backend .env file

## ✨ Features Implemented

### Frontend Components:
- **GoogleLoginButton**: Reusable component with customizable text
- **Enhanced CheckAuth**: Handles both JWT and session-based authentication
- **OAuth Callback Handling**: Automatically processes OAuth success/failure
- **Error Handling**: Beautiful error messages for OAuth failures
- **Loading States**: Proper loading indicators during authentication

### Backend Features:
- **Dual Authentication**: Supports both JWT tokens and session-based auth
- **Account Linking**: Links Google accounts to existing email accounts
- **Automatic User Creation**: Creates new users from Google OAuth
- **Proper Error Handling**: Handles OAuth failures gracefully
- **Session Management**: Secure session-based authentication

## 🧪 Testing

### Local Testing:
1. Start backend: `cd backend && npm start`
2. Start frontend: `cd frontend-agent && npm run dev`
3. Go to `http://localhost:5173/login`
4. Click "Sign in with Google"
5. Complete Google OAuth flow
6. Should redirect to tickets page with user logged in

### Test Cases:
- ✅ New user registration via Google
- ✅ Existing user login via Google
- ✅ Account linking (existing email + Google OAuth)
- ✅ Error handling for OAuth failures
- ✅ Session persistence across page reloads
- ✅ Proper logout functionality

## 🔒 Security Features

- **Session Security**: HTTP-only cookies with proper expiration
- **CORS Configuration**: Properly configured for frontend-backend communication
- **Token Validation**: JWT tokens validated on protected routes
- **Error Handling**: No sensitive information leaked in error messages
- **Secure Redirects**: Validates redirect URLs to prevent attacks

## 🛠 Advanced Configuration

### Production Setup:
1. Update `APP_URL` to your production backend URL
2. Update `CLIENT_URL` to your production frontend URL  
3. Add production redirect URI to Google Console
4. Use HTTPS for all URLs in production
5. Set secure cookie settings for production

### Custom Styling:
The GoogleLoginButton component accepts props:
```jsx
<GoogleLoginButton 
  text="Custom button text" 
  disabled={loading} 
/>
```

## 🚨 Troubleshooting

### Common Issues:
1. **"redirect_uri_mismatch"**: Check Google Console redirect URIs
2. **CORS errors**: Ensure backend CORS is configured for frontend URL
3. **Session not persisting**: Check if cookies are being set properly
4. **OAuth callback fails**: Verify Google Client ID/Secret are correct

### Debug Mode:
Check browser console and network tab for detailed error messages.

## 🎉 You're All Set!

Your Google OAuth integration is now complete and ready to use! Users can seamlessly login/register with their Google accounts, and the system will handle both JWT and session-based authentication automatically.
