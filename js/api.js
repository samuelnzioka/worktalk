/**
 * AjiraTalk - API Service
 * Handles all API calls with authentication, error handling, and security
 */

const API_BASE_URL = 'https://worktalk-backend2.onrender.com/api';

// Helper function for API calls
export async function apiCall(endpoint, options = {}) {
    const token = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const config = {
        ...options,
        headers,
        credentials: 'include'
    };
    
    // Handle FormData (for file uploads)
    if (options.body instanceof FormData) {
        delete headers['Content-Type'];
        config.body = options.body;
    } else if (options.body && typeof options.body === 'object') {
        config.body = JSON.stringify(options.body);
    }
    
    try {
        let response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        
        // Handle token refresh on 401
        if (response.status === 401 && refreshToken && !endpoint.includes('/auth/refresh')) {
            const refreshed = await refreshAccessToken();
            if (refreshed) {
                // Retry with new token
                headers['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
                config.headers = headers;
                response = await fetch(`${API_BASE_URL}${endpoint}`, config);
            }
        }
        
        const data = await response.json();
        
        if (!response.ok) {
            throw {
                status: response.status,
                message: data.message || 'Something went wrong',
                field: data.field,
                errors: data.errors
            };
        }
        
        return data;
    } catch (error) {
        if (error.status === 429) {
            throw { message: 'Too many requests. Please try again later.' };
        }
        if (error.status === 403) {
            throw { message: 'You do not have permission to perform this action.' };
        }
        if (error.status === 404) {
            throw { message: 'Resource not found.' };
        }
        throw error;
    }
}

// Refresh access token
async function refreshAccessToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return false;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (response.ok && data.accessToken) {
            localStorage.setItem('accessToken', data.accessToken);
            if (data.refreshToken) {
                localStorage.setItem('refreshToken', data.refreshToken);
            }
            return true;
        }
    } catch (error) {
        console.error('Token refresh failed:', error);
    }
    
    // Refresh failed, clear tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return false;
}

// Setup API interceptors for global error handling
export function setupAPIInterceptors() {
    // Add global error handler for unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        if (event.reason?.message === 'Not authorized') {
            window.location.href = '/login.html?redirect=' + encodeURIComponent(window.location.pathname);
        }
    });
}

// Export API modules
export const authAPI = {
    register: (data) => apiCall('/auth/register', { method: 'POST', body: data }),
    registerEmployee: (data) => apiCall('/auth/register-employee', { method: 'POST', body: data }),
    login: (data) => apiCall('/auth/login', { method: 'POST', body: data }),
    logout: () => apiCall('/auth/logout', { method: 'POST' }),
    refreshToken: () => apiCall('/auth/refresh-token', { method: 'POST' }),
    verifyEmail: (token) => apiCall(`/auth/verify-email/${token}`),
    resendVerification: (email) => apiCall('/auth/resend-verification', { method: 'POST', body: { email } }),
    forgotPassword: (email) => apiCall('/auth/forgot-password', { method: 'POST', body: { email } }),
    resetPassword: (token, password) => apiCall('/auth/reset-password', { method: 'POST', body: { token, password } }),
    getCurrentUser: () => apiCall('/auth/me')
};

export const companiesAPI = {
    getAll: (params) => {
        const query = new URLSearchParams(params).toString();
        return apiCall(`/companies${query ? `?${query}` : ''}`);
    },
    getBySlug: (slug) => apiCall(`/companies/${slug}`),
    getDepartments: (companyId) => apiCall(`/companies/${companyId}/departments`),
    register: (formData) => apiCall('/companies/register', { method: 'POST', body: formData }),
    update: (id, data) => apiCall(`/companies/${id}`, { method: 'PUT', body: data }),
    getEmployees: (companyId, params) => {
        const query = new URLSearchParams(params).toString();
        return apiCall(`/companies/${companyId}/employees${query ? `?${query}` : ''}`);
    },
    removeEmployee: (companyId, userId) => apiCall(`/companies/${companyId}/employees/${userId}`, { method: 'DELETE' }),
    getStats: (companyId) => apiCall(`/companies/${companyId}/stats`),
    getRecentActivity: (companyId) => apiCall(`/companies/${companyId}/activity`),
    updateSettings: (companyId, settings) => apiCall(`/companies/${companyId}/settings`, { method: 'PUT', body: settings })
};

