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
import CartPage from './pages/cart.jsx';
import CheckoutPage from './pages/checkout.jsx';
import AddressesPage from './pages/addresses.jsx';
import OrdersPage from './pages/orders.jsx';
import OrderDetailPage from './pages/orderDetail.jsx';
import WishlistPage from './pages/wishlist.jsx';
import BlogPage from './pages/blog.jsx';
import BlogDetailPage from './pages/blogDetail.jsx';
import ContactPage from './pages/contact.jsx';
import AboutPage from './pages/about.jsx';
import ServicesPage from './pages/services.jsx';

import AdminLayout from './pages/admin/adminLayout.jsx';
import ProductManagement from './pages/admin/products/productManagement.jsx';
import CategoryManagement from './pages/admin/categories/categoryManagement.jsx';
import OrderManagement from './pages/admin/orders/orderManagement.jsx';
import PromotionManagement from './pages/admin/promotions/promotionManagement.jsx';
import BlogManagement from './pages/admin/blogs/blogManagement.jsx';
import ProtectedRoute from './components/admin/protectedRoute.jsx';

import { AuthWrapper } from './components/context/authContext.jsx';
import { CartWrapper } from './components/context/cartContext.jsx';
import { WishlistWrapper } from './components/context/wishlistContext.jsx';

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <HomePage /> },
            { path: "user", element: <UserPage /> },
            { path: "products", element: <ProductsPage /> },
            { path: "products/:id", element: <ProductDetailPage /> },
            { path: "cart", element: <CartPage /> },
            { path: "checkout", element: <CheckoutPage /> },
            { path: "addresses", element: <AddressesPage /> },
            { path: "orders", element: <OrdersPage /> },
            { path: "orders/:id", element: <OrderDetailPage /> },
            { path: "wishlist", element: <WishlistPage /> },
            { path: "blog", element: <BlogPage /> },
            { path: "blog/:slug", element: <BlogDetailPage /> },
            { path: "contact", element: <ContactPage /> },
            { path: "about", element: <AboutPage /> },
            { path: "services", element: <ServicesPage /> },
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
            { path: "orders", element: <OrderManagement /> },
            { path: "promotions", element: <PromotionManagement /> },
            { path: "blogs", element: <BlogManagement /> },
        ]
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthWrapper>
            <CartWrapper>
            <WishlistWrapper>
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
            </WishlistWrapper>
            </CartWrapper>
        </AuthWrapper>
    </React.StrictMode>,
);
