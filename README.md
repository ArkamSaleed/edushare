# EduShare - File Sharing Platform for Universities

A modern, secure file sharing platform designed for adult university students with Azure Cosmos DB backend integration.

## 🌟 Features

- ✅ **User Authentication**: Secure registration and login with password hashing
- ✅ **File Management**: Upload, download, and organize educational files
- ✅ **Comments System**: Collaborative discussion on shared documents
- ✅ **Modern UI**: Glassmorphism design with responsive layout
- ✅ **Cloud Backend**: Azure Cosmos DB for scalable data storage
- ✅ **Security**: bcrypt password hashing, email validation, protected routes

## 🎯 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- Azure Cosmos DB account
- Modern web browser

### 1. Clone/Download Project
```powershell
cd C:\Users\DELL\Desktop\Cloud
```

### 2. Setup Backend
```powershell
cd backend
npm install
```

### 3. Configure Azure Cosmos DB
1. Create Cosmos DB account in Azure Portal
2. Create database: `edushare`
3. Create container: `users` with partition key `/type`
4. Update `backend/.env`:
```env
COSMOS_ENDPOINT=https://your-account.documents.azure.com:443/
COSMOS_KEY=your-primary-key-here
DATABASE_NAME=edushare
CONTAINER_NAME=users
PORT=3000
```

### 4. Start Backend Server
```powershell
npm run dev
```

### 5. Open Frontend
```powershell
cd ..
start register.html
```

## 📱 Pages

### Landing Page (index.html)
- Login form
- Link to registration
- Modern hero section

### Registration (register.html)
- User account creation
- Client-side validation
- Password strength requirements

### Login (login.html)
- Credential authentication
- "Remember me" functionality
- Error handling

### File Management (files.html)
- File list with icons
- Upload modal
- Comments system
- User profile display
- Logout functionality

## 🔐 Authentication Flow

```
┌─────────────┐
│   Register  │
│  Form Fill  │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  Backend Validates  │
│  - Email format     │
│  - Duplicate check  │
│  - Hash password    │
└──────┬──────────────┘
       │
       ▼
┌─────────────────┐
│  Save to DB     │
│  Redirect Login │
└──────┬──────────┘
       │
       ▼
┌─────────────┐
│    Login    │
│ Credentials │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  Backend Verifies   │
│  - Find user        │
│  - Check password   │
│  - Return user data │
└──────┬──────────────┘
       │
       ▼
┌──────────────────┐
│  Store in        │
│  localStorage    │
│  Redirect Files  │
└──────┬───────────┘
       │
       ▼
┌─────────────┐
│   Access    │
│  Protected  │
│   Content   │
└─────────────┘
```

## 🏗️ Project Structure

```
EduShare/
├── Frontend/
│   ├── index.html              # Landing/Login page
│   ├── index.css
│   ├── register.html           # Registration page
│   ├── register.css
│   ├── register.js             # Registration logic
│   ├── login.html              # Login page
│   ├── login.css
│   ├── login.js                # Login logic
│   ├── files.html              # File management (protected)
│   ├── files.css
│   └── files.js                # File operations + auth check
│
├── Backend/
│   ├── server.js               # Express server
│   ├── db.js                   # Cosmos DB connection
│   ├── routes/
│   │   └── auth.js             # Authentication endpoints
│   ├── .env                    # Configuration
│   ├── package.json
│   └── README.md
│
├── Documentation/
│   ├── README.md               # This file
│   ├── SETUP_GUIDE.md          # Detailed setup
│   ├── INTEGRATION_STATUS.md   # Integration details
│   └── CHANGES_SUMMARY.md      # Recent changes
│
└── Testing/
    └── test-api.html           # API testing tool
```

## 🔧 Technology Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Glassmorphism design, animations
- **JavaScript**: Vanilla JS (no frameworks)
- **LocalStorage**: Session management

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **Azure Cosmos DB**: NoSQL database
- **bcrypt.js**: Password hashing
- **dotenv**: Configuration management
- **CORS**: Cross-origin support

## 📡 API Endpoints