export const invitesAPI = {
    verify: (code) => apiCall(`/invites/verify/${code}`),
    generate: (companyId, departmentId) => apiCall(`/companies/${companyId}/invites`, { method: 'POST', body: { departmentId } }),
    list: (companyId) => apiCall(`/companies/${companyId}/invites`),
    revoke: (companyId, inviteId) => apiCall(`/companies/${companyId}/invites/${inviteId}`, { method: 'DELETE' })
};

export const postsAPI = {
    getCompanyPosts: (companyId, departmentId, page = 1) => {
        const query = new URLSearchParams({ page }).toString();
        return apiCall(`/posts/company/${companyId}/department/${departmentId}?${query}`);
    },
    createCompanyPost: (data) => apiCall('/posts/company', { method: 'POST', body: data }),
    getPublicTimeline: (page = 1) => apiCall(`/timeline?page=${page}`),
    createPublicPost: (data) => apiCall('/posts/public', { method: 'POST', body: data }),
    likePost: (postId) => apiCall(`/posts/${postId}/like`, { method: 'POST' }),
    flagPost: (postId, reason) => apiCall(`/posts/${postId}/flag`, { method: 'POST', body: { reason } }),
    deletePost: (postId) => apiCall(`/posts/${postId}`, { method: 'DELETE' })
};

export const commentsAPI = {
    getPostComments: (postId, page = 1) => apiCall(`/comments/post/${postId}?page=${page}`),
    create: (data) => apiCall('/comments', { method: 'POST', body: data }),
    like: (commentId) => apiCall(`/comments/${commentId}/like`, { method: 'POST' }),
    delete: (commentId) => apiCall(`/comments/${commentId}`, { method: 'DELETE' })
};

export const departmentsAPI = {
    list: (companyId) => apiCall(`/companies/${companyId}/departments`),
    create: (companyId, data) => apiCall(`/companies/${companyId}/departments`, { method: 'POST', body: data }),
    update: (departmentId, data) => apiCall(`/departments/${departmentId}`, { method: 'PUT', body: data }),
    delete: (departmentId) => apiCall(`/departments/${departmentId}`, { method: 'DELETE' })
};

export const profileAPI = {
    getProfiles: () => apiCall('/profiles'),
    switchProfile: (profileId) => apiCall('/profiles/switch', { method: 'POST', body: { profileId } }),
    createPublicProfile: (data) => apiCall('/profiles/public', { method: 'POST', body: data }),
    updateUsername: (username) => apiCall('/profiles/public/username', { method: 'PUT', body: { username } }),
    getEmployeeVerification: () => apiCall('/profiles/employee/verify')
};

export const userAPI = {
    getProfile: (userId) => apiCall(`/users/${userId}`),
    updateProfile: (data) => apiCall('/users/profile', { method: 'PUT', body: data }),
    changePassword: (data) => apiCall('/users/change-password', { method: 'POST', body: data }),
    deleteAccount: () => apiCall('/users/account', { method: 'DELETE' }),
    exportData: () => apiCall('/users/export-data'),
    getActivity: () => apiCall('/users/activity'),
    getCompanyPosts: () => apiCall('/users/posts/company'),
    getPublicPosts: () => apiCall('/users/posts/public')
};

export const moderationAPI = {
    getFlagged: (companyId) => apiCall(`/companies/${companyId}/flagged`),
    resolveFlag: (flagId, action) => apiCall(`/moderation/flag/${flagId}`, { method: 'POST', body: { action } })
};