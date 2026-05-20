# Notes API - Enterprise-Grade REST API with Authentication & Role-Based Access

**🎉 Live Demo:** https://primetrade-ai-task.vercel.app/

A production-ready REST API built with Node.js, Express, and MongoDB featuring secure JWT authentication, role-based access control (RBAC), comprehensive API documentation, and enterprise-grade scalability patterns.

---

## 📋 Project Overview

| Aspect | Details |
|--------|---------|
| **Backend** | Node.js + Express.js with MongoDB |
| **Frontend** | React.js + Vite + Axios |
| **Authentication** | JWT (7-day expiry) + bcryptjs hashing |
| **Authorization** | Role-Based Access Control (User/Admin) |
| **Documentation** | Swagger/OpenAPI + Postman Ready |
| **Deployment** | Backend (Render), Frontend (Vercel) |
| **Status** | ✅ Production Ready |

---

## 🚀 Core Features

### Backend Features
| Feature | Description |
|---------|-------------|
| **User Authentication** | JWT-based registration/login with email validation |
| **Password Security** | bcryptjs hashing (10 salt rounds) + secure comparison |
| **Role-Based Access Control** | User vs Admin roles with middleware enforcement |
| **Notes CRUD** | Complete create, read, update, delete operations |
| **Admin Dashboard API** | User management, notes management, statistics |
| **Input Validation** | Joi schema validation on all endpoints |
| **Error Handling** | Comprehensive error middleware with proper HTTP status codes |
| **API Versioning** | Semantic versioning at `/api/v1/` |
| **Swagger Documentation** | OpenAPI 3.0 spec with interactive UI |

### Frontend Features
| Feature | Description |
|---------|-------------|
| **Authentication UI** | Register & login pages with mode selector (User/Admin) |
| **Protected Routes** | JWT-protected dashboard and admin pages |
| **Notes Management** | Create, read, update, delete notes with real-time UI |
| **Admin Panel** | User management, role assignment, statistics dashboard |
| **Responsive Design** | Mobile-friendly UI with modern styling |
| **Environment Configuration** | All API URLs from environment variables (no hardcoding) |
| **Error Handling** | User-friendly error messages and feedback |

---

## 🏗️ Architecture & Design

### Project Structure
```
project/
├── backend/
│   ├── src/
│   │   ├── index.js              # Express app setup
│   │   ├── config/
│   │   │   └── db.js            # MongoDB connection
│   │   ├── models/
│   │   │   ├── User.js          # User schema
│   │   │   └── Note.js          # Note schema
│   │   ├── routes/
│   │   │   ├── auth.js          # Authentication endpoints
│   │   │   ├── notes.js         # Notes CRUD endpoints
│   │   │   └── admin.js         # Admin management endpoints
│   │   ├── middleware/
│   │   │   ├── auth.js          # JWT verification
│   │   │   ├── authorize.js     # Role-based authorization
│   │   │   ├── validation.js    # Input validation
│   │   │   └── errorHandler.js  # Error handling
│   │   └── controllers/         # Business logic (expandable)
│   ├── .env                     # Environment variables
│   ├── .env.example             # Example configuration
│   └── test.js                  # API testing
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx        # Login with mode selector
│   │   │   ├── RegisterPage.jsx     # User registration
│   │   │   ├── DashboardPage.jsx    # User dashboard
│   │   │   └── AdminPage.jsx        # Admin dashboard
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx   # JWT-protected routes
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Global auth state
│   │   ├── services/
│   │   │   └── api.js               # Centralized API service
│   │   └── App.jsx                  # Main app routing
│   ├── .env                     # Frontend environment variables
│   ├── .env.example             # Example configuration
│   └── vite.config.js           # Vite configuration
├── swagger.json                 # OpenAPI specification
└── README.md                    # This file
```

---

## 🔐 REST API Design & Principles

### HTTP Methods & Status Codes

| Method | Use Case | Status Codes |
|--------|----------|--------------|
| **POST** | Create resource | 201 (Created), 400 (Bad Request), 409 (Conflict) |
| **GET** | Retrieve resource | 200 (OK), 404 (Not Found), 401 (Unauthorized) |
| **PUT** | Update resource | 200 (OK), 400 (Bad Request), 404 (Not Found) |
| **DELETE** | Delete resource | 200 (OK), 404 (Not Found), 401 (Unauthorized) |

### Response Format
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Complete API Endpoints

