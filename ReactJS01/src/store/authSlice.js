import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: false,
    user: {
        email:    '',
        name:     '',
        fullName: '',
        role:     '',
        avatar:   '',
    },
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess(state, action) {
            state.isAuthenticated = true;
            state.user = { ...state.user, ...action.payload };
        },
        logoutSuccess(state) {
            state.isAuthenticated = false;
            state.user = initialState.user;
        },
        updateUserSuccess(state, action) {
            state.user = { ...state.user, ...action.payload };
        },
    },
});

export const { loginSuccess, logoutSuccess, updateUserSuccess } = authSlice.actions;
export default authSlice.reducer;
