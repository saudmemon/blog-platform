# NexusBlog - Premium Blogging Platform

A modern, responsive blogging platform built with React, Node.js, and MongoDB. Create, share, and manage blog posts with a beautiful, secure interface.

## 🎯 Features

- **Create & Manage Posts**: Full CRUD operations for blog articles
- **Markdown Support**: Write posts in Markdown format with live preview
- **Image Uploads**: Add JPG, PNG, or WebP cover images (max 5MB)
- **Tag Organization**: Categorize posts with tags
- **Responsive Design**: Mobile-friendly UI with modern glassmorphism effects
- **Dark Mode**: Premium dark-mode theme
- **Real-time Validation**: Form validation with helpful error messages
- **Security First**: 
  - XSS protection with DOMPurify
  - Input validation on client and server
  - Secure file upload handling
  - Sanitized HTML rendering

## 📚 Tech Stack

### Frontend
- **React** ^19.2.0 - UI library
- **Vite** ^7.3.1 - Lightning-fast build tool
- **React Router** ^7.13.0 - Client-side routing
- **Axios** ^1.13.5 - HTTP client
- **React Markdown** ^10.1.0 - Markdown rendering
- **DOMPurify** ^3.0.6 - XSS prevention
- **Lucide React** ^0.575.0 - Icon library

### Backend
- **Node.js** v18+
- **Express** ^5.2.1 - Web framework
- **Mongoose** ^9.2.1 - MongoDB ODM
- **Multer** ^2.0.2 - File upload handling
- **CORS** ^2.8.6 - Cross-Origin Resource Sharing
- **Dotenv** ^17.3.1 - Environment variable management

### Database
- **MongoDB** - NoSQL database with schema validation and indexing

## 📋 Prerequisites

- **Node.js**: v18 or higher
- **npm** or **yarn**: Latest version
- **MongoDB**: Running locally or MongoDB Atlas connection string
- **Git**: For version control

## 🚀 Getting Started

### 1. Clone & Setup Environment

```bash
# Clone the repository
git clone <repo-url>
cd blog-platform

# Install root dependencies (for concurrent dev server)
npm install
```

### 2. Setup Backend Server

```bash
cd server

# Install dependencies
npm install

# Create .env file from template
cp .env.example .env

# Edit .env and add your MongoDB URI
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/blog-platform
nano .env

# Start development server (with auto-reload)
npm run dev
```

**Backend runs on**: `http://localhost:5000`

### 3. Setup Frontend Client

```bash
cd client

# Install dependencies
npm install

# Create .env file from template
cp .env.example .env

# Start development server
npm run dev
```

**Frontend runs on**: `http://localhost:5173`

### 4. Run Both Together

From the root directory:

```bash
npm run dev
```

This starts both backend and frontend in parallel using `concurrently`.

## 📁 Project Structure

```
blog-platform/
├── server/                          # Node.js + Express backend
│   ├── .env.example                 # Environment template
│   ├── config/db.js                 # MongoDB connection
│   ├── models/Post.js               # Mongoose schema with validation
│   ├── routes/posts.js              # API endpoints with validation
│   ├── uploads/                     # File storage directory
│   └── index.js                     # Server entry point
├── client/                          # React + Vite frontend
│   ├── .env.example                 # Environment template
│   ├── src/
│   │   ├── App.jsx                  # Main app with routing
│   │   ├── main.jsx                 # React entry point
│   │   ├── components/Navbar.jsx    # Navigation
│   │   └── pages/
│   │       ├── HomePage.jsx         # Post listing
│   │       ├── PostPage.jsx         # Post detail view
│   │       └── EditorPage.jsx       # Create/edit posts
│   └── index.html                   # HTML entry
└── package.json                     # Root package config

```

## 🔒 Security Features

### Input Validation
- **Client-side**: Real-time form validation with error messages
- **Server-side**: Comprehensive input validation for all fields
  - Title: 1-200 characters
  - Content: 1-10,000 characters
  - Author: 0-100 characters
  - Tags: 0-50 characters each, alphanumeric + hyphens/underscores

### File Upload Security
- **Type Validation**: Only JPG, PNG, and WebP images allowed
- **Size Limit**: Maximum 5MB per file
- **Filename Sanitization**: Random names to prevent directory traversal
- **File Cleanup**: Automatic deletion when posts are deleted

### XSS Protection
- **DOMPurify**: All HTML content sanitized before rendering
- **Markdown Rendering**: Safe markdown-to-HTML conversion
- **ObjectId Validation**: MongoDB ID validation on all routes

### Error Handling
- **Global Error Handler**: Catches unhandled server errors
- **User-friendly Messages**: No sensitive info exposed in production
- **Request Validation**: Validates all incoming requests

