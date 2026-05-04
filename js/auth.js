/**
 * AjiraTalk - Authentication Service
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
        // First clear any existing tokens to prevent caching issues
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('currentCompanyId');
        localStorage.removeItem('currentAccount');
        localStorage.removeItem('companyAccessToken');
        localStorage.removeItem('companyRefreshToken');
        localStorage.removeItem('companyUser');
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        
        console.log('Existing tokens cleared before login');
        
        const response = await authAPI.login({
            email: sanitizeInput(email),
            password,
            rememberMe
        });
        
        if (response.success && response.accessToken) {
            // Store tokens
            localStorage.setItem('accessToken', response.accessToken);
            console.log('New access token stored');
            
            if (response.refreshToken) {
                localStorage.setItem('refreshToken', response.refreshToken);
                console.log('New refresh token stored');
            }
            if (response.user) {
                localStorage.setItem('user', JSON.stringify(response.user));
                currentUser = response.user;
                console.log('User data stored:', response.user.email);
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
        // Clear localStorage tokens
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('currentCompanyId');
        localStorage.removeItem('currentAccount');
        localStorage.removeItem('companyAccessToken');
        localStorage.removeItem('companyRefreshToken');
        localStorage.removeItem('companyUser');
        
        // Clear sessionStorage tokens
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        
        currentUser = null;
        console.log('All tokens cleared on logout');
        
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
        // Clear cached tokens before switching
        console.log('Clearing tokens before profile switch');
        localStorage.removeItem('currentCompanyId');
        
        const response = await profileAPI.switchProfile(profileId);
        if (response.success && response.user) {
            currentUser = response.user;
            localStorage.setItem('user', JSON.stringify(response.user));
            console.log('Profile switched successfully, user updated:', response.user.email);
            return { success: true, user: response.user };
        }
        return { success: false, message: response.message };
    } catch (error) {
        console.error('Switch profile error:', error);
        return { success: false, message: error.message || 'Failed to switch profile' };
    }
}

/**
 * Switch to company account
 */
export function switchToCompany() {
    // Clear cached data before switching
    console.log('Clearing cached data before switching to company account');
    localStorage.removeItem('currentCompanyId');
    localStorage.removeItem('currentAccount');
    
    const companyToken = localStorage.getItem('companyAccessToken');
    const companyUser = localStorage.getItem('companyUser');
    const companyId = localStorage.getItem('currentCompanyId');
    
    console.log('Company token found:', !!companyToken);
    console.log('Company user found:', !!companyUser);
    
    if (!companyToken || !companyUser) {
        return { success: false, message: 'No company account found' };
    }
    
    // Swap tokens
    localStorage.setItem('accessToken', companyToken);
    localStorage.setItem('user', companyUser);
    localStorage.setItem('currentAccount', 'company');
    if (companyId) {
        localStorage.setItem('currentCompanyId', companyId);
    }
    
    currentUser = JSON.parse(companyUser);
    console.log('Switched to company account:', currentUser.email);
    
    return { success: true, user: currentUser };
}

/**
 * Switch to public account
 */
export function switchToPublic() {
    // Clear cached company data before switching
    console.log('Clearing cached data before switching to public account');
    localStorage.removeItem('currentCompanyId');
    localStorage.removeItem('currentAccount');
    
    const publicToken = localStorage.getItem('accessToken');
    const publicUser = localStorage.getItem('user');
    
    console.log('Public token found:', !!publicToken);
    console.log('Public user found:', !!publicUser);
    
    if (!publicToken || !publicUser) {
        return { success: false, message: 'No public account found' };
    }
    
    localStorage.setItem('currentAccount', 'public');
    currentUser = JSON.parse(publicUser);
    console.log('Switched to public account:', currentUser.email);
    
    return { success: true, user: currentUser };
}

/**
 * Get available accounts for switching
 */
export function getAvailableAccounts() {
    const accounts = [];
    
    const publicUser = localStorage.getItem('user');
    if (publicUser) {
        accounts.push({
            type: 'public',
            user: JSON.parse(publicUser),
            isActive: localStorage.getItem('currentAccount') === 'public'
        });
    }
    
    const companyUser = localStorage.getItem('companyUser');
    const companyId = localStorage.getItem('currentCompanyId');
    if (companyUser && companyId) {
        accounts.push({
            type: 'company',
            user: JSON.parse(companyUser),
            companyId,
            isActive: localStorage.getItem('currentAccount') === 'company'
        });
    }
    
    return accounts;
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