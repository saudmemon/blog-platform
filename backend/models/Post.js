const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        minlength: [1, 'Title cannot be empty'],
        maxlength: [200, 'Title must not exceed 200 characters'],
        trim: true,
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        minlength: [1, 'Content cannot be empty'],
        maxlength: [10000, 'Content must not exceed 10000 characters'],
        trim: true,
    },
    author: {
        type: String,
        default: 'Anonymous',
        maxlength: [100, 'Author name must not exceed 100 characters'],
        trim: true,
    },
    coverImage: {
        type: String,
        default: null,
    },
    tags: [{
        type: String,
        maxlength: [50, 'Tag must not exceed 50 characters'],
        trim: true,
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Update updatedAt before saving
PostSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Indexes for better query performance
PostSchema.index({ createdAt: -1 }); // For sorting by date
PostSchema.index({ author: 1 }); // For filtering by author

module.exports = mongoose.model('Post', PostSchema);
