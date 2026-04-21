/**
 * AjiraTalk - Utility Functions
 * Helper functions for sanitization, validation, and common operations
 */

/**
 * Sanitize user input to prevent XSS attacks
 * @param {string} input - The user input to sanitize
 * @returns {string} - Sanitized string
 */
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
    // ... rest of your getDepartmentIcon function ...
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