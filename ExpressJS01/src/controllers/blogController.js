import { getBlogsService, getPublishedBlogsService, getBlogBySlugService, createBlogService, updateBlogService, deleteBlogService } from '../services/blogService.js';

export const getPublishedBlogs = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const data = await getPublishedBlogsService({ page: Number(page), limit: Number(limit) });
        res.json({ EC: 0, EM: 'OK', data: data.blogs, meta: { total: data.total, page: data.page, totalPages: data.totalPages } });
    } catch (e) {
        res.status(500).json({ EC: 1, EM: e.message });
    }
};

export const getBlogBySlug = async (req, res) => {
    try {
        const blog = await getBlogBySlugService(req.params.slug);
        res.json({ EC: 0, EM: 'OK', data: blog });
    } catch (e) {
        res.status(404).json({ EC: 1, EM: e.message });
    }
};

export const getBlogs = async (req, res) => {
    try {
        const { page = 1, limit = 20, isPublished } = req.query;
        const data = await getBlogsService({ page: Number(page), limit: Number(limit), isPublished });
        res.json({ EC: 0, EM: 'OK', data: data.blogs, meta: { total: data.total, page: data.page, totalPages: data.totalPages } });
    } catch (e) {
        res.status(500).json({ EC: 1, EM: e.message });
    }
};

export const createBlog = async (req, res) => {
    try {
        const blog = await createBlogService(req.user._id, req.body);
        res.status(201).json({ EC: 0, EM: 'Đã tạo bài viết', data: blog });
    } catch (e) {
        res.status(400).json({ EC: 1, EM: e.message });
    }
};

export const updateBlog = async (req, res) => {
    try {
        const blog = await updateBlogService(req.params.id, req.body);
        res.json({ EC: 0, EM: 'Đã cập nhật bài viết', data: blog });
    } catch (e) {
        res.status(400).json({ EC: 1, EM: e.message });
    }
};

export const deleteBlog = async (req, res) => {
    try {
        await deleteBlogService(req.params.id);
        res.json({ EC: 0, EM: 'Đã xóa bài viết' });
    } catch (e) {
        res.status(400).json({ EC: 1, EM: e.message });
    }
};
