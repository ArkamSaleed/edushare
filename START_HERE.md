# 🚀 START HERE - Quick Setup Guide

## Step-by-Step Instructions

### ⚠️ IMPORTANT: You need to configure Azure Cosmos DB before the system will work!

---

## 📋 Pre-Setup Checklist

- [x] Backend files created (server.js, db.js, auth.js)
- [x] Frontend integration complete (register.js, login.js, files.js)
- [x] Dependencies installed (express, cors, bcrypt, etc.)
- [ ] **Azure Cosmos DB configured** ⬅️ **YOU NEED TO DO THIS**
- [ ] Backend server started
- [ ] Frontend tested

---

## 🔵 Step 1: Create Azure Cosmos DB Account

### Option A: Using Azure Portal (Recommended)

1. **Go to Azure Portal**
   - Visit: https://portal.azure.com
   - Sign in with your Microsoft account

2. **Create Cosmos DB Account**
   - Click "Create a resource"
   - Search for "Azure Cosmos DB"
   - Select "Azure Cosmos DB for NoSQL"
   - Click "Create"

3. **Configure Account**
   - **Subscription**: Choose your subscription
   - **Resource Group**: Create new or select existing
   - **Account Name**: Choose unique name (e.g., `edushare-db-yourname`)
   - **Location**: Choose nearest region
   - **Capacity mode**: Serverless (cheapest for development)
   - Click "Review + Create"
   - Click "Create"

4. **Wait for Deployment** (5-10 minutes)
   - Watch for "Deployment succeeded" notification

---

## 🗄️ Step 2: Create Database and Container

1. **Open Your Cosmos DB Account**
   - Go to "Data Explorer" in left sidebar

2. **Create Database**
   - Click "New Database"
   - **Database id**: `edushare` (exactly this name)
   - Click OK

3. **Create Container**
   - Click "New Container"
   - **Database**: Use existing → `edushare`
   - **Container id**: `users` (exactly this name)
   - **Partition key**: `/type` (exactly this, with the slash)
   - Click OK

---

## 🔑 Step 3: Get Your Credentials

1. **Go to Keys**
   - In your Cosmos DB account, click "Keys" (under Settings)

2. **Copy Your Credentials**
   - Copy **URI** (looks like: `https://your-account.documents.azure.com:443/`)
   - Copy **PRIMARY KEY** (long string of random characters)

---

## ⚙️ Step 4: Configure Backend

1. **Open File Explorer**
   - Navigate to: `C:\Users\DELL\Desktop\Cloud\backend`

2. **Edit .env file**
   - Open `.env` in any text editor (Notepad, VS Code, etc.)
   
3. **Update Configuration**
   - Replace `<your-account>` with your Cosmos DB account name
   - Replace `<your-primary-key>` with the PRIMARY KEY you copied
   
   **Example:**
   ```env
   COSMOS_ENDPOINT=https://edushare-db-john.documents.azure.com:443/
   COSMOS_KEY=ABC123xyz789verylongkeystringhere==
   DATABASE_NAME=edushare
   CONTAINER_NAME=users
   PORT=3000
   ```

4. **Save the file**

---

## ▶️ Step 5: Start Backend Server

1. **Open PowerShell**
   - Right-click in the `backend` folder
   - Select "Open PowerShell window here"
   
   OR
   
   - Press Windows + R
   - Type: `powershell`
   - Run: `cd C:\Users\DELL\Desktop\Cloud\backend`

2. **Start Server**
   ```powershell
   npm run dev
   ```

3. **Verify Success**
   You should see:
   ```
   [nodemon] starting `node server.js`
   Server is running on port 3000
   ✅ Connected to Cosmos DB successfully
   Database: edushare, Container: users
   ```

   ❌ **If you see errors:**
   - Check your .env file
   - Verify credentials from Azure Portal
   - Make sure database and container are created

---

## 🌐 Step 6: Test Frontend

