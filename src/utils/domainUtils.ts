// Domain configuration and utilities
export interface DomainConfig {
  domain: string;
  userType: 'customer' | 'seller' | 'admin';
  title: string;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

// Domain configurations
export const DOMAIN_CONFIGS: Record<string, DomainConfig> = {
  // Main domain (public showroom)
  'main': {
    domain: 'main',
    userType: 'seller', // Default to seller for main site
    title: 'Tile Showroom - Virtual Showroom',
    theme: {
      primary: '#2563eb', // Blue
      secondary: '#1e40af',
      accent: '#3b82f6'
    }
  },
  // Seller domain
  'seller': {
    domain: 'seller',
    userType: 'seller', 
    title: 'Tile Showroom - Seller Dashboard',
    theme: {
      primary: '#059669', // Green
      secondary: '#047857',
      accent: '#10b981'
    }
  },
  // Admin domain
  'admin': {
    domain: 'admin',
    userType: 'admin',
    title: 'Tile Showroom - Admin Panel',
    theme: {
      primary: '#7c3aed', // Purple
      secondary: '#6d28d9',
      accent: '#8b5cf6'
    }
  }
};

// Get current domain configuration
export const getCurrentDomainConfig = (): DomainConfig => {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  
  // Simple path-based routing for all domains
  if (pathname.startsWith('/admin')) {
    return DOMAIN_CONFIGS.admin;
  } else if (pathname.startsWith('/seller')) {
    return DOMAIN_CONFIGS.seller;
  } else {
    // Default to main showroom for all other paths
    return DOMAIN_CONFIGS.main;
  }
};

// Check if user can access current domain
export const canAccessDomain = (userRole: string | null, domainConfig: DomainConfig): boolean => {
  // Always allow access to main showroom (public)
  if (domainConfig.userType === 'seller' && domainConfig.domain === 'main') {
    return true;
  }
  
  // For specific portals, require authentication and matching role
  if (!userRole) {
    return false;
  }
  
  return userRole === domainConfig.userType;
};

// Redirect to appropriate domain
export const redirectToUserDomain = (userRole: string) => {
  const currentConfig = getCurrentDomainConfig();
  
  if (userRole !== currentConfig.userType) {
    const targetConfig = Object.values(DOMAIN_CONFIGS).find(config => config.userType === userRole);
    
    if (targetConfig) {
      // In development, use path-based routing
      if (window.location.hostname === 'localhost') {
        window.location.href = `${window.location.protocol}//${window.location.host}/${targetConfig.domain}`;
      } else {
        // In production, use subdomain routing
        const newHostname = window.location.hostname.replace(/^[^.]+/, targetConfig.domain);
        window.location.href = `${window.location.protocol}//${newHostname}${window.location.pathname}`;
      }
    }
  }
};

// Apply domain-specific theme
export const applyDomainTheme = (domainConfig: DomainConfig) => {
  const root = document.documentElement;
  root.style.setProperty('--primary-color', domainConfig.theme.primary);
  root.style.setProperty('--secondary-color', domainConfig.theme.secondary);
  root.style.setProperty('--accent-color', domainConfig.theme.accent);
  
  // Update page title
  document.title = domainConfig.title;
};