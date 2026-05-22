import Blog from '../models/blog.js';

const toSlug = (str) =>
    str.toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/đ/g, 'd').replace(/[^a-z0-9\s-]/g, '')
        .trim().replace(/\s+/g, '-');

export const getBlogsService = async ({ page = 1, limit = 10, isPublished } = {}) => {
    const query = {};
    if (isPublished !== undefined) query.isPublished = isPublished === 'true' || isPublished === true;
    const skip = (page - 1) * limit;
    const [blogs, total] = await Promise.all([
        Blog.find(query).populate('author', 'fullName email').sort({ createdAt: -1 }).skip(skip).limit(limit),
        Blog.countDocuments(query),
    ]);
    return { blogs, total, page, totalPages: Math.ceil(total / limit) };
};

export const getPublishedBlogsService = async ({ page = 1, limit = 10 } = {}) => {
    const skip = (page - 1) * limit;
    const [blogs, total] = await Promise.all([
        Blog.find({ isPublished: true }).populate('author', 'fullName').sort({ publishedAt: -1, createdAt: -1 }).skip(skip).limit(limit),
        Blog.countDocuments({ isPublished: true }),
    ]);
    return { blogs, total, page, totalPages: Math.ceil(total / limit) };
};

export const getBlogBySlugService = async (slug) => {
    const blog = await Blog.findOne({ slug, isPublished: true }).populate('author', 'fullName');
    if (!blog) throw new Error('Bài viết không tồn tại');
    return blog;
};

export const createBlogService = async (authorId, data) => {
    const slug = data.slug || toSlug(data.title) + '-' + Date.now();
    const blog = await Blog.create({
        ...data,
        slug,
        author: authorId,
        publishedAt: data.isPublished ? new Date() : undefined,
    });
    return blog;
};

export const updateBlogService = async (id, data) => {
    const blog = await Blog.findById(id);
    if (!blog) throw new Error('Bài viết không tồn tại');
    if (data.slug !== undefined) blog.slug = data.slug;
    if (data.title !== undefined) blog.title = data.title;
    if (data.excerpt !== undefined) blog.excerpt = data.excerpt;
    if (data.content !== undefined) blog.content = data.content;
    if (data.image !== undefined) blog.image = data.image;
    if (data.isPublished !== undefined) {
        if (data.isPublished && !blog.isPublished) blog.publishedAt = new Date();
        blog.isPublished = data.isPublished;
    }
    await blog.save();
    return blog;
};

export const deleteBlogService = async (id) => {
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) throw new Error('Bài viết không tồn tại');
    return blog;
};
