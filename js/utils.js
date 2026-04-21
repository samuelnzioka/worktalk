/**
 * AjiraTalk - Utility Functions
 * Helper functions for sanitization, validation, and common operations
 */

/**
 * Sanitize user input to prevent XSS attacks
 * @param {string} input - The user input to sanitize
 * @returns {string} - Sanitized string
 */
/**
 * Validate password strength
 * @param {string} password - The password to validate
 * @returns {boolean} - Whether the password meets requirements
 */
export function validatePassword(password) {
    if (!password) return false;
    return password.length >= 8;
}

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {string} type - The type of toast ('success', 'error', 'info', 'warning')
 * @param {number} duration - Duration in milliseconds (default: 3000)
 */
export function showToast(message, type = 'info', duration = 3000) {
    // Remove existing toasts
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️'
    };
    
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <span class="toast-message">${message}</span>
    `;
    
    // Styles
    Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        fontWeight: '500',
        zIndex: '10000',
        animation: 'slideIn 0.3s ease',
        maxWidth: '400px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        color: '#fff'
    });

    const colors = {
        success: '#48bb78',
        error: '#e53e3e',
        info: '#4299e1',
        warning: '#ed8936'
    };
    toast.style.background = colors[type] || colors.info;

    // Add animation keyframes if not already present
    if (!document.querySelector('#toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(toast);

    // Auto-remove
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

export function sanitizeInput(input) {
    if (input === null || input === undefined) return '';
    
    let str = String(input);
    
    const htmlEntities = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };
    
    return str.replace(/[&<>"'/`=]/g, function(char) {
        return htmlEntities[char];
    });
}

/**
 * Get department icon based on department name (smart matching)
 * Returns appropriate emoji or default 📁 if no match
 */
export function getDepartmentIcon(departmentName) {
    if (!departmentName) return '📁';
    
    const name = departmentName.toLowerCase().trim();
    
    // Technology & IT
    if (name.includes('engin') || name.includes('tech') || name.includes('it') || name.includes('software') || name.includes('dev')) {
        return '💻';
    }
    // Sales & Marketing
    if (name.includes('sale') || name.includes('market') || name.includes('growth') || name.includes('business dev')) {
        return '📈';
    }
    // HR & People
    if (name.includes('hr') || name.includes('human') || name.includes('people') || name.includes('talent') || name.includes('recruit')) {
        return '👥';
    }
    // Finance
    if (name.includes('finan') || name.includes('account') || name.includes('payroll') || name.includes('treasury')) {
        return '💰';
    }
    // Legal
    if (name.includes('legal') || name.includes('compliance') || name.includes('regulatory')) {
        return '⚖️';
    }
    // Operations
    if (name.includes('oper') || name.includes('logistics') || name.includes('supply') || name.includes('warehouse')) {
        return '📦';
    }
    // Customer Service
    if (name.includes('support') || name.includes('customer') || name.includes('service') || name.includes('success')) {
        return '🎧';
    }
    // Design
    if (name.includes('design') || name.includes('ux') || name.includes('ui') || name.includes('creative')) {
        return '🎨';
    }
    // Product
    if (name.includes('product') || name.includes('pm') || name.includes('strategy')) {
        return '🚀';
    }
    // Data
    if (name.includes('data') || name.includes('analytic') || name.includes('science') || name.includes('bi')) {
        return '📊';
    }
    // Security
    if (name.includes('security') || name.includes('cyber') || name.includes('infosec')) {
        return '🔒';
    }
    // Executive
    if (name.includes('exec') || name.includes('ceo') || name.includes('cto') || name.includes('cfo') || name.includes('board')) {
        return '👔';
    }
    // Research
    if (name.includes('research') || name.includes('r&d') || name.includes('lab')) {
        return '🔬';
    }
    // Quality
    if (name.includes('quality') || name.includes('qa') || name.includes('testing')) {
        return '✅';
    }
    
    return '📁'; // Default
}

/**
 * Get company icon based on industry (for company registration)
 */
export function getCompanyIcon(industry) {
    if (!industry) return '🏢';
    
    const icons = {
        'Telecommunications': '📱',
        'Banking': '🏦',
        'Finance': '💰',
        'Aviation': '✈️',
        'Energy': '⚡',
        'E-commerce': '🛒',
        'Logistics': '🚚',
        'Technology': '💻',
        'Manufacturing': '🏭',
        'Retail': '🏬',
        'Healthcare': '🏥',
        'Education': '📚',
        'Hospitality': '🏨',
        'Construction': '🏗️',
        'Agriculture': '🌾'
    };
    
    return icons[industry] || '🏢';
}