/**
 * AjiraTalk - Main Application Entry Point
 * Initializes global components and handles authentication state
 */

import { getCurrentUser, isAuthenticated, logout } from './auth.js';
import { setupAPIInterceptors } from './api.js';
import { showToast } from './utils.js';

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Setup API interceptors for error handling
    setupAPIInterceptors();
    
    // Check authentication status
    await initAuth();
    
    // Setup logout handler
    setupLogoutHandler();
    
    // Initialize profile switcher if on dashboard
    if (window.location.pathname.includes('dashboard')) {
        const { initProfileSwitcher } = await import('./profile-switcher.js');
        await initProfileSwitcher('profileSwitcher');
    }
});

/**
 * Initialize authentication state
 */
async function initAuth() {
    const userMenu = document.getElementById('userMenu');
    if (!userMenu) return;
    
    if (isAuthenticated()) {
        try {
            const user = await getCurrentUser();
            if (user) {
                updateLoggedInMenu(userMenu, user);
                return;
            }
        } catch (error) {
            console.error('Failed to get user:', error);
        }
    }
    
    updateLoggedOutMenu(userMenu);
}

/**
 * Update menu for logged in users
 */
function updateLoggedInMenu(userMenu, user) {
    const activeProfile = user.activeProfile || user.profiles?.[0];
    const displayName = activeProfile?.username || user.email?.split('@')[0];
    
    userMenu.innerHTML = `
        <div class="user-dropdown">
            <button class="user-avatar" id="userMenuBtn">
                <span class="avatar-icon">👤</span>
                <span class="user-name">${escapeHtml(displayName)}</span>
                <span class="dropdown-arrow">▼</span>
            </button>
            <div class="dropdown-menu" id="userDropdown">
                <div class="dropdown-section">
                    <div class="dropdown-header">Profiles</div>
                    <div id="profileSwitcherMini"></div>
                </div>
                <div class="dropdown-divider"></div>
                <a href="/dashboard.html" class="dropdown-item">Dashboard</a>
                <button id="logoutBtn" class="dropdown-item logout-item">Sign Out</button>
            </div>
        </div>
    `;
    
    // Setup dropdown
    const userMenuBtn = document.getElementById('userMenuBtn');
    const dropdown = document.getElementById('userDropdown');
    
    if (userMenuBtn && dropdown) {
        userMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
        });
        
        document.addEventListener('click', (e) => {
            if (!userMenuBtn.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });
    }
    
    // Load profile switcher if profiles exist
    if (user.profiles && user.profiles.length > 1) {
        loadProfileSwitcherMini(user);
    }
}

/**
 * Load mini profile switcher in dropdown
 */
async function loadProfileSwitcherMini(user) {
    const container = document.getElementById('profileSwitcherMini');
    if (!container) return;
    
    const { switchProfile } = await import('./auth.js');
    const { showToast } = await import('./utils.js');
    
    const activeProfileId = user.activeProfileId || user.profiles[0]?.id;
    
    container.innerHTML = user.profiles.map(profile => `
        <button class="dropdown-item profile-item ${profile.id === activeProfileId ? 'active' : ''}" 
                data-profile-id="${profile.id}">
            <span class="profile-icon">${profile.type === 'employee' ? '🏢' : '🌍'}</span>
            <span class="profile-name">${escapeHtml(profile.username)}</span>
            ${profile.type === 'employee' ? 
                `<span class="profile-badge">${escapeHtml(profile.companyName || 'Employee')}</span>` : ''}
        </button>
    `).join('');
    
    container.querySelectorAll('.profile-item').forEach(item => {
        item.addEventListener('click', async () => {
            const profileId = item.dataset.profileId;
            const result = await switchProfile(profileId);
            if (result.success) {
                showToast('Profile switched', 'success');
                window.location.reload();
            } else {
                showToast(result.message || 'Failed to switch profile', 'error');
            }
        });
    });
}

/**
 * Update menu for logged out users
 */
function updateLoggedOutMenu(userMenu) {
    userMenu.innerHTML = `
        <a href="/login.html" class="btn btn-outline">Log In</a>
        <a href="/register.html" class="btn btn-primary">Sign Up</a>
    `;
}

/**
 * Setup logout button handler
 */
function setupLogoutHandler() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await logout();
            window.location.href = '/';
        });
    }
}

/**
 * Escape HTML helper
 */
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}