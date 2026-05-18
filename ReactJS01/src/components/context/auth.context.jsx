import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext({
    isAuthenticated: false,
    user: {
        email: "",
        name: ""
    },
    appLoading: true,
});

export const AuthWrapper = (props) => {

    const [auth, setAuth] = useState({
        isAuthenticated: false,
        user: {
            email: "",
            name: ""
        }
    });

    const [appLoading, setAppLoading] = useState(true);

    useEffect(() => {
        // Check if token exists in localStorage on app load
        const token = localStorage.getItem("access_token");
        if (token) {
            setAuth({
                isAuthenticated: true,
                user: {
                    email: localStorage.getItem("email") || "",
                    name: localStorage.getItem("name") || ""
                }
            });
        }
        setAppLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{
            auth,
            setAuth,
            appLoading,
            setAppLoading
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}