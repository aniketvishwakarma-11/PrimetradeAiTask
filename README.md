# Notes API - REST API with Authentication & Role-Based Access

A scalable REST API built with Node.js, Express, and MongoDB featuring secure JWT authentication, role-based access control, and comprehensive API documentation.

## 📋 Project Overview

This project implements a complete backend API with user authentication, authorization, and CRUD operations for notes management. It includes both a robust backend API and a functional React frontend for testing.

## ✅ Core Features Implemented

### Backend (Primary Focus)
- ✅ User registration & login APIs with password hashing (bcryptjs) and JWT authentication
- ✅ Role-based access control (user vs admin)
- ✅ CRUD APIs for notes management
- ✅ API versioning (`/api/v1/`)
- ✅ Comprehensive error handling and validation
- ✅ Swagger/OpenAPI documentation
- ✅ MongoDB database with proper schema design

### Admin Features
- ✅ View all users
- ✅ Manage user roles (promote/demote users to/from admin)
- ✅ Delete users (cascades to delete user notes)
- ✅ View all notes from all users
- ✅ Delete any note
- ✅ System statistics dashboard

### Frontend (Supportive)
- ✅ Built with React.js and Vite
- ✅ User registration and login pages
- ✅ Protected dashboard (JWT required)
- ✅ Notes CRUD operations
- ✅ Admin dashboard with management tools
- ✅ Error/success message handling
- ✅ Responsive design

### Security & Scalability
- ✅ Secure JWT token handling with expiration
- ✅ Password hashing with bcryptjs (10 salt rounds)
- ✅ Input validation using Joi schema validation
- ✅ CORS enabled for cross-origin requests
- ✅ Scalable project structure with separate routes, middleware, models
- ✅ Error handling middleware
- ✅ Environment variables for configuration

## 🚀 Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Validation:** Joi
- **API Documentation:** Swagger/OpenAPI
- **Environment Management:** dotenv

