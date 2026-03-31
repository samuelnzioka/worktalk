/**
 * WorkTalk - Companies Service
 * Handles company-related operations
 */

import { companiesAPI } from './api.js';

/**
 * Get all companies with pagination and search
 */
export async function getAllCompanies(page = 1, search = '', industry = '') {
    try {
        const params = { page, limit: 20 };
        if (search) params.search = search;
        if (industry) params.industry = industry;
        
        const response = await companiesAPI.getAll(params);
        return {
            companies: response.companies,
            totalCompanies: response.total,
            totalDepartments: response.totalDepartments || 0,
            totalPosts: response.totalPosts || 0,
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
        console.error('Failed to get companies:', error);
        throw error;
    }
}

/**
 * Get company by slug
 */
export async function getCompanyBySlug(slug) {
    try {
        const company = await companiesAPI.getBySlug(slug);
        return company;
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
        const departments = await companiesAPI.getDepartments(companyId);
        return departments;
    } catch (error) {
        console.error('Failed to get departments:', error);
        throw error;
    }
}

/**
 * Register a new company
 */
export async function registerCompany(formData) {
    try {
        const response = await companiesAPI.register(formData);
        return response;
    } catch (error) {
        console.error('Failed to register company:', error);
        return { success: false, message: error.message || 'Registration failed' };
    }
}

/**
 * Get company stats for dashboard
 */
export async function getCompanyStats(companyId) {
    try {
        const stats = await companiesAPI.getStats(companyId);
        return stats;
    } catch (error) {
        console.error('Failed to get company stats:', error);
        throw error;
    }
}

/**
 * Get company employees
 */
export async function getCompanyEmployees(companyId, search = '') {
    try {
        const employees = await companiesAPI.getEmployees(companyId, { search });
        return employees;
    } catch (error) {
        console.error('Failed to get employees:', error);
        throw error;
    }
}

/**
 * Remove employee from company
 */
export async function removeEmployee(companyId, userId) {
    try {
        const response = await companiesAPI.removeEmployee(companyId, userId);
        return response;
    } catch (error) {
        console.error('Failed to remove employee:', error);
        throw error;
    }
}

/**
 * Get recent company activity
 */
export async function getRecentCompanyActivity(companyId) {
    try {
        const activity = await companiesAPI.getRecentActivity(companyId);
        return activity;
    } catch (error) {
        console.error('Failed to get activity:', error);
        throw error;
    }
}

/**
 * Update company settings
 */
export async function updateCompanySettings(companyId, settings) {
    try {
        const response = await companiesAPI.updateSettings(companyId, settings);
        return response;
    } catch (error) {
        console.error('Failed to update settings:', error);
        throw error;
    }
}