import { createContext, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess, logoutSuccess, updateUserSuccess } from '../../store/authSlice';

export const AuthContext = createContext(null);

export const AuthWrapper = ({ children }) => {
    const dispatch    = useDispatch();
    const auth        = useSelector((state) => state.auth);
    const [appLoading, setAppLoading] = useState(true);

    // Khôi phục session từ localStorage khi load lại trang
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            dispatch(loginSuccess({
                email:    localStorage.getItem('email')  || '',
                name:     localStorage.getItem('name')   || '',
                fullName: localStorage.getItem('name')   || '',
                role:     localStorage.getItem('role')   || '',
                avatar:   localStorage.getItem('avatar') || '',
            }));
        }
        setAppLoading(false);
    }, [dispatch]);

    // setAuth({ isAuthenticated, user }) — giữ API cũ để các component khác không đổi
    const setAuth = (newAuth) => {
        if (newAuth?.isAuthenticated) {
            dispatch(loginSuccess(newAuth.user));
        } else {
            dispatch(logoutSuccess());
        }
    };

    return (
        <AuthContext.Provider value={{ auth, setAuth, appLoading, setAppLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook tiện lợi cho các component muốn dùng Redux trực tiếp
export { useSelector, useDispatch };
export { loginSuccess, logoutSuccess, updateUserSuccess };
