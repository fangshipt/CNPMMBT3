import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8888";

if (!import.meta.env.VITE_BACKEND_URL) {
    console.warn("VITE_BACKEND_URL is not defined, falling back to http://localhost:8888");
}

// Set config defaults when creating the instance
const instance = axios.create({
    baseURL: backendUrl
});

// Add a request interceptor
instance.interceptors.request.use(function (config) {

    // Do something before request is sent
    config.headers.Authorization =
        `Bearer ${localStorage.getItem("access_token")}`;

    return config;

}, function (error) {

    // Do something with request error
    return Promise.reject(error);

});

// Add a response interceptor
instance.interceptors.response.use(function (response) {

    // Any status code that lie within the range of 2xx
    if (response && response.data)
        return response.data;

    return response;

}, function (error) {

    // Any status codes outside the range of 2xx
    if (error?.response?.data)
        return error?.response?.data;

    return {
        EC: -1,
        EM: error?.message || "Lỗi kết nối server"
    };

});

export default instance;