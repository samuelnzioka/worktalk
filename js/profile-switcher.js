/**
 * AjiraTalk - Profile Switcher Component
 * Handles profile switching UI and logic
 */

import { getCurrentUser, switchProfile } from './auth.js';
import { showToast } from './utils.js';

/**
 * Initialize profile switcher
 */
export async function initProfileSwitcher(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const user = await getCurrentUser();
    if (!user || !user.profiles || user.profiles.length <= 1) {
        container.style.display = 'none';
        return;
    }
    
    renderProfileSwitcher(container, user);
}

function renderProfileSwitcher(container, user) {
    const activeProfile = user.activeProfile || user.profiles[0];
    
    container.innerHTML = `
        <div class="profile-switcher">
            <div class="switcher-current">
                <span class="switcher-icon">${getProfileIcon(activeProfile.type)}</span>
                <span class="switcher-name">${escapeHtml(activeProfile.username)}</span>
                <button class="switcher-toggle">▼</button>
            </div>
            <div class="switcher-dropdown" style="display: none;">
                ${user.profiles.map(profile => `
                    <button class="switcher-option ${profile.id === activeProfile.id ? 'active' : ''}" 
                            data-profile-id="${profile.id}">
                        <span class="switcher-icon">${getProfileIcon(profile.type)}</span>
                        <span class="switcher-name">${escapeHtml(profile.username)}</span>
                        ${profile.type === 'employee' ? 
                            `<span class="switcher-badge">${escapeHtml(profile.companyName)}</span>` : ''}
                    </button>
                `).join('')}
                <div class="switcher-divider"></div>
                <button class="switcher-option" id="createPublicProfile">
                    <span class="switcher-icon">➕</span>
                    <span>Create Public Profile</span>
                </button>
            </div>
        </div>
    `;
    
    // Setup toggle
    const toggleBtn = container.querySelector('.switcher-toggle');
    const dropdown = container.querySelector('.switcher-dropdown');
    
    toggleBtn.addEventListener('click', () => {
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });
    
    // Handle profile switching
    container.querySelectorAll('.switcher-option[data-profile-id]').forEach(btn => {
        btn.addEventListener('click', async () => {
            const profileId = btn.dataset.profileId;
            const result = await switchProfile(profileId);
            if (result.success) {
                showToast('Profile switched', 'success');
                window.location.reload();
            } else {
                showToast(result.message || 'Failed to switch profile', 'error');
            }
        });
    });
    
    // Handle create public profile
    const createBtn = container.querySelector('#createPublicProfile');
    if (createBtn) {
        createBtn.addEventListener('click', () => {
            window.location.href = '/create-public-profile.html';
        });
    }
}

function getProfileIcon(type) {
    return type === 'employee' ? '🏢' : '🌍';
}

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}