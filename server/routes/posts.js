const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Post = require('../models/Post');

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// @route   GET /api/posts
// @desc    Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   GET /api/posts/:id
// @desc    Get post by ID
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   POST /api/posts
// @desc    Create a post
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { title, content, author, tags } = req.body;

        // Better tag handling: handle strings, trim them, and filter empty strings
        const processedTags = tags
            ? tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
            : [];

        const post = new Post({
            title,
            content,
            author: author || 'Anonymous',
            tags: processedTags,
            coverImage: req.file ? `/uploads/${req.file.filename}` : null,
        });

        const newPost = await post.save();
        console.log(`✅ Post created: ${newPost.title}`);
        res.status(201).json(newPost);
    } catch (err) {
        console.error(`❌ Error creating post: ${err.message}`);
        res.status(400).json({ message: err.message });
    }
});


// @route   PUT /api/posts/:id
// @desc    Update a post
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const { title, content, author, tags } = req.body;

        if (title) post.title = title;
        if (content) post.content = content;
        if (author) post.author = author;

        if (tags !== undefined) {
            post.tags = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
        }

        if (req.file) {
            post.coverImage = `/uploads/${req.file.filename}`;
        }

        const updatedPost = await post.save();
        console.log(`✅ Post updated: ${updatedPost.title}`);
        res.json(updatedPost);
    } catch (err) {
        console.error(`❌ Error updating post: ${err.message}`);
        res.status(400).json({ message: err.message });
    }
});


// @route   DELETE /api/posts/:id
// @desc    Delete a post
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        await post.deleteOne();
        res.json({ message: 'Post deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
