/**
 * WorkTalk - Authentication Service
 * Handles user authentication, token management, and user state
 */

import { authAPI, profileAPI } from './api.js';
import { showToast, sanitizeInput } from './utils.js';

// Store tokens
let currentUser = null;

/**
 * Register a new public user
 */
export async function register(name, email, username, password) {
    try {
        const response = await authAPI.register({
            name: sanitizeInput(name),
            email: sanitizeInput(email),
            username: sanitizeInput(username),
            password
        });
        
        if (response.success) {
            return { success: true, message: response.message };
        }
        return { success: false, message: response.message, field: response.field };
    } catch (error) {
        console.error('Registration error:', error);
        return { success: false, message: error.message || 'Registration failed' };
    }
}

/**
 * Register an employee using invite code
 */
export async function registerEmployee(inviteCode, name, email, password) {
    try {
        const response = await authAPI.registerEmployee({
            inviteCode: sanitizeInput(inviteCode),
            name: sanitizeInput(name),
            email: sanitizeInput(email),
            password
        });
        
        if (response.success) {
            return { success: true, message: response.message };
        }
        return { success: false, message: response.message, field: response.field };
    } catch (error) {
        console.error('Employee registration error:', error);
        return { success: false, message: error.message || 'Registration failed' };
    }
}

/**
 * Login user
 */
export async function login(email, password, rememberMe = false) {
    try {
        const response = await authAPI.login({
            email: sanitizeInput(email),
            password,
            rememberMe
        });
        
        if (response.success && response.accessToken) {
            // Store tokens
            localStorage.setItem('accessToken', response.accessToken);
            if (response.refreshToken) {
                localStorage.setItem('refreshToken', response.refreshToken);
            }
            if (response.user) {
                localStorage.setItem('user', JSON.stringify(response.user));
                currentUser = response.user;
            }
            
            return { 
                success: true, 
                message: 'Login successful',
                redirectTo: response.redirectTo || '/dashboard.html'
            };
        }
        
        return { success: false, message: response.message || 'Invalid credentials' };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: error.message || 'Login failed' };
    }
}

/**
 * Logout user
 */
export async function logout() {
    try {
        await authAPI.logout();
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        // Clear local storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        currentUser = null;
        
        // Redirect to home
        window.location.href = '/';
    }
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser() {
    if (currentUser) {
        return currentUser;
    }
    
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        return currentUser;
    }
    
    try {
        const user = await authAPI.getCurrentUser();
        if (user) {
            currentUser = user;
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        }
    } catch (error) {
        console.error('Failed to get current user:', error);
        if (error.message === 'Not authorized') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        }
    }
    
    return null;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
    const token = localStorage.getItem('accessToken');
    return !!token;
}

/**
 * Verify email with token
 */
export async function verifyEmail(token) {
    try {
        const response = await authAPI.verifyEmail(token);
        return { success: true, message: response.message };
    } catch (error) {
        console.error('Email verification error:', error);
        return { success: false, message: error.message || 'Verification failed' };
    }
}

/**
 * Resend verification email
 */
export async function resendVerification(email) {
    try {
        const response = await authAPI.resendVerification({ email: sanitizeInput(email) });
        return { success: true, message: response.message };
    } catch (error) {
        console.error('Resend verification error:', error);
        return { success: false, message: error.message || 'Failed to resend' };
    }
}

/**
 * Request password reset
 */
export async function forgotPassword(email) {
    try {
        const response = await authAPI.forgotPassword({ email: sanitizeInput(email) });
        return { success: true, message: response.message };
    } catch (error) {
        console.error('Forgot password error:', error);
        return { success: false, message: error.message || 'Failed to send reset email' };
    }
}

/**
 * Reset password with token
 */
export async function resetPassword(token, password) {
    try {
        const response = await authAPI.resetPassword(token, password);
        return { success: true, message: response.message };
    } catch (error) {
        console.error('Reset password error:', error);
        return { success: false, message: error.message || 'Password reset failed' };
    }
}

/**
 * Switch active profile
 */
export async function switchProfile(profileId) {
    try {
        const response = await profileAPI.switchProfile(profileId);
        if (response.success && response.user) {
            currentUser = response.user;
            localStorage.setItem('user', JSON.stringify(response.user));
            return { success: true, user: response.user };
        }
        return { success: false, message: response.message };
    } catch (error) {
        console.error('Switch profile error:', error);
        return { success: false, message: error.message || 'Failed to switch profile' };
    }
}

/**
 * Create public profile (for employees who want public identity)
 */
export async function createPublicProfile(username) {
    try {
        const response = await profileAPI.createPublicProfile({ username: sanitizeInput(username) });
        if (response.success) {
            currentUser = response.user;
            localStorage.setItem('user', JSON.stringify(response.user));
            return { success: true, user: response.user };
        }
        return { success: false, message: response.message };
    } catch (error) {
        console.error('Create public profile error:', error);
        return { success: false, message: error.message || 'Failed to create public profile' };
    }
}