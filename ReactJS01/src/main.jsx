import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import App from './app.jsx';
import './styles/template.css';
import './styles/global.css';

import HomePage from './pages/home.jsx';
import LoginPage from './pages/login.jsx';
import RegisterPage from './pages/register.jsx';
import UserPage from './pages/user.jsx';
import ProductsPage from './pages/products.jsx';
import ProductDetailPage from './pages/productDetail.jsx';

import AdminLayout from './pages/admin/adminLayout.jsx';
import ProductManagement from './pages/admin/products/productManagement.jsx';
import CategoryManagement from './pages/admin/categories/categoryManagement.jsx';
import ProtectedRoute from './components/admin/protectedRoute.jsx';

import { AuthWrapper } from './components/context/authContext.jsx';

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <HomePage /> },
            { path: "user", element: <UserPage /> },
            { path: "products", element: <ProductsPage /> },
            { path: "products/:id", element: <ProductDetailPage /> },
        ]
    },
    { path: "register", element: <RegisterPage /> },
    { path: "login", element: <LoginPage /> },
    {
        path: "/admin",
        element: (
            <ProtectedRoute role="admin">
                <AdminLayout />
            </ProtectedRoute>
        ),
        children: [
            { index: true, element: <Navigate to="/admin/products" replace /> },
            { path: "products", element: <ProductManagement /> },
            { path: "categories", element: <CategoryManagement /> },
        ]
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthWrapper>
            <ConfigProvider
                locale={viVN}
                theme={{
                    token: {
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
                    },
                }}
            >
                <RouterProvider router={router} />
            </ConfigProvider>
        </AuthWrapper>
    </React.StrictMode>,
);
