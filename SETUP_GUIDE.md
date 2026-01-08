# EduShare - Frontend & Backend Integration Guide

## Complete Setup Instructions

### 1. Azure Cosmos DB Setup

#### Step 1: Create Cosmos DB Account
1. Go to [Azure Portal](https://portal.azure.com)
2. Click "Create a resource" → Search for "Azure Cosmos DB"
3. Select "Azure Cosmos DB for NoSQL"
4. Fill in the details:
   - **Resource Group**: Create new or use existing
   - **Account Name**: Choose a unique name (e.g., `edushare-db`)
   - **Location**: Choose nearest region
   - **Capacity mode**: Serverless (for development) or Provisioned
5. Click "Review + Create" → "Create"
6. Wait for deployment to complete (5-10 minutes)

#### Step 2: Create Database and Container
1. Open your Cosmos DB account
2. Go to "Data Explorer"
3. Click "New Database"
   - **Database id**: `edushare`
   - Click OK
4. Click "New Container"
   - **Database id**: Use existing → `edushare`
   - **Container id**: `users`
   - **Partition key**: `/type`
   - Click OK

#### Step 3: Get Connection Details
1. In your Cosmos DB account, go to "Keys" (under Settings)
2. Copy the following:
   - **URI**: The endpoint URL
   - **PRIMARY KEY**: The primary key

### 2. Backend Configuration

#### Update `.env` file:
```env
COSMOS_ENDPOINT=https://your-account-name.documents.azure.com:443/
COSMOS_KEY=your-primary-key-here
DATABASE_NAME=edushare
CONTAINER_NAME=users
PORT=3000
```

Replace:
- `your-account-name` with your Cosmos DB account name
- `your-primary-key-here` with the PRIMARY KEY you copied

### 3. Start the Backend Server

Open a terminal in the `backend` folder:

```powershell
cd C:\Users\DELL\Desktop\Cloud\backend
npm run dev
```

You should see:
```
Server running on port 3000
✅ Connected to Cosmos DB successfully
Database: edushare, Container: users
```

### 4. Frontend Setup

The frontend files are ready to use. Simply open any HTML file in your browser:

1. **Landing Page**: `index.html`
2. **Register**: `register.html`
3. **Login**: `login.html` (or index.html)
4. **Files**: `files.html`

### 5. Testing the Integration

#### Test Registration:
1. Open `register.html` in your browser
2. Fill in the registration form:
   - First Name: John
   - Last Name: Doe
   - Email: john@university.edu
   - Password: password123
3. Click "Create Account"
4. You should see a success message and be redirected to login

#### Test Login:
1. Open `login.html` (or `index.html`)
2. Enter the credentials you just registered
3. Click "Login"
4. You should see a success message and be redirected to `files.html`

#### Verify in Azure Portal:
1. Go to Azure Portal → Your Cosmos DB account
2. Open "Data Explorer"
3. Navigate to: `edushare` → `users` → `Items`
4. You should see your registered user with hashed password

## API Endpoints

### Authentication

#### Register User
- **URL**: `POST http://localhost:3000/api/auth/register`
- **Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@university.edu",
  "password": "password123"
}
```
- **Success Response (201)**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "user_1234567890_abc123",
    "type": "user",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@university.edu",
    "createdAt": "2026-01-08T12:00:00.000Z",
    "updatedAt": "2026-01-08T12:00:00.000Z"
  }
}
```

#### Login User
- **URL**: `POST http://localhost:3000/api/auth/login`
- **Body**:
```json
{
  "email": "john@university.edu",
  "password": "password123"
}
```
- **Success Response (200)**:
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "user_1234567890_abc123",
    "type": "user",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@university.edu"
  }
}
```

## Frontend Features

### Authentication Flow:
1. **Register** → Creates account → Stores email in localStorage → Redirects to login
2. **Login** → Validates credentials → Stores user data in localStorage → Redirects to files.html
3. **Files Page** → Checks if user is logged in → Shows user info or redirects to login

### Local Storage:
- `user`: Full user object (without password)
- `isLoggedIn`: Boolean flag
- `userEmail`: Email address (if "Remember me" is checked)

## Troubleshooting

### Backend won't start:
- **Error**: "Cannot find module 'express'"
  - **Fix**: Run `npm install` in the backend folder

- **Error**: "Invalid credentials"
  - **Fix**: Check your `.env` file has correct COSMOS_ENDPOINT and COSMOS_KEY

- **Error**: "Container not found"
  - **Fix**: Make sure you created the database and container in Azure Portal

### Frontend can't connect:
- **Error**: "Unable to connect to server"
  - **Fix**: Make sure backend is running on port 3000
  - **Fix**: Check browser console for CORS errors

- **CORS Error**: "Access to fetch has been blocked by CORS policy"
  - **Fix**: Backend already has CORS enabled, try restarting the server

### Login/Register not working:
- Open browser console (F12) to see detailed error messages
- Check backend terminal for server-side errors
- Verify .env configuration is correct

## Security Notes

- ✅ Passwords are hashed using bcrypt with 10 salt rounds
- ✅ Email validation on both client and server
- ✅ SQL injection protection via parameterized queries
- ⚠️ For production, add JWT tokens for session management
- ⚠️ For production, add HTTPS/SSL
- ⚠️ For production, add rate limiting and input sanitization

## Next Steps

1. ✅ Authentication system complete
2. TODO: Add file upload functionality
3. TODO: Add file download functionality  
4. TODO: Add comments persistence to database
5. TODO: Add JWT authentication tokens
6. TODO: Add user profile management
7. TODO: Add password reset functionality

## File Structure
```
C:\Users\DELL\Desktop\Cloud\
├── index.html           (Landing/Login page)
├── index.css
├── register.html        (Registration page)
├── register.css
├── register.js          (✅ NEW - Registration logic)
├── login.html           (Login page)
├── login.css
├── login.js             (✅ NEW - Login logic)
├── files.html           (File management page)
├── files.css
├── files.js
└── backend/
    ├── .env             (✅ UPDATED - Configuration)
    ├── package.json
    ├── server.js        (Express server)
    ├── db.js            (Cosmos DB connection)
    └── routes/
        └── auth.js      (Authentication endpoints)
```

## Quick Start Commands

```powershell
# Start backend (from backend folder)
cd C:\Users\DELL\Desktop\Cloud\backend
npm run dev

# Open frontend (any of these)
start index.html
start register.html  
start login.html
start files.html
```
