import { useState, useEffect } from 'react';

/**
 * Generates the storage key based on user state.
 * @param {string} baseKey - The core key (e.g., 'tasks', 'theme', 'achievements')
 * @param {object} user - The user object from AuthContext
 * @returns {string} - The scoped key (e.g., 'user:123:tasks' or 'guest:tasks')
 */
export const getStorageKey = (baseKey, user) => {
    if (!user) return null;
    if (user.isGuest) return `guest:${baseKey}`;
    return `user:${user._id}:${baseKey}`;
};

/**
 * Helper to get data from localStorage with user scoping
 */
export const getUserData = (baseKey, user) => {
    const key = getStorageKey(baseKey, user);
    if (!key) return null;
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.error(`Error reading ${key}`, e);
        return null;
    }
};

/**
 * Helper to save data to localStorage with user scoping
 */
export const saveUserData = (baseKey, user, data) => {
    const key = getStorageKey(baseKey, user);
    if (!key) return;
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error(`Error saving ${key}`, e);
    }
};

/**
 * Helper for simple string storage (like theme)
 */
export const getUserItem = (baseKey, user) => {
    const key = getStorageKey(baseKey, user);
    if (!key) return null;
    return localStorage.getItem(key);
};

export const saveUserItem = (baseKey, user, value) => {
    const key = getStorageKey(baseKey, user);
    if (!key) return;
    localStorage.setItem(key, value);
};
