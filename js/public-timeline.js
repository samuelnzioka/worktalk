/**
 * AjiraTalk - Public Timeline Service
 * Handles public timeline operations
 */

import { postsAPI, commentsAPI } from './api.js';

/**
 * Get public timeline posts
 */
export async function getPublicTimeline(page = 1) {
    try {
        const response = await postsAPI.getPublicTimeline(page);
        return {
            posts: response.posts,
            pagination: {
                currentPage: response.page,
                totalPages: response.pages,
                hasNextPage: response.hasNextPage,
                hasPrevPage: response.hasPrevPage,
                nextPage: response.nextPage,
                prevPage: response.prevPage
            }
        };
    } catch (error) {
        console.error('Failed to get public timeline:', error);
        throw error;
    }
}

/**
 * Create a post in public timeline
 */
export async function createPublicPost(content, isAnonymous = false) {
    try {
        const response = await postsAPI.createPublicPost({
            content,
            isAnonymous
        });
        return response;
    } catch (error) {
        console.error('Failed to create public post:', error);
        throw error;
    }
}

/**
 * Like a public post
 */
export async function likePublicPost(postId) {
    try {
        const response = await postsAPI.likePost(postId);
        return response;
    } catch (error) {
        console.error('Failed to like post:', error);
        throw error;
    }
}

/**
 * Create a comment on a public post
 */
export async function createPublicComment(postId, content, isAnonymous = false) {
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