import React, { createContext, useContext, useEffect, useState, useLayoutEffect } from 'react';
import { useAuth } from './AuthContext';
import { getUserItem, saveUserItem } from '../utils/storage';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const { user, loading } = useAuth();
    const [theme, setTheme] = useState('light');

    // Load theme when user changes
    useEffect(() => {
        if (loading) return;

        let storedTheme = null;
        if (user) {
            storedTheme = getUserItem('theme', user);
        } else {
            // Default or global fallback if no user? 
            // Actually, if logged out, we can fallback to system or a 'guest' key if strictly per-user?
            // User prompt: "Guest theme saved locally".
            // My getStorageKey handles isGuest.
            // But if user is NULL (logged out), what then?
            // "Logging out clears current user state".
            // So we should probably default to system or 'light'.
            // Or maybe utilize a 'global' key for the login page?
            // The prompt "Guest user... Data is device-only".
            // I'll assume login page uses system pref or default 'light'.
            if (typeof window !== 'undefined' && localStorage.getItem('theme')) {
                storedTheme = localStorage.getItem('theme'); // Legacy fallback
            }
        }

        if (storedTheme) {
            setTheme(storedTheme);
        } else if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    }, [user, loading]);

    useLayoutEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.setAttribute('data-theme', theme);

        // Save using scoped key if user exists
        if (user) {
            saveUserItem('theme', user, theme);
        } else {
            // If strictly enforced, maybe don't save to global 'theme'?
            // But for login page persistence, it's nice. 
            // However, "One user must NEVER see another user’s data".
            // Theme isn't sensitive. I'll leave global save for non-auth state to avoid 'flicker', 
            // OR strictly remove it. 
            // Prompt: "logging out clears current user state".
            // I will NOT save to global 'theme' if scoped.
            // But I might save to 'theme' for the generic login page state on this device.
            localStorage.setItem('theme', theme);
        }
    }, [theme, user]);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    const isDark = theme === 'dark';

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
