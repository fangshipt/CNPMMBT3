import axios from "./axios.customize";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8888";

export const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    return `${backendUrl}${imagePath}`;
};

export const formatPrice = (price) => {
    if (!price && price !== 0) return "";
    return price.toLocaleString("vi-VN") + "đ";
};

const createUserApi = (name, email, password) => {
    return axios.post("/v1/api/register", { name, email, password });
}

const loginApi = (email, password) => {
    return axios.post("/v1/api/login", { email, password });
}

const getUserApi = () => {
    return axios.get("/v1/api/user");
}

const getProductsApi = (params = {}) => {
    return axios.get("/v1/api/products", { params });
}

const getProductByIdOrSlugApi = (idOrSlug) => {
    return axios.get(`/v1/api/products/${idOrSlug}`);
}

const getRelatedProductsApi = (id, limit = 4) => {
    return axios.get(`/v1/api/products/${id}/related`, { params: { limit } });
}

const getCategoriesApi = (params = {}) => {
    return axios.get("/v1/api/categories", { params });
}

// Top products
const getTopSellersApi = (limit = 10) => axios.get("/v1/api/products/top-sellers", { params: { limit } });
const getMostViewedApi = (limit = 10) => axios.get("/v1/api/products/most-viewed", { params: { limit } });

// Admin - Products
const createProductApi = (data) => axios.post("/v1/api/products", data);
const updateProductApi = (id, data) => axios.put(`/v1/api/products/${id}`, data);
const deleteProductApi = (id) => axios.delete(`/v1/api/products/${id}`);

// Admin - Categories
const createCategoryApi = (data) => axios.post("/v1/api/categories", data);
const updateCategoryApi = (id, data) => axios.put(`/v1/api/categories/${id}`, data);
const deleteCategoryApi = (id) => axios.delete(`/v1/api/categories/${id}`);

// Upload ảnh lên Cloudinary
const uploadImagesApi = (formData) =>
    axios.post("/api/upload/product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

// Cart APIs
const getCartApi = () => axios.get('/v1/api/cart');
const addToCartApi = (productId, quantity) => axios.post('/v1/api/cart/add', { productId, quantity });
const updateCartItemApi = (productId, quantity) => axios.put(`/v1/api/cart/item/${productId}`, { quantity });
const removeCartItemApi = (productId) => axios.delete(`/v1/api/cart/item/${productId}`);
const clearCartApi = () => axios.delete('/v1/api/cart');

// Address APIs
const getAddressesApi = () => axios.get('/v1/api/addresses');
const createAddressApi = (data) => axios.post('/v1/api/addresses', data);
const updateAddressApi = (id, data) => axios.put(`/v1/api/addresses/${id}`, data);
const deleteAddressApi = (id) => axios.delete(`/v1/api/addresses/${id}`);
const setDefaultAddressApi = (id) => axios.patch(`/v1/api/addresses/${id}/default`);

// Order APIs
const createOrderApi = (data) => axios.post('/v1/api/orders', data);
const getUserOrdersApi = (params = {}) => axios.get('/v1/api/orders/my', { params });
const getOrderDetailApi = (id) => axios.get(`/v1/api/orders/my/${id}`);
const cancelOrderApi = (id, reason) => axios.patch(`/v1/api/orders/my/${id}/cancel`, { reason });

// Admin Order APIs
const getAdminOrdersApi = (params = {}) => axios.get('/v1/api/orders/admin', { params });
const updateOrderStatusApi = (id, status, note) => axios.patch(`/v1/api/orders/admin/${id}/status`, { status, note });

// Review APIs
const canReviewApi = (productId) => axios.get(`/v1/api/products/${productId}/can-review`);
const addReviewApi = (productId, data) => axios.post(`/v1/api/products/${productId}/reviews`, data);

// Wishlist APIs
const getWishlistApi = () => axios.get('/v1/api/user/wishlist');
const toggleWishlistApi = (productId) => axios.post(`/v1/api/user/wishlist/${productId}`);

// Promotion APIs
const getPromotionsApi = (params = {}) => axios.get('/v1/api/promotions', { params });
const createPromotionApi = (data) => axios.post('/v1/api/promotions', data);
const updatePromotionApi = (id, data) => axios.put(`/v1/api/promotions/${id}`, data);
const deletePromotionApi = (id) => axios.delete(`/v1/api/promotions/${id}`);

// Testimonial APIs
const getPublicTestimonialsApi = (limit = 10) => axios.get('/v1/api/testimonials/public', { params: { limit } });
const getTestimonialStatusApi = () => axios.get('/v1/api/testimonials/my-status');
const createTestimonialApi = (data) => axios.post('/v1/api/testimonials', data);
const getAdminTestimonialsApi = () => axios.get('/v1/api/testimonials');
const updateTestimonialApprovalApi = (id, isApproved) => axios.patch(`/v1/api/testimonials/${id}/approve`, { isApproved });
const deleteTestimonialApi = (id) => axios.delete(`/v1/api/testimonials/${id}`);

// Blog APIs
const getPublishedBlogsApi = (params = {}) => axios.get('/v1/api/blogs/published', { params });
const getBlogBySlugApi = (slug) => axios.get(`/v1/api/blogs/published/${slug}`);
const getAdminBlogsApi = (params = {}) => axios.get('/v1/api/blogs', { params });
const createBlogApi = (data) => axios.post('/v1/api/blogs', data);
const updateBlogApi = (id, data) => axios.put(`/v1/api/blogs/${id}`, data);
const deleteBlogApi = (id) => axios.delete(`/v1/api/blogs/${id}`);

export {
    createUserApi, loginApi, getUserApi,
    getProductsApi, getProductByIdOrSlugApi, getRelatedProductsApi, getCategoriesApi,
    createProductApi, updateProductApi, deleteProductApi,
    createCategoryApi, updateCategoryApi, deleteCategoryApi,
    uploadImagesApi, getTopSellersApi, getMostViewedApi,
    getCartApi, addToCartApi, updateCartItemApi, removeCartItemApi, clearCartApi,
    getAddressesApi, createAddressApi, updateAddressApi, deleteAddressApi, setDefaultAddressApi,
    createOrderApi, getUserOrdersApi, getOrderDetailApi, cancelOrderApi,
    getAdminOrdersApi, updateOrderStatusApi,
    canReviewApi, addReviewApi,
    getWishlistApi, toggleWishlistApi,
    getPromotionsApi, createPromotionApi, updatePromotionApi, deletePromotionApi,
    getPublishedBlogsApi, getBlogBySlugApi, getAdminBlogsApi, createBlogApi, updateBlogApi, deleteBlogApi,
    getPublicTestimonialsApi, getTestimonialStatusApi, createTestimonialApi,
    getAdminTestimonialsApi, updateTestimonialApprovalApi, deleteTestimonialApi,
}