## 🛠️ API Endpoints

### Posts API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | Get all posts (sorted by date, newest first) |
| GET | `/api/posts/:id` | Get single post by ID |
| POST | `/api/posts` | Create new post (multipart/form-data) |
| PUT | `/api/posts/:id` | Update post (multipart/form-data) |
| DELETE | `/api/posts/:id` | Delete post and associated files |

### Request Examples

**Create Post (POST /api/posts)**
```bash
curl -X POST http://localhost:5000/api/posts \
  -F "title=My First Post" \
  -F "content=This is markdown content" \
  -F "author=John Doe" \
  -F "tags=tech,tutorial" \
  -F "image=@path/to/image.jpg"
```

**Update Post (PUT /api/posts/:id)**
```bash
curl -X PUT http://localhost:5000/api/posts/123abc \
  -F "title=Updated Title" \
  -F "content=Updated content" \
  -F "image=@path/to/new-image.png"
```

## ⚙️ Environment Variables

### Server (.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/blog-platform

# File Upload
MAX_FILE_SIZE=5242880  # 5MB in bytes
```

### Client (.env)
```env
# API Configuration
VITE_API_URL=http://localhost:5000
```

## 📝 Validation Rules

| Field | Rules | Error Messages |
|-------|-------|----------------|
| Title | Required, 1-200 chars | "Title is required" / "Title must not exceed 200 characters" |
| Content | Required, 1-10,000 chars | "Content is required" / "Content must not exceed 10,000 characters" |
| Author | Optional, 0-100 chars | "Author name must not exceed 100 characters" |
| Tags | Each 1-50 chars, alphanumeric | "Tag must not exceed 50 characters" / Invalid characters |
| Image | JPG/PNG/WebP, max 5MB | "Invalid file type" / "File size exceeds 5MB" |

## 🧪 Testing

### Manual Testing Checklist

- [ ] Create a new post with all fields
- [ ] Create a post with an image
- [ ] Edit an existing post
- [ ] Delete a post (confirm modal appears)
- [ ] Try uploading invalid file type (should show error)
- [ ] Try uploading file > 5MB (should show error)
- [ ] Try submitting empty title/content (should show validation error)
- [ ] Try XSS attack in content (`<script>alert('xss')</script>`) - should be escaped
- [ ] Visit invalid route (should show 404)

### Build & Run for Production

```bash
# Build frontend
cd client
npm run build

# Build is output to client/dist/

# Start production server
cd server
NODE_ENV=production npm start
```

## 🐛 Troubleshooting

### Server won't start
```
Error: Connect ECONNREFUSED 127.0.0.1:27017
```
- MongoDB is not running. Start it or update MONGO_URI to use MongoDB Atlas

### Frontend can't connect to API
```
Error: Failed to fetch posts
```
- Ensure backend is running on the configured VITE_API_URL
- Check CORS configuration (should allow all origins in dev)
- Verify .env file has correct API_URL

### Port already in use
```bash
# Kill process on port 5000 (server) or 5173 (client)
# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or use different port:
npm run dev -- --port 3000
```

### Image upload fails
- Verify file is JPG, PNG, or WebP
- Check file size is under 5MB
- Ensure server/uploads directory exists and is writable

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Express.js](https://expressjs.com)
- [Mongoose Documentation](https://mongoosejs.com)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## 🔄 Development Workflow

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and test thoroughly
3. Commit with clear messages: `git commit -m "Add feature: description"`
4. Push to branch: `git push origin feature/your-feature`
5. Create Pull Request

## ⚡ Performance Optimizations

- **MongoDB Indexing**: Posts indexed by `createdAt` and `author` for faster queries
- **File Size Limits**: 5MB max to prevent large file uploads
- **Input Validation**: Catch invalid data early to reduce server load
- **Error Boundaries**: React components prevent full app crashes

## 🔐 Security Checklist

- ✅ Input validation (client & server)
- ✅ XSS protection with DOMPurify
- ✅ File upload validation (type & size)
- ✅ MongoDB ObjectId validation
- ✅ .env file in .gitignore
- ✅ CORS configured
- ✅ Error handler middleware
- ✅ File cleanup on deletion
- ✅ Filename sanitization
- ✅ Mongoose schema validation

## 📄 License

Part of the NexusBlog project.

## 🤝 Contributing

This is a learning project. Contributions, bug reports, and feature requests are welcome!

---

**Last Updated**: May 17, 2026
**Version**: 1.0.0
**Status**: Fully organized with security hardening complete

## Design System
The application uses a custom-built design system in `client/src/index.css` featuring:
- **Glassmorphism**: Blurred backgrounds and subtle borders.
- **Micro-animations**: Smooth transitions and hover effects.
- **Typography**: Outfit font for a modern feel.
