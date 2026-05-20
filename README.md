# Notes API - REST API with Authentication & Role-Based Access

**🎉 Live Demo:** https://primetrade-ai-task.vercel.app/

A scalable REST API built with Node.js, Express, and MongoDB featuring secure JWT authentication, role-based access control, and comprehensive API documentation.

## ✅ Core Features

### Backend
- User registration & login with JWT authentication and bcryptjs password hashing
- Role-based access control (user vs admin)
- CRUD APIs for notes management
- API versioning (`/api/v1/`)
- Input validation (Joi) and error handling
- Swagger/OpenAPI documentation
- MongoDB database with proper schema

### Admin Dashboard
- View all users and manage roles
- Delete users (cascades to delete user notes)
- View and delete all notes from all users
- System statistics (total users, admins, notes count)

### Frontend
- User registration and login pages
- Protected dashboard (JWT required)
- Notes CRUD operations
- Admin dashboard with management tools
- Responsive design

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Authentication | JWT (jsonwebtoken), bcryptjs |
| Validation | Joi |
| Frontend | React.js, Vite, Axios |
| Documentation | Swagger/OpenAPI |

## 📦 Installation & Setup

### Backend
```bash
cd backend
npm install
```
Create `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/notes-app
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRY=7d
NODE_ENV=development
```
Start: `npm start` → http://localhost:5000

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on: http://localhost:5173

## 🔐 Admin Access

**Demo Credentials:**
- Email: `aniket1@gmail.com`
- Password: `123456`

**Login Steps:**
1. Go to login page
2. Click "👨‍💼 Admin Login" button
3. Enter credentials above
4. Access Admin Dashboard for user management, notes management, and statistics

## 📚 API Documentation

**Base URL:** `http://localhost:5000/api/v1`

**Authentication:** All protected endpoints require Bearer token
```
Authorization: Bearer <your_jwt_token>
```

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |
| POST | `/notes` | Create note |
| GET | `/notes` | Get user's notes (admin sees all) |
| PUT | `/notes/{id}` | Update note |
| DELETE | `/notes/{id}` | Delete note |
| GET | `/admin/users` | Get all users (admin only) |
| PUT | `/admin/users/{id}/role` | Change user role (admin only) |
| DELETE | `/admin/users/{id}` | Delete user (admin only) |
| GET | `/admin/stats` | Get statistics (admin only) |

**For complete API documentation, refer to `swagger.json` file and import into Postman or Swagger UI.**

## 🗄️ Database Schema

### User
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (hashed),
  role: String (enum: 'user' | 'admin', default: 'user'),
  createdAt: Date,
  updatedAt: Date
}
```

### Note
```javascript
{
  title: String (required, max: 200),
  content: String (required, max: 5000),
  userId: ObjectId (reference to User),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Security Features

- JWT tokens with 7-day expiration
- Passwords hashed with bcryptjs (10 salt rounds)
- Input validation with Joi schema
- CORS protection
- Role-based access control (RBAC)
- Error handling without exposing sensitive data
- Secure password comparison

## 📊 Scalability Strategy

### Current Implementation
- Modular route structure (auth, notes, admin)
- Separation of concerns (routes, middleware, models)
- Error handling middleware
- Environment-based configuration

### Future Improvements
1. **Microservices:** Separate services for auth, notes, admin
2. **Caching:** Redis for session management and data caching
3. **Database Indexing:** Optimize frequent queries (email, userId)
4. **Rate Limiting:** Prevent abuse with API rate limits
5. **Logging:** Winston/Morgan for comprehensive logging
6. **Load Balancing:** Nginx for distributing traffic
7. **Docker:** Containerize for consistent deployment
8. **API Gateway:** Kong or similar for API management
9. **Message Queue:** Bull for async operations

## � Assignment Compliance

| Requirement | Status |
|------------|--------|
| User registration & login with JWT | ✅ Complete |
| Role-based access (user vs admin) | ✅ Complete |
| CRUD APIs for secondary entity (notes) | ✅ Complete |
| API versioning & error handling | ✅ Complete |
| Swagger/API documentation | ✅ Complete |
| Database schema (MongoDB) | ✅ Complete |
| Frontend UI integration | ✅ Complete |
| Security practices | ✅ Complete |
| Scalability considerations | ✅ Complete |

---

**Status:** ✅ Complete | **Deployment:** ✅ Ready
