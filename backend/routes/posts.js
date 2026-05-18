const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Post = require('../models/Post');

// Validation Constants
const TITLE_MAX_LENGTH = 200;
const CONTENT_MAX_LENGTH = 10000;
const AUTHOR_MAX_LENGTH = 100;
const TAG_MAX_LENGTH = 50;
const FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads');
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // Sanitize filename: remove special characters, keep only alphanumeric and extension
        const sanitizedName = uniqueSuffix + path.extname(file.originalname).toLowerCase();
        cb(null, sanitizedName);
    },
});

// File filter for multer
const fileFilter = (req, file, cb) => {
    if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: FILE_SIZE_LIMIT }
});

// Input Validation Helper
const validatePostInput = (title, content, author, tags) => {
    const errors = [];

    if (!title || title.trim() === '') {
        errors.push('Title is required');
    } else if (title.length > TITLE_MAX_LENGTH) {
        errors.push(`Title must not exceed ${TITLE_MAX_LENGTH} characters`);
    }

    if (!content || content.trim() === '') {
        errors.push('Content is required');
    } else if (content.length > CONTENT_MAX_LENGTH) {
        errors.push(`Content must not exceed ${CONTENT_MAX_LENGTH} characters`);
    }

    if (author && author.length > AUTHOR_MAX_LENGTH) {
        errors.push(`Author name must not exceed ${AUTHOR_MAX_LENGTH} characters`);
    }

    if (tags) {
        const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        for (const tag of tagArray) {
            if (tag.length > TAG_MAX_LENGTH) {
                errors.push(`Tag "${tag}" must not exceed ${TAG_MAX_LENGTH} characters`);
            }
            // Validate tag contains only alphanumeric, hyphens, and underscores
            if (!/^[a-zA-Z0-9_-]+$/.test(tag)) {
                errors.push(`Tag "${tag}" contains invalid characters`);
            }
        }
    }

    return errors;
};

// Helper to validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Helper to delete file from uploads folder
const deleteFile = (filePath) => {
    if (filePath) {
        const fullPath = path.join(__dirname, '../uploads', path.basename(filePath));
        if (fs.existsSync(fullPath)) {
            fs.unlink(fullPath, (err) => {
                if (err) console.error(`Error deleting file: ${err.message}`);
            });
        }
    }
};


// @route   GET /api/posts
// @desc    Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch posts' });
    }
});

// @route   GET /api/posts/:id
// @desc    Get post by ID
router.get('/:id', async (req, res) => {
    try {
        // Validate ObjectId
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }

        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch post' });
    }
});

// @route   POST /api/posts
// @desc    Create a post
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { title, content, author, tags } = req.body;

        // Validate input
        const errors = validatePostInput(title, content, author, tags);
        if (errors.length > 0) {
            return res.status(400).json({ message: 'Validation error', errors });
        }

        // Process tags
        const processedTags = tags
            ? tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
            : [];

        const post = new Post({
            title: title.trim(),
            content: content.trim(),
            author: (author || 'Anonymous').trim(),
            tags: processedTags,
            coverImage: req.file ? `/uploads/${req.file.filename}` : null,
        });

        const newPost = await post.save();
        res.status(201).json(newPost);
    } catch (err) {
        // If file was uploaded but post creation failed, delete the file
        if (req.file) {
            deleteFile(req.file.filename);
        }
        res.status(400).json({ message: err.message || 'Failed to create post' });
    }
});

// @route   PUT /api/posts/:id
// @desc    Update a post
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        // Validate ObjectId
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }

        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const { title, content, author, tags } = req.body;

        // Validate input (only if fields are provided)
        const errors = validatePostInput(
            title || post.title,
            content || post.content,
            author || post.author,
            tags !== undefined ? tags : post.tags.join(',')
        );
        if (errors.length > 0) {
            // Delete uploaded file if validation fails
            if (req.file) {
                deleteFile(req.file.filename);
            }
            return res.status(400).json({ message: 'Validation error', errors });
        }

        if (title) post.title = title.trim();
        if (content) post.content = content.trim();
        if (author) post.author = author.trim();

        if (tags !== undefined) {
            post.tags = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
        }

        if (req.file) {
            // Delete old image if it exists
            if (post.coverImage) {
                deleteFile(post.coverImage);
            }
            post.coverImage = `/uploads/${req.file.filename}`;
        }

        const updatedPost = await post.save();
        res.json(updatedPost);
    } catch (err) {
        // If file was uploaded but update failed, delete the file
        if (req.file) {
            deleteFile(req.file.filename);
        }
        res.status(400).json({ message: err.message || 'Failed to update post' });
    }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post
router.delete('/:id', async (req, res) => {
    try {
        // Validate ObjectId
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }

        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        // Delete associated image file if it exists
        if (post.coverImage) {
            deleteFile(post.coverImage);
        }

        await post.deleteOne();
        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message || 'Failed to delete post' });
    }
});

module.exports = router;
