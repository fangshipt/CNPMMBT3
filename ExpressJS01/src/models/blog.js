import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    excerpt: { type: String, default: '', trim: true },
    content: { type: String, default: '', trim: true },
    image: { type: String, default: '' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date },
}, { timestamps: true });

blogSchema.index({ isPublished: 1, publishedAt: -1 });

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