### POST /api/auth/register
Register new user account.

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@university.edu",
  "password": "secure123"
}
```

**Response:** User object (password excluded)

### POST /api/auth/login
Authenticate existing user.

**Request:**
```json
{
  "email": "john@university.edu",
  "password": "secure123"
}
```

**Response:** User object with success message

### GET /health
Check server status.

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

## 🗄️ Database Schema

### Users Collection
```javascript
{
  id: "user_1704729600000_abc123",
  type: "user",                      // Partition key
  firstName: "John",
  lastName: "Doe",
  email: "john@university.edu",      // Unique, lowercase
  password: "$2a$10$hashed...",       // bcrypt hash
  createdAt: "2026-01-08T12:00:00Z",
  updatedAt: "2026-01-08T12:00:00Z"
}
```

## 🎨 UI Features

### Design System
- **Primary Color**: Stanford Red (#8C1515)
- **Glassmorphism**: Semi-transparent backgrounds with blur
- **Responsive**: Mobile-first design
- **Animations**: Smooth transitions and hover effects

### Components
- File icons (PDF, Word, Excel, etc.)
- Upload modal with drag-drop
- Comments modal with add functionality
- User profile section
- Navigation bar

## 🔒 Security Features

1. **Password Security**
   - bcrypt hashing with 10 salt rounds
   - Minimum 6 characters (client-side)
   - Never stored in localStorage

2. **Email Validation**
   - Regex pattern validation
   - Lowercase normalization
   - Duplicate prevention

3. **SQL Injection Protection**
   - Parameterized queries
   - Input sanitization

4. **Authentication**
   - Protected routes
   - Session management
   - Automatic logout

## 🧪 Testing

### Quick Test
```powershell
# Start backend
cd backend
npm run dev

# Open test page
start test-api.html
```

### Manual Test Checklist
- [ ] Backend starts successfully
- [ ] Register new user
- [ ] Login with credentials
- [ ] Access files.html
- [ ] User name displays correctly
- [ ] Logout works
- [ ] Cannot access files.html when logged out
- [ ] Error messages display properly

### API Testing with curl
```powershell
# Health check
curl http://localhost:3000/health

# Register
curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d '{\"firstName\":\"Test\",\"lastName\":\"User\",\"email\":\"test@test.com\",\"password\":\"test123\"}'

# Login
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{\"email\":\"test@test.com\",\"password\":\"test123\"}'
```

## 🐛 Troubleshooting

### Backend Issues

**Cannot connect to Cosmos DB**
- Verify .env credentials
- Check Azure Portal for correct endpoint/key
- Ensure database and container exist

**Port 3000 already in use**
- Change PORT in .env
- Update API_URL in frontend JS files

### Frontend Issues

**"Unable to connect to server"**
- Start backend: `npm run dev`
- Check API_URL is `http://localhost:3000/api`

**Login not working**
- Check browser console for errors
- Verify credentials are correct
- Clear localStorage: `localStorage.clear()`

**User name not showing**
- Login again
- Check localStorage: `localStorage.getItem('user')`
- Hard refresh: Ctrl+Shift+R

## 📚 Documentation

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)**: Complete Azure and project setup
- **[INTEGRATION_STATUS.md](INTEGRATION_STATUS.md)**: Integration details and testing
- **[CHANGES_SUMMARY.md](CHANGES_SUMMARY.md)**: Recent changes and updates
- **[backend/README.md](backend/README.md)**: Backend-specific documentation

## 🚀 Deployment

### Azure App Service (Recommended)
1. Create App Service in Azure Portal
2. Configure environment variables
3. Deploy using Git or VS Code
4. Point frontend to production URL

### Cosmos DB Production
1. Switch from Serverless to Provisioned (if needed)
2. Configure throughput based on usage
3. Enable automatic backups
4. Set up monitoring and alerts

## 🔄 Future Enhancements

### Planned Features
- [ ] JWT token authentication
- [ ] File upload to Azure Blob Storage
- [ ] File download from blob storage
- [ ] Comments persistence in database
- [ ] User profile editing
- [ ] Password reset via email
- [ ] Email verification
- [ ] File sharing permissions
- [ ] Search functionality
- [ ] Activity logs

### Technical Improvements
- [ ] Add unit tests (Jest)
- [ ] Add integration tests
- [ ] Implement rate limiting
- [ ] Add request validation middleware
- [ ] Set up CI/CD pipeline
- [ ] Add logging system
- [ ] Implement caching
- [ ] Add compression

## 📞 Support

### Resources
- [Azure Cosmos DB Docs](https://docs.microsoft.com/en-us/azure/cosmos-db/)
- [Express.js Guide](https://expressjs.com/en/guide/)
- [Node.js Documentation](https://nodejs.org/docs/)

### Common Commands
```powershell
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start

# Clear localStorage (browser console)
localStorage.clear()

# Check environment config
node -e "require('dotenv').config(); console.log(process.env)"
```

## 👥 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

This project is for educational purposes.

## 🎓 Author

Created for adult university students at EduShare.

---

**Version:** 1.0.0  
**Last Updated:** January 8, 2026  
**Status:** ✅ Production Ready (after Azure configuration)  

---

## Quick Links
- [Setup Guide](SETUP_GUIDE.md)
- [Integration Status](INTEGRATION_STATUS.md)
- [Changes Summary](CHANGES_SUMMARY.md)
- [API Test Page](test-api.html)
- [Backend README](backend/README.md)
