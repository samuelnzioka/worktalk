/**
 * AjiraTalk - Company Detail Service
 * Handles company-specific operations including posts and comments
 */

import { postsAPI, departmentsAPI, commentsAPI } from './api.js';

/**
 * Get company by slug
 */
export async function getCompanyBySlug(slug) {
    try {
        const response = await fetch(`${API_BASE_URL}/companies/${slug}`);
        if (!response.ok) throw new Error('Company not found');
        return await response.json();
    } catch (error) {
        console.error('Failed to get company:', error);
        throw error;
    }
}

/**
 * Get company departments
 */
export async function getCompanyDepartments(companyId) {
    try {
        const departments = await departmentsAPI.list(companyId);
        return departments;
    } catch (error) {
        console.error('Failed to get departments:', error);
        throw error;
    }
}

/**
 * Get department posts
 */
export async function getDepartmentPosts(companyId, departmentId, page = 1) {
    try {
        const response = await postsAPI.getCompanyPosts(companyId, departmentId, page);
        return response;
    } catch (error) {
        console.error('Failed to get department posts:', error);
        throw error;
    }
}

/**
 * Create a post in company department
 */
export async function createCompanyPost(companyId, departmentId, content, isAnonymous = true) {
    try {
        const response = await postsAPI.createCompanyPost({
            companyId,
            departmentId,
            content,
            isAnonymous
        });
        return response;
    } catch (error) {
        console.error('Failed to create post:', error);
        throw error;
    }
}

/**
 * Like a post
 */
export async function likePost(postId) {
    try {
        const response = await postsAPI.likePost(postId);
        return response;
    } catch (error) {
        console.error('Failed to like post:', error);
        throw error;
    }
}

/**
 * Create a comment on a post
 */
export async function createComment(postId, content, isAnonymous = true) {
    try {
        const response = await commentsAPI.create({
            postId,
            content,
            isAnonymous
        });
        return response;
    } catch (error) {
        console.error('Failed to create comment:', error);
        throw error;
    }
}

/**
 * Flag a post as inappropriate
 */
export async function flagPost(postId, reason) {
    try {
        const response = await postsAPI.flagPost(postId, reason);
        return response;
    } catch (error) {
        console.error('Failed to flag post:', error);
        throw error;
    }
}