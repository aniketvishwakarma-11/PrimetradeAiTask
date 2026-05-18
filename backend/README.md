# Notes API - Backend

## Overview
REST API with JWT Authentication, Role-Based Access Control, and CRUD operations for Notes management.

## Features
- ✅ User registration & login with password hashing (bcryptjs)
- ✅ JWT token-based authentication
- ✅ Role-based access control (user vs admin)
- ✅ CRUD operations for Notes
- ✅ Ownership validation (users can only access their own notes)
- ✅ Admin access (admins can view/modify any note)
- ✅ Input validation & error handling
- ✅ Swagger API documentation
- ✅ MongoDB database with Mongoose ODM

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: Joi
- **Documentation**: Swagger/OpenAPI

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)

### Setup Steps

1. **Clone or extract the project**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Edit `.env` file with your MongoDB URI and JWT secret:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/notes_api
     JWT_SECRET=your_jwt_secret_key_change_in_production
     JWT_EXPIRY=7d
     NODE_ENV=development
     ```
   - For MongoDB Atlas:
     ```
     MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/notes_api?retryWrites=true&w=majority
     ```

4. **Start the server**
   ```bash
   # Development (with auto-reload)
   npm run dev

   # Production
   npm start
   ```

   Expected output:
   ```
   ✅ MongoDB Connected: localhost
   🚀 Server running on http://localhost:5000
   📚 API Documentation available at http://localhost:5000/api-docs
   ```

## API Endpoints

### Authentication

#### Register User
```
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}

Response (201):
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Login User
```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Notes CRUD (All Protected Routes - Requires JWT Token)

#### Create Note
```
POST /api/v1/notes
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My First Note",
  "content": "This is the content of my note"
}

Response (201):
{
  "success": true,
  "message": "Note created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "My First Note",
    "content": "This is the content of my note",
    "userId": "507f1f77bcf86cd799439011",
    "createdAt": "2023-09-20T10:00:00.000Z",
    "updatedAt": "2023-09-20T10:00:00.000Z"
  }
}
```

#### Get All Notes (User sees only their notes, Admin sees all)
```
GET /api/v1/notes
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Notes retrieved successfully",
  "count": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "My First Note",
      "content": "This is the content of my note",
      "userId": "507f1f77bcf86cd799439011",
      "createdAt": "2023-09-20T10:00:00.000Z",
      "updatedAt": "2023-09-20T10:00:00.000Z"
    }
  ]
}
```

#### Get Single Note
```
GET /api/v1/notes/{id}
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Note retrieved successfully",
  "data": { ... }
}

Response (403) - if accessing another user's note:
{
  "success": false,
  "message": "You do not have permission to access this note"
}
```

#### Update Note
```
PUT /api/v1/notes/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content"
}

Response (200):
{
  "success": true,
  "message": "Note updated successfully",
  "data": { ... }
}
```

#### Delete Note
```
DELETE /api/v1/notes/{id}
Authorization: Bearer <token>

Response (204): No Content
```

### Health Check
```
GET /health

Response (200):
{
  "success": true,
  "message": "Server is running"
}
```

## API Documentation
Interactive API documentation is available at:
```
http://localhost:5000/api-docs
```

## Error Handling

| Status Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Created |
| 204 | No Content (successful delete) |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden (no permission) |
| 404 | Not Found |
| 500 | Server Error |

### Example Error Response
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": ["title is required"]
}
```

## Security Features

- ✅ **Password Hashing**: Bcryptjs with salt rounds
- ✅ **JWT Authentication**: Secure token-based auth
- ✅ **Role-Based Access**: Admin vs User roles
- ✅ **Ownership Validation**: Users can't access other users' notes
- ✅ **Input Validation**: Joi schema validation on all inputs
- ✅ **Error Handling**: Secure error messages (no sensitive info leakage)
- ✅ **CORS**: Enabled for cross-origin requests

## Scalability Considerations

### Current Implementation
- Stateless API (horizontally scalable)
- Database indexing on userId for fast queries
- Validation and error handling at all levels

### Future Enhancements
1. **Caching (Redis)**: Cache frequently accessed notes and user data
2. **Database Replication**: Use MongoDB replica sets for high availability
3. **Load Balancing**: Deploy multiple instances behind a load balancer (Nginx, HAProxy)
4. **Rate Limiting**: Add rate limiting middleware to prevent abuse
5. **Pagination**: Add pagination to GET /api/v1/notes endpoint
6. **Search**: Implement full-text search on note titles and content
7. **Microservices**: Split auth and notes services for independent scaling
8. **Message Queue**: Use Redis/RabbitMQ for async operations (notifications, logging)
9. **API Versioning**: Already implemented (/api/v1) for breaking changes
10. **Logging**: Implement structured logging (Winston, Morgan) for monitoring
11. **Monitoring**: Add APM tools (New Relic, DataDog) for performance tracking

## Testing

### Using curl

**Register User**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"123456"}'
```

**Login**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"123456"}'
```

**Create Note** (Replace TOKEN with actual JWT token)
```bash
curl -X POST http://localhost:5000/api/v1/notes \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"My Note","content":"Note content"}'
```

**Get All Notes**
```bash
curl -X GET http://localhost:5000/api/v1/notes \
  -H "Authorization: Bearer TOKEN"
```

## Directory Structure
```
backend/
├── src/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js            # JWT verification
│   │   ├── authorize.js       # Role-based access
│   │   ├── errorHandler.js    # Error handling
│   │   └── validation.js      # Request validation
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Note.js            # Note schema
│   ├── routes/
│   │   ├── auth.js            # Authentication endpoints
│   │   └── notes.js           # CRUD endpoints
│   └── index.js               # Main entry point
├── package.json               # Dependencies
├── .env                       # Environment variables
├── .gitignore                 # Git ignore rules
└── README.md                  # Documentation
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first.

## License
ISC
