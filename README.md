# NexusBlog - Premium Blogging Platform

A modern, responsive blogging platform built with React, Node.js, and MongoDB.

## Features
- **Rich Text Editing**: Create beautiful posts with a Quill.js-powered editor.
- **Image Uploads**: Upload cover images for your stories.
- **Responsive Design**: Premium dark-mode UI with glassmorphism effects.
- **CRUD Operations**: Write, edit, and delete posts easily.

## Tech Stack
- **Frontend**: React.js, Vite, Axios, React Router, React Quill, Lucide Icons.
- **Backend**: Node.js, Express, Mongoose, Multer.
- **Database**: MongoDB.

## Prerequisites
- **Node.js**: v18+ 
- **MongoDB**: You need a running MongoDB instance (Local or Atlas).

## Getting Started

### 1. Setup Backend
1. Go to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update `.env` with your `MONGO_URI`.
4. Start the server:
   ```bash
   npm run dev
   ```

### 2. Setup Frontend
1. Go to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Design System
The application uses a custom-built design system in `client/src/index.css` featuring:
- **Glassmorphism**: Blurred backgrounds and subtle borders.
- **Micro-animations**: Smooth transitions and hover effects.
- **Typography**: Outfit font for a modern feel.
