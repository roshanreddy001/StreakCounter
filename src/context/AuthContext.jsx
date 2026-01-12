import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLoggedIn = async () => {
            const isGuest = localStorage.getItem('isGuest');
            if (isGuest) {
                setUser({ _id: 'guest', email: 'guest@example.com', name: 'Guest', isGuest: true });
                setLoading(false);
                return;
            }

            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await api.get('/auth/me');
                    setUser(res.data);
                } catch (err) {
                    console.error("Auth check failed", err);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        checkLoggedIn();
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.removeItem('isGuest');
        setUser(res.data.user);
    };

    const signup = async (email, password) => {
        const res = await api.post('/auth/register', { email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.removeItem('isGuest');
        setUser(res.data.user);
    };

    const guestLogin = () => {
        console.log("Guest login initiated");
        localStorage.setItem('isGuest', 'true');
        const guestUser = { _id: 'guest', email: 'guest@example.com', name: 'Guest', isGuest: true };
        setUser(guestUser);
        console.log("Guest user set:", guestUser);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isGuest');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, guestLogin, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