### Option 1: Using Test Page (Recommended First)

1. **Open test-api.html**
   ```powershell
   cd C:\Users\DELL\Desktop\Cloud
   start test-api.html
   ```

2. **Run Tests**
   - Click "Test Health Endpoint" → Should show ✅ Success
   - Fill in registration form
   - Click "Test Registration" → Should create user
   - Click "Test Login" → Should authenticate

### Option 2: Using Actual Pages

1. **Open Registration**
   ```powershell
   start register.html
   ```

2. **Create Account**
   - Fill in all fields
   - Click "Create Account"
   - Watch for success message
   - Should redirect to login

3. **Login**
   - Enter your credentials
   - Click "Login"
   - Should redirect to files.html

4. **Verify**
   - Check top-right corner shows your name
   - Try logout button
   - Try accessing files.html when logged out

---

## ✅ Verify in Azure Portal

1. **Go to Data Explorer**
   - In your Cosmos DB account
   - Navigate: `edushare` → `users` → `Items`

2. **Check User Data**
   - You should see your user document
   - Password should be hashed (starts with `$2a$10$`)
   - Email should be lowercase

---

## 🎉 You're Done!

If everything above worked, your system is fully functional!

---

## 🆘 Troubleshooting

### "Cannot connect to Cosmos DB"
**Problem:** Wrong credentials or database not created

**Solution:**
1. Double-check .env file
2. Verify credentials in Azure Portal → Keys
3. Make sure you created database `edushare` and container `users`
4. Restart backend server

---

### "Unable to connect to server"
**Problem:** Backend not running

**Solution:**
1. Start backend: `cd backend; npm run dev`
2. Check if port 3000 is in use
3. Look for errors in PowerShell

---

### "Invalid email format" or "User already exists"
**Problem:** This is actually working correctly!

**Solution:**
- "Invalid email format": Use proper email (user@domain.com)
- "User already exists": Use different email or try logging in

---

### Registration works but login doesn't
**Problem:** Might be password mismatch

**Solution:**
1. Check you're using the same password
2. Try registering a new user
3. Check browser console (F12) for errors

---

## 📁 File Locations

```
C:\Users\DELL\Desktop\Cloud\
├── backend\
│   └── .env          ⬅️ EDIT THIS FILE
├── register.html     ⬅️ START HERE
├── login.html
├── files.html
└── test-api.html     ⬅️ OR START HERE
```

---

## 🔄 Quick Commands

```powershell
# Start backend (ALWAYS RUN THIS FIRST)
cd C:\Users\DELL\Desktop\Cloud\backend
npm run dev

# Open test page
cd C:\Users\DELL\Desktop\Cloud
start test-api.html

# Open registration
start register.html

# Check if backend is running
curl http://localhost:3000/health
```

---

## 📞 Need More Help?

Check these files in order:
1. **START_HERE.md** ⬅️ You are here
2. **SETUP_GUIDE.md** - Detailed instructions
3. **INTEGRATION_STATUS.md** - Technical details
4. **README.md** - Full documentation

---

## 🎯 Success Criteria

You know it's working when:
- ✅ Backend starts without errors
- ✅ Test page shows all green ✅
- ✅ Can register new user
- ✅ Can login with credentials  
- ✅ files.html shows your name
- ✅ Logout works
- ✅ User appears in Azure Data Explorer

---

## ⏱️ Estimated Time

- Azure setup: 15-20 minutes
- Backend configuration: 5 minutes
- Testing: 5-10 minutes
- **Total: ~30-40 minutes**

---

## 💡 Pro Tips

1. **Keep backend terminal open** - Watch for errors
2. **Use test-api.html first** - Easier to debug
3. **Check browser console** - Press F12 for details
4. **Verify in Azure** - Confirm data is saved
5. **Clear localStorage** - If you get stuck: `localStorage.clear()`

---

**Ready to start? Go to Step 1! 👆**
