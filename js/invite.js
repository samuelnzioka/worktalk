/**
 * WorkTalk - Invite Service
 * Handles invite verification and employee registration
 */

import { invitesAPI, authAPI } from './api.js';

/**
 * Verify an invite code
 */
export async function verifyInvite(code) {
    try {
        const response = await invitesAPI.verify(code);
        return {
            success: true,
            invite: response.invite
        };
    } catch (error) {
        console.error('Invite verification failed:', error);
        return {
            success: false,
            message: error.message || 'Invalid invite code'
        };
    }
}

/**
 * Register employee with invite
 */
export async function registerEmployee(data) {
    try {
        const response = await authAPI.registerEmployee({
            inviteCode: data.inviteCode,
            name: data.name,
            email: data.email,
            password: data.password
        });
        
        if (response.success) {
            return { success: true, message: response.message };
        }
        return { success: false, message: response.message, field: response.field };
    } catch (error) {
        console.error('Employee registration failed:', error);
        return { success: false, message: error.message || 'Registration failed' };
    }
}

/**
 * Generate invite code (company admin)
 */
export async function generateInvite(companyId, departmentId) {
    try {
        const response = await invitesAPI.generate(companyId, departmentId);
        return response;
    } catch (error) {
        console.error('Failed to generate invite:', error);
        throw error;
    }
}

/**
 * Get company invites (company admin)
 */
export async function getCompanyInvites(companyId) {
    try {
        const invites = await invitesAPI.list(companyId);
        return invites;
    } catch (error) {
        console.error('Failed to get invites:', error);
        throw error;
    }
}

/**
 * Revoke invite code (company admin)
 */
export async function revokeInvite(companyId, inviteId) {
    try {
        const response = await invitesAPI.revoke(companyId, inviteId);
        return response;
    } catch (error) {
        console.error('Failed to revoke invite:', error);
        throw error;
    }
}