### Frontend
- **Framework:** React.js
- **Build Tool:** Vite
- **Routing:** React Router
- **HTTP Client:** Axios
- **Styling:** CSS3

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/notes-app
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRY=7d
NODE_ENV=development
```

4. Start the server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🔐 Admin Access

### Admin Credentials (Demo Account)
```
Email: aniket1@gmail.com
Password: 123456
```

### How to Login as Admin

1. Go to the login page
2. Click on **"👨‍💼 Admin Login"** button
3. Enter the credentials above
4. Click **"Login as Admin"**
5. You'll be redirected to the Admin Dashboard where you can:
   - View system statistics
   - Manage all users and their roles
   - View and delete all notes

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Endpoints

#### Authentication

**POST** `/auth/register`
- Register a new user
- Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
- Response: `201 Created`

**POST** `/auth/login`
- Login user
- Body:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- Response: `200 OK` with JWT token

#### Notes (User)

**POST** `/notes`
- Create a new note (authenticated)
- Headers: `Authorization: Bearer <token>`
- Body:
```json
{
  "title": "My Note",
  "content": "Note content here"
}
```
- Response: `201 Created`

**GET** `/notes`
- Get user's notes or all notes if admin (authenticated)
- Headers: `Authorization: Bearer <token>`
- Response: `200 OK` with notes array

**GET** `/notes/{id}`
- Get a specific note (authenticated, user sees own notes only, admin sees all)
- Headers: `Authorization: Bearer <token>`
- Response: `200 OK`

**PUT** `/notes/{id}`
- Update a note (authenticated, user updates own notes only, admin updates any)
- Headers: `Authorization: Bearer <token>`
- Body:
```json
{
  "title": "Updated Title",
  "content": "Updated content"
}
```
- Response: `200 OK`

**DELETE** `/notes/{id}`
- Delete a note (authenticated, user deletes own notes only, admin deletes any)
- Headers: `Authorization: Bearer <token>`
- Response: `200 OK`

#### Admin Routes

**GET** `/admin/users`
- Get all users (admin only)
- Headers: `Authorization: Bearer <admin_token>`
- Response: `200 OK` with users array

**GET** `/admin/users/{id}`
- Get specific user (admin only)
- Headers: `Authorization: Bearer <admin_token>`
- Response: `200 OK`

**PUT** `/admin/users/{id}/role`
- Update user role (admin only)
- Headers: `Authorization: Bearer <admin_token>`
- Body:
```json
{
  "role": "admin"
}
```
- Response: `200 OK`

**DELETE** `/admin/users/{id}`
- Delete user and their notes (admin only)
- Headers: `Authorization: Bearer <admin_token>`
- Response: `200 OK`

**GET** `/admin/notes`
- Get all notes from all users (admin only)
- Headers: `Authorization: Bearer <admin_token>`
- Response: `200 OK`

**DELETE** `/admin/notes/{id}`
- Delete any note (admin only)
- Headers: `Authorization: Bearer <admin_token>`
- Response: `200 OK`

**GET** `/admin/stats`
- Get system statistics (admin only)
- Headers: `Authorization: Bearer <admin_token>`
- Response: `200 OK` with statistics

## 📖 Swagger Documentation

For complete API documentation in Swagger/OpenAPI format, refer to the **`swagger.json`** file in the project root directory.

You can use Swagger UI or import the swagger.json file into tools like:
- **Postman** - Import → Raw Text → Paste swagger.json
- **Thunder Client** - Import → From URL → point to swagger.json
- **Swagger UI** - Visit http://localhost:5000/api-docs (when backend is running)

## 🗄️ Database Schema

### User Model
```
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['user', 'admin'], default: 'user'),
  createdAt: Date,
  updatedAt: Date
}
```

### Note Model
```
{
  title: String (required, max: 200),
  content: String (required, max: 5000),
  userId: ObjectId (reference to User),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Security Features

- ✅ JWT tokens with 7-day expiration
- ✅ Passwords hashed with bcryptjs (10 salt rounds)
- ✅ Input validation with Joi
- ✅ CORS protection
- ✅ Role-based access control
- ✅ Error handling without exposing sensitive data
- ✅ Secure password comparison

## 📊 Scalability Considerations

### Current Architecture
- Modular route structure (auth, notes, admin)
- Separation of concerns (routes, middleware, models)
- Error handling middleware
- Environment-based configuration

### Future Scalability Improvements
1. **Microservices:** Separate auth, notes, and admin services
2. **Caching:** Redis for session management and frequently accessed data
3. **Database Indexing:** Add indexes on frequently queried fields (email, userId)
4. **Rate Limiting:** Implement rate limiting to prevent abuse
5. **Logging:** Add comprehensive logging (Winston/Morgan)
6. **Load Balancing:** Use Nginx for load balancing across multiple server instances
7. **Docker:** Containerize the application for easy deployment
8. **Message Queue:** Implement job queues (Bull) for async operations
9. **API Gateway:** Add Kong or similar for API management

## 📁 Project Structure

```
Asstask2/
├── backend/
│   ├── src/
│   │   ├── index.js
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── authorize.js
│   │   │   ├── errorHandler.js
│   │   │   └── validation.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Note.js
│   │   └── routes/
│   │       ├── auth.js
│   │       ├── notes.js
│   │       └── admin.js
│   ├── package.json
│   ├── .env
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── NotesPage.jsx
│   │   │   └── AdminPage.jsx
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   └── styles/
│   │       └── AdminPage.css
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
└── README.md
```

## 🧪 Testing the API

### Using Postman/Thunder Client
1. Import the swagger.json file
2. Create collection with all endpoints
3. Set up environment variables (token)
4. Test each endpoint

### Using cURL
```bash
# Register
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"123456"}'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"123456"}'

# Get Notes (with token)
curl -X GET http://localhost:5000/api/v1/notes \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## ✨ Features Highlights

- 🔐 Secure JWT authentication with role-based access
- 📱 Responsive frontend with modern React
- 🗄️ MongoDB integration with proper schema design
- 📚 Complete Swagger documentation
- 👨‍💼 Comprehensive admin dashboard
- ✅ Input validation on all endpoints
- 🎯 RESTful API design
- 🛡️ Security best practices implemented
- 📊 System statistics dashboard
- 🚀 Scalable architecture

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements.

## 📝 License

This project is open source and available under the MIT License.

## 📧 Contact & Support

For issues or questions, please open an issue in the GitHub repository.

---

**Assignment Status:** ✅ Complete
**All Requirements:** ✅ Implemented
**Deployment Ready:** ✅ Yes
