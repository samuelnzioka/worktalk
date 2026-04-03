/**
 * AjiraTalk - Utility Functions
 * Helper functions for sanitization, validation, and common operations
 */

// ... (keep all existing functions)

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
    if (name.includes('network') || name.includes('infrastructure') || name.includes('sys')) {
        return '🌐';
    }
    if (name.includes('data') || name.includes('analytics') || name.includes('ai') || name.includes('ml')) {
        return '📊';
    }
    if (name.includes('cyber') || name.includes('security') || name.includes('infosec')) {
        return '🔒';
    }
    
    // Sales & Marketing
    if (name.includes('sales') || name.includes('revenue') || name.includes('biz')) {
        return '📈';
    }
    if (name.includes('market') || name.includes('brand') || name.includes('pr') || name.includes('comms')) {
        return '📢';
    }
    if (name.includes('social') || name.includes('digital')) {
        return '📱';
    }
    
    // Operations & Logistics
    if (name.includes('oper') || name.includes('process')) {
        return '⚙️';
    }
    if (name.includes('logist') || name.includes('supply') || name.includes('warehouse') || name.includes('inventory')) {
        return '🚚';
    }
    if (name.includes('product') || name.includes('project')) {
        return '📋';
    }
    if (name.includes('quality') || name.includes('qa') || name.includes('assurance')) {
        return '✅';
    }
    
    // Finance & Legal
    if (name.includes('financ') || name.includes('account') || name.includes('audit')) {
        return '💰';
    }
    if (name.includes('legal') || name.includes('compliance') || name.includes('risk')) {
        return '⚖️';
    }
    if (name.includes('procurement') || name.includes('purchasing')) {
        return '🛒';
    }
    
    // HR & People
    if (name.includes('hr') || name.includes('human') || name.includes('people') || name.includes('talent') || name.includes('recruit')) {
        return '👥';
    }
    if (name.includes('training') || name.includes('learning') || name.includes('development')) {
        return '📚';
    }
    
    // Customer Service
    if (name.includes('customer') || name.includes('support') || name.includes('service') || name.includes('care') || name.includes('client')) {
        return '🎧';
    }
    
    // Healthcare
    if (name.includes('medical') || name.includes('health') || name.includes('clinical') || name.includes('nurse')) {
        return '🏥';
    }
    
    // Education
    if (name.includes('teach') || name.includes('educat') || name.includes('academic') || name.includes('train')) {
        return '📖';
    }
    
    // Manufacturing
    if (name.includes('manufact') || name.includes('prod') || name.includes('factory') || name.includes('assembly')) {
        return '🏭';
    }
    
    // Aviation specific
    if (name.includes('cabin') || name.includes('crew') || name.includes('flight')) {
        return '✈️';
    }
    if (name.includes('pilot') || name.includes('cockpit')) {
        return '🛫';
    }
    if (name.includes('ground') || name.includes('ramp')) {
        return '🛬';
    }
    if (name.includes('cargo')) {
        return '📦';
    }
    if (name.includes('maintenance') || name.includes('mro')) {
        return '🔧';
    }
    
    // Banking specific
    if (name.includes('bank') || name.includes('teller') || name.includes('branch')) {
        return '🏦';
    }
    if (name.includes('loan') || name.includes('credit')) {
        return '📄';
    }
    if (name.includes('investment') || name.includes('wealth')) {
        return '📊';
    }
    
    // Telecommunications
    if (name.includes('network') || name.includes('telecom')) {
        return '📡';
    }
    
    // Energy
    if (name.includes('power') || name.includes('energy') || name.includes('electric')) {
        return '⚡';
    }
    
    // Default - always returns something, never empty
    return '📁';
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