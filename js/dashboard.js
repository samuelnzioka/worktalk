/**
 * WorkTalk - Dashboard Service
 * Handles user dashboard operations
 */

import { userAPI, companiesAPI, postsAPI } from './api.js';

/**
 * Get user activity feed
 */
export async function getUserActivity() {
    try {
        const activity = await userAPI.getActivity();
        return activity;
    } catch (error) {
        console.error('Failed to get user activity:', error);
        throw error;
    }
}

/**
 * Get user's company posts
 */
export async function getUserCompanyPosts() {
    try {
        const posts = await userAPI.getCompanyPosts();
        return posts;
    } catch (error) {
        console.error('Failed to get company posts:', error);
        throw error;
    }
}

/**
 * Get user's public posts
 */
export async function getUserPublicPosts() {
    try {
        const posts = await userAPI.getPublicPosts();
        return posts;
    } catch (error) {
        console.error('Failed to get public posts:', error);
        throw error;
    }
}

/**
 * Update user profile
 */
export async function updateUserProfile(data) {
    try {
        const response = await userAPI.updateProfile(data);
        return response;
    } catch (error) {
        console.error('Failed to update profile:', error);
        throw error;
    }
}

/**
 * Change user password
 */
export async function changePassword(currentPassword, newPassword) {
    try {
        const response = await userAPI.changePassword({
            currentPassword,
            newPassword
        });
        return response;
    } catch (error) {
        console.error('Failed to change password:', error);
        throw error;
    }
}

/**
 * Delete user account
 */
export async function deleteAccount() {
    try {
        const response = await userAPI.deleteAccount();
        return response;
    } catch (error) {
        console.error('Failed to delete account:', error);
        throw error;
    }
}

/**
 * Export user data
 */
export async function exportUserData() {
    try {
        const data = await userAPI.exportData();
        return data;
    } catch (error) {
        console.error('Failed to export data:', error);
        throw error;
    }
}