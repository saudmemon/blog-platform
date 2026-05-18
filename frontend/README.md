# NexusBlog - Client

A modern React-based frontend for the NexusBlog platform, built with Vite and featuring a sleek, responsive UI.

## Features

- **Create, Read, Update, Delete Posts** - Full CRUD operations for blog posts
- **Markdown Support** - Write posts in Markdown format
- **Image Cover Support** - Add cover images to your posts (JPG, PNG, WebP, max 5MB)
- **Tag Management** - Organize posts with tags
- **Responsive Design** - Mobile-friendly interface with modern styling
- **Real-time Validation** - Form validation with helpful error messages
- **Security** - XSS protection with sanitized HTML rendering

## Tech Stack

- **React** ^19.2.0
- **Vite** ^7.3.1 - Lightning-fast build tool
- **React Router** ^7.13.0 - Client-side routing
- **Axios** ^1.13.5 - HTTP client
- **React Markdown** ^10.1.0 - Markdown rendering
- **DOMPurify** ^3.0.6 - XSS prevention
- **Lucide React** ^0.575.0 - Icon library

## Getting Started

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Server will start on `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## Configuration

Create a `.env` file based on `.env.example`:

```env
VITE_API_URL=http://localhost:5000
```

## File Structure

```
src/
├── App.jsx              # Main app component with routing
├── main.jsx             # React entry point
├── App.css              # App styles
├── index.css            # Global styles
├── components/
│   └── Navbar.jsx       # Navigation component
├── pages/
│   ├── HomePage.jsx     # List all posts
│   ├── PostPage.jsx     # View single post
│   └── EditorPage.jsx   # Create/Edit post
└── assets/              # Static assets
```

## Component Overview

### HomePage
Displays all blog posts in a grid layout with:
- Cover images
- Post preview
- Author and date
- Quick tag display

### PostPage
Shows full post details:
- Full post content with Markdown/HTML rendering
- Cover image
- Edit and delete options
- Delete confirmation modal

### EditorPage
Form for creating and editing posts with:
- Title input with character counter
- Author name input
- Tags (comma-separated)
- Cover image upload with validation
- Content editor (Markdown support)
- Form validation with error messages

### Navbar
Navigation component with:
- NexusBlog branding
- Home link
- Create new post button

## Validation Rules

- **Title**: Required, max 200 characters
- **Content**: Required, max 10,000 characters
- **Author**: Optional, max 100 characters
- **Tags**: Each tag max 50 characters, alphanumeric + hyphens/underscores
- **Image**: JPG/PNG/WebP only, max 5MB

## Security Features

- **XSS Protection**: All user-generated HTML is sanitized using DOMPurify
- **Input Validation**: Client-side and server-side validation
- **File Upload Validation**: Type and size restrictions enforced

## API Integration

This client communicates with the NexusBlog server API:

- `GET /api/posts` - Fetch all posts
- `GET /api/posts/:id` - Fetch single post
- `POST /api/posts` - Create new post (multipart/form-data)
- `PUT /api/posts/:id` - Update post (multipart/form-data)
- `DELETE /api/posts/:id` - Delete post

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | http://localhost:5000 |

## Troubleshooting

### Port 5173 already in use
```bash
npm run dev -- --port 3000
```

### API connection errors
- Ensure the backend server is running on the configured `VITE_API_URL`
- Check that CORS is properly configured on the backend
- Verify the `.env` file has the correct API URL

### Image upload fails
- Check file is JPG, PNG, or WebP format
- Ensure file size is under 5MB
- Verify server uploads directory has write permissions

## Contributing

When modifying this client, please follow these guidelines:
- Keep components focused and single-purpose
- Use descriptive variable and function names
- Add comments for complex logic
- Test form validations thoroughly
- Ensure responsive design works on mobile devices

## License

Part of the NexusBlog project.
