/**
 * AjiraTalk - Company Dashboard Service
 * Handles company admin operations
 */

import { companiesAPI, invitesAPI, departmentsAPI, moderationAPI } from './api.js';

/**
 * Get company stats
 */
export async function getCompanyStats() {
    try {
        const companyId = localStorage.getItem('currentCompanyId');
        if (!companyId) throw new Error('No company ID found');
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
export async function getEmployees(search = '') {
    try {
        const companyId = localStorage.getItem('currentCompanyId');
        if (!companyId) throw new Error('No company ID found');
        const employees = await companiesAPI.getEmployees(companyId, { search });
        return employees;
    } catch (error) {
        console.error('Failed to get employees:', error);
        throw error;
    }
}

/**
 * Remove employee
 */
export async function removeEmployee(userId) {
    try {
        const companyId = localStorage.getItem('currentCompanyId');
        if (!companyId) throw new Error('No company ID found');
        const response = await companiesAPI.removeEmployee(companyId, userId);
        return response;
    } catch (error) {
        console.error('Failed to remove employee:', error);
        throw error;
    }
}

/**
 * Get company invites
 */
export async function getInvites() {
    try {
        const companyId = localStorage.getItem('currentCompanyId');
        if (!companyId) throw new Error('No company ID found');
        const invites = await invitesAPI.list(companyId);
        return invites;
    } catch (error) {
        console.error('Failed to get invites:', error);
        throw error;
    }
}

/**
 * Generate invite code
 */
export async function generateInvite(departmentId) {
    try {
        const companyId = localStorage.getItem('currentCompanyId');
        if (!companyId) throw new Error('No company ID found');
        const response = await invitesAPI.generate(companyId, departmentId);
        return response;
    } catch (error) {
        console.error('Failed to generate invite:', error);
        throw error;
    }
}

/**
 * Revoke invite code
 */
export async function revokeInvite(inviteId) {
    try {
        const companyId = localStorage.getItem('currentCompanyId');
        if (!companyId) throw new Error('No company ID found');
        const response = await invitesAPI.revoke(companyId, inviteId);
        return response;
    } catch (error) {
        console.error('Failed to revoke invite:', error);
        throw error;
    }
}

/**
 * Get company departments
 */
export async function getDepartments() {
    try {
        const companyId = localStorage.getItem('currentCompanyId');
        if (!companyId) throw new Error('No company ID found');
        const departments = await departmentsAPI.list(companyId);
        return departments;
    } catch (error) {
        console.error('Failed to get departments:', error);
        throw error;
    }
}

/**
 * Add department
 */
export async function addDepartment(name) {
    try {
        const companyId = localStorage.getItem('currentCompanyId');
        if (!companyId) throw new Error('No company ID found');
        const response = await departmentsAPI.create(companyId, { name });
        return response;
    } catch (error) {
        console.error('Failed to add department:', error);
        throw error;
    }
}

/**
 * Update department
 */
export async function updateDepartment(departmentId, data) {
    try {
        const companyId = localStorage.getItem('currentCompanyId');
        if (!companyId) throw new Error('No company ID found');
        const response = await departmentsAPI.update(companyId, departmentId, data);
        return response;
    } catch (error) {
        console.error('Failed to update department:', error);
        throw error;
    }
}

/**
 * Delete department
 */
export async function deleteDepartment(departmentId) {
    try {
        const companyId = localStorage.getItem('currentCompanyId');
        if (!companyId) throw new Error('No company ID found');
        const response = await departmentsAPI.delete(companyId, departmentId);
        return response;
    } catch (error) {
        console.error('Failed to delete department:', error);
        throw error;
    }
}

/**
 * Get flagged content
 */
export async function getFlaggedContent() {
    try {
        const companyId = localStorage.getItem('currentCompanyId');
        if (!companyId) throw new Error('No company ID found');
        const flagged = await moderationAPI.getFlagged(companyId);
        return flagged;
    } catch (error) {
        console.error('Failed to get flagged content:', error);
        throw error;
    }
}

/**
 * Resolve flagged content
 */
export async function resolveFlagged(flagId, action) {
    try {
        const companyId = localStorage.getItem('currentCompanyId');
        if (!companyId) throw new Error('No company ID found');
        const response = await moderationAPI.resolveFlag(companyId, flagId, action);
        return response;
    } catch (error) {
        console.error('Failed to resolve flag:', error);
        throw error;
    }
}

/**
 * Update company settings
 */
export async function updateCompanySettings(settings) {
    try {
        const companyId = localStorage.getItem('currentCompanyId');
        if (!companyId) throw new Error('No company ID found');
        const response = await companiesAPI.updateSettings(companyId, settings);
        return response;
    } catch (error) {
        console.error('Failed to update settings:', error);
        throw error;
    }
}

/**
 * Get recent activity
 */
export async function getRecentActivity() {
    try {
        const companyId = localStorage.getItem('currentCompanyId');
        if (!companyId) throw new Error('No company ID found');
        const activity = await companiesAPI.getRecentActivity(companyId);
        return activity;
    } catch (error) {
        console.error('Failed to get activity:', error);
        throw error;
    }
}