import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext({
    isAuthenticated: false,
    user: { email: "", name: "", role: "" },
    appLoading: true,
});

export const AuthWrapper = (props) => {

    const [auth, setAuth] = useState({
        isAuthenticated: false,
        user: { email: "", name: "", role: "" }
    });

    const [appLoading, setAppLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            setAuth({
                isAuthenticated: true,
                user: {
                    email: localStorage.getItem("email") || "",
                    name: localStorage.getItem("name") || "",
                    role: localStorage.getItem("role") || "",
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