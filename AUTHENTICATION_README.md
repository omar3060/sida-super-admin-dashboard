# Authentication System

This project now includes a simple authentication system to protect all routes from unauthorized access.

## How It Works

### 1. **Login Credentials**
- **Email:** `admin@sida.com`
- **Password:** `102030`

### 2. **Protected Routes**
All routes in the application are now protected except for:
- Authentication pages (`/signin`, `/signin-2`, `/signin-3`, etc.)
- Public assets and API routes
- Error pages

### 3. **Authentication Flow**
1. User visits any protected route
2. If not logged in, they are redirected to `/signin-3`
3. User enters credentials
4. If valid, user is logged in and redirected to `/subscription`
5. If invalid, error message is shown
6. Once logged in, user can access all protected routes

### 4. **Logout**
- Click on user profile in header
- Select "Logout" from dropdown
- User is logged out and redirected to signin page

## Files Added/Modified

### New Files:
- `src/contexts/AuthContext.tsx` - Authentication context provider
- `src/components/auth/ProtectedRoute.tsx` - Route protection component
- `src/hooks/useAuthRedirect.ts` - Hook for redirecting authenticated users
- `middleware.ts` - Server-side route protection

### Modified Files:
- `src/app/layout.tsx` - Added AuthProvider wrapper
- `src/app/(features)/layout.tsx` - Added ProtectedRoute wrapper
- `src/app/(layout-pages)/layout.tsx` - Added ProtectedRoute wrapper
- `src/app/(auth)/signin-3/signinThree.tsx` - Fixed signin form
- `src/core/common/header/header.tsx` - Added logout functionality

## Usage

### For Developers:
1. **Protect a new route:** Wrap it with `<ProtectedRoute>` component
2. **Check authentication:** Use `useAuth()` hook
3. **Redirect authenticated users:** Use `useAuthRedirect()` hook

### For Users:
1. Navigate to any page
2. If not logged in, you'll be redirected to signin
3. Use the credentials above to log in
4. Access all protected routes

## Security Features

- **Client-side protection:** React components check authentication state
- **Server-side protection:** Middleware redirects unauthenticated requests
- **Local storage:** User session persists across browser refreshes
- **Automatic redirects:** Users can't access protected routes without authentication

## Notes

- This is a simple authentication system for demonstration purposes
- In production, you should implement proper JWT tokens, refresh tokens, and secure API endpoints
- The current system stores user data in localStorage (not recommended for production)
- Consider adding password hashing, rate limiting, and other security measures for production use
