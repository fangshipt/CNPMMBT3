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

export {
    createUserApi,
    loginApi,
    getUserApi,
    getProductsApi,
    getProductByIdOrSlugApi,
    getRelatedProductsApi,
    getCategoriesApi,
    createProductApi,
    updateProductApi,
    deleteProductApi,
    createCategoryApi,
    updateCategoryApi,
    deleteCategoryApi,
    uploadImagesApi,
    getTopSellersApi,
    getMostViewedApi,
}