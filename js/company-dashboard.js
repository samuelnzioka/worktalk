/**
 * WorkTalk - Company Dashboard Service
 * Handles company admin operations
 */

import { companiesAPI, invitesAPI, departmentsAPI, moderationAPI } from './api.js';

/**
 * Get company stats
 */
export async function getCompanyStats() {
    try {
        const stats = await companiesAPI.getStats();
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
        const employees = await companiesAPI.getEmployees({ search });
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
        const response = await companiesAPI.removeEmployee(userId);
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
        const invites = await invitesAPI.list();
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
        const response = await invitesAPI.generate(departmentId);
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
        const response = await invitesAPI.revoke(inviteId);
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
        const departments = await departmentsAPI.list();
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
        const response = await departmentsAPI.create({ name });
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
        const response = await departmentsAPI.update(departmentId, data);
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
        const response = await departmentsAPI.delete(departmentId);
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
        const flagged = await moderationAPI.getFlagged();
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
        const response = await moderationAPI.resolveFlag(flagId, action);
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
        const response = await companiesAPI.updateSettings(settings);
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
        const activity = await companiesAPI.getRecentActivity();
        return activity;
    } catch (error) {
        console.error('Failed to get activity:', error);
        throw error;
    }
}