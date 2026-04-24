/**
 * AjiraTalk - Companies Service
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
        // Map frontend field names to backend field names
        const backendData = {
            name: formData.companyName,
            industry: formData.industry,
            description: formData.description,
            website: formData.website,
            companyEmail: formData.companyEmail,
            contactName: formData.adminName,
            contactEmail: formData.adminEmail,
            contactPhone: formData.companyPhone,
            adminPhone: formData.adminPhone,
            departments: JSON.stringify(formData.departments),
            adminPassword: formData.adminPassword,
            confirmPassword: formData.confirmPassword,
            emailVerificationCode: formData.emailVerificationCode,
            // Optional fields
            taxId: formData.taxId,
            registrationNumber: formData.registrationNumber,
            country: formData.country,
            jobTitle: formData.jobTitle,
            yearFounded: formData.yearFounded,
            revenueRange: formData.revenueRange,
            streetAddress: formData.streetAddress,
            city: formData.city,
            postalCode: formData.postalCode
        };
        
        const response = await companiesAPI.register(backendData);
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

/**
 * Switch to public account
 * Sets currentAccount to 'public' and uses public tokens
 */
export function switchToPublicAccount() {
    localStorage.setItem('currentAccount', 'public');
    console.log('Switched to public account');
    // Reload to apply changes
    window.location.reload();
}

/**
 * Switch to company account
 * Sets currentAccount to 'company' and uses company tokens
 */
export function switchToCompanyAccount() {
    const companyUser = localStorage.getItem('companyUser');
    if (!companyUser) {
        console.error('No company account found');
        return false;
    }
    localStorage.setItem('currentAccount', 'company');
    console.log('Switched to company account');
    // Reload to apply changes
    window.location.reload();
    return true;
}

/**
 * Get current active account type
 * Returns 'public', 'company', or null if not set
 */
export function getCurrentAccountType() {
    return localStorage.getItem('currentAccount') || 'public';
}

/**
 * Get current active user
 * Returns the user object for the currently active account
 */
export function getCurrentUser() {
    const currentAccount = getCurrentAccountType();
    if (currentAccount === 'company') {
        return JSON.parse(localStorage.getItem('companyUser') || 'null');
    }
    return JSON.parse(localStorage.getItem('user') || 'null');
}

/**
 * Get current active access token
 * Returns the access token for the currently active account
 */
export function getCurrentAccessToken() {
    const currentAccount = getCurrentAccountType();
    if (currentAccount === 'company') {
        return localStorage.getItem('companyAccessToken');
    }
    return localStorage.getItem('accessToken');
}

/**
 * Get current active refresh token
 * Returns the refresh token for the currently active account
 */
export function getCurrentRefreshToken() {
    const currentAccount = getCurrentAccountType();
    if (currentAccount === 'company') {
        return localStorage.getItem('companyRefreshToken');
    }
    return localStorage.getItem('refreshToken');
}