#### Authentication
```
POST   /api/v1/auth/register          Register new user
POST   /api/v1/auth/login             Login user, receive JWT
```

#### Notes (User)
```
POST   /api/v1/notes                  Create note (protected)
GET    /api/v1/notes                  Get user's notes (protected)
GET    /api/v1/notes/{id}             Get specific note (protected)
PUT    /api/v1/notes/{id}             Update note (protected)
DELETE /api/v1/notes/{id}             Delete note (protected)
```

#### Admin Management
```
GET    /api/v1/admin/users            Get all users (admin only)
GET    /api/v1/admin/users/{id}       Get user details (admin only)
PUT    /api/v1/admin/users/{id}/role  Update user role (admin only)
DELETE /api/v1/admin/users/{id}       Delete user & notes (admin only)
GET    /api/v1/admin/notes            Get all notes from all users (admin only)
DELETE /api/v1/admin/notes/{id}       Delete any note (admin only)
GET    /api/v1/admin/stats            Get system statistics (admin only)
```

---

## 🗄️ Database Schema Design

### User Collection
```javascript
{
  _id: ObjectId,
  name: String (required, min: 2, max: 50),
  email: String (required, unique, lowercase, validated),
  password: String (required, hashed with bcryptjs),
  role: String (enum: ['user', 'admin'], default: 'user'),
  createdAt: Date (indexed),
  updatedAt: Date
}
```

### Note Collection
```javascript
{
  _id: ObjectId,
  title: String (required, max: 200),
  content: String (required, max: 5000),
  userId: ObjectId (reference to User, indexed),
  createdAt: Date (indexed),
  updatedAt: Date
}
```

### Database Optimization
| Index | Collection | Purpose |
|-------|-----------|---------|
| `email` (unique) | User | Fast user lookup, prevent duplicates |
| `userId` | Note | Fast query of user's notes |
| `createdAt` | Note | Sort notes by date |
| `createdAt` | User | User signup analytics |

---

## 🔒 Security Implementation

### Authentication & Authorization

| Security Layer | Implementation |
|----------------|-----------------|
| **Password Hashing** | bcryptjs with 10 salt rounds |
| **JWT Tokens** | Signed with HS256, 7-day expiry |
| **Token Storage** | localStorage on frontend, httpOnly cookies recommended for production |
| **Authorization Header** | Bearer token in Authorization header |
| **CORS** | Configured for origin whitelist |
| **Input Validation** | Joi schema validation on all inputs |
| **Error Messages** | Generic messages to prevent information leakage |

### Middleware Security Stack
```
Request → CORS Check → JSON Parser → Auth Middleware → Role Authorization → Validation → Route Handler
```

### Security Best Practices Implemented
- ✅ Passwords never logged or exposed
- ✅ JWT signature verification
- ✅ Role-based access control enforcement
- ✅ Cascade deletion (user deletion removes user's notes)
- ✅ Email uniqueness constraint
- ✅ Environment-based sensitive data (no hardcoding)

---

## 📚 API Documentation

### Swagger/OpenAPI
**Interactive API Explorer:** Available at deployed backend `/api-docs`

**Location:** `./swagger.json` (OpenAPI 3.0 specification)

### How to Use Documentation

#### Option 1: Swagger UI (Recommended)
```bash
# Backend runs Swagger UI on startup
# Access: http://localhost:5000/api-docs
```

#### Option 2: Postman Collection
1. Import `swagger.json` into Postman
2. Set collection variable: `baseUrl` = `http://localhost:5000/api/v1`
3. Set collection variable: `token` = JWT from login response
4. Test all endpoints with pre-configured requests

#### Option 3: Manual Testing
```bash
# Register
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"pass123"}'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"pass123"}'

# Create Note (with JWT token)
curl -X POST http://localhost:5000/api/v1/notes \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"My Note","content":"Note content"}'
```

---

## 🚀 Installation & Setup

### Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# PORT=5000
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
# JWT_SECRET=your_secret_key
# NODE_ENV=development

# Start server
npm start
# Server runs on http://localhost:5000
# API docs available at http://localhost:5000/api-docs
```

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file
# VITE_API_URL=http://localhost:5000

# Start development server
npm run dev
# Runs on http://localhost:5173
```

---

## 📝 Environment Configuration

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=your_strong_secret_key_here
JWT_EXPIRY=7d
NODE_ENV=development
SWAGGER_URL=http://localhost:5000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

---

**Status:** ✅ Production Ready | **Deployment:** ✅ Active
