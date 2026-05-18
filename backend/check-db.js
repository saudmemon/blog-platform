const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Post = require('./models/Post');

dotenv.config();

const checkPosts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const posts = await Post.find().limit(5);
        console.log('Posts:', JSON.stringify(posts, null, 2));

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkPosts();
