import React from 'react';

import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';

import App from './App.jsx';
import './styles/template.css'
import './styles/global.css';

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import RegisterPage from './pages/register.jsx';

import UserPage from './pages/user.jsx';

import HomePage from './pages/home.jsx';

import LoginPage from './pages/login.jsx';

import { AuthWrapper } from './components/context/auth.context.jsx';

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: "user",
                element: <UserPage />
            },
        ]
    },

    {
        path: "register",
        element: <RegisterPage />
    },

    {
        path: "login",
        element: <LoginPage />
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>

        <AuthWrapper>

            <ConfigProvider
                locale={viVN}
                theme={{
                    token: {
                        fontFamily:
                            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
                    },
                }}
            >

                <RouterProvider router={router} />

            </ConfigProvider>

        </AuthWrapper>

    </React.StrictMode>,
)
