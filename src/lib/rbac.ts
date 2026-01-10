// Role-Based Access Control (RBAC) System

export enum Role {
    SUPER_ADMIN = 'SUPER_ADMIN',
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER',
    SALES = 'SALES',
    SUPPORT = 'SUPPORT',
    GUEST = 'GUEST'
}

export enum Permission {
    // User Management
    MANAGE_USERS = 'MANAGE_USERS',
    VIEW_USERS = 'VIEW_USERS',
    
    // Lead Management
    CREATE_LEADS = 'CREATE_LEADS',
    VIEW_ALL_LEADS = 'VIEW_ALL_LEADS',
    VIEW_OWN_LEADS = 'VIEW_OWN_LEADS',
    EDIT_ALL_LEADS = 'EDIT_ALL_LEADS',
    EDIT_OWN_LEADS = 'EDIT_OWN_LEADS',
    DELETE_LEADS = 'DELETE_LEADS',
    
    // Opportunity Management
    CREATE_OPPORTUNITIES = 'CREATE_OPPORTUNITIES',
    VIEW_ALL_OPPORTUNITIES = 'VIEW_ALL_OPPORTUNITIES',
    VIEW_OWN_OPPORTUNITIES = 'VIEW_OWN_OPPORTUNITIES',
    EDIT_ALL_OPPORTUNITIES = 'EDIT_ALL_OPPORTUNITIES',
    EDIT_OWN_OPPORTUNITIES = 'EDIT_OWN_OPPORTUNITIES',
    DELETE_OPPORTUNITIES = 'DELETE_OPPORTUNITIES',
    
    // Account & Contact Management
    CREATE_ACCOUNTS = 'CREATE_ACCOUNTS',
    VIEW_ACCOUNTS = 'VIEW_ACCOUNTS',
    EDIT_ACCOUNTS = 'EDIT_ACCOUNTS',
    DELETE_ACCOUNTS = 'DELETE_ACCOUNTS',
    
    CREATE_CONTACTS = 'CREATE_CONTACTS',
    VIEW_CONTACTS = 'VIEW_CONTACTS',
    EDIT_CONTACTS = 'EDIT_CONTACTS',
    DELETE_CONTACTS = 'DELETE_CONTACTS',
    
    // Case Management
    CREATE_CASES = 'CREATE_CASES',
    VIEW_ALL_CASES = 'VIEW_ALL_CASES',
    VIEW_OWN_CASES = 'VIEW_OWN_CASES',
    EDIT_ALL_CASES = 'EDIT_ALL_CASES',
    EDIT_OWN_CASES = 'EDIT_OWN_CASES',
    DELETE_CASES = 'DELETE_CASES',
    
    // Reports & Analytics
    VIEW_REPORTS = 'VIEW_REPORTS',
    CREATE_REPORTS = 'CREATE_REPORTS',
    EXPORT_DATA = 'EXPORT_DATA',
    
    // Settings
    MANAGE_SETTINGS = 'MANAGE_SETTINGS',
    VIEW_AUDIT_LOGS = 'VIEW_AUDIT_LOGS',
}

// Role-Permission mapping
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
    [Role.SUPER_ADMIN]: Object.values(Permission),
    
    [Role.ADMIN]: [
        Permission.MANAGE_USERS,
        Permission.VIEW_USERS,
        Permission.CREATE_LEADS,
        Permission.VIEW_ALL_LEADS,
        Permission.EDIT_ALL_LEADS,
        Permission.DELETE_LEADS,
        Permission.CREATE_OPPORTUNITIES,
        Permission.VIEW_ALL_OPPORTUNITIES,
        Permission.EDIT_ALL_OPPORTUNITIES,
        Permission.DELETE_OPPORTUNITIES,
        Permission.CREATE_ACCOUNTS,
        Permission.VIEW_ACCOUNTS,
        Permission.EDIT_ACCOUNTS,
        Permission.DELETE_ACCOUNTS,
        Permission.CREATE_CONTACTS,
        Permission.VIEW_CONTACTS,
        Permission.EDIT_CONTACTS,
        Permission.DELETE_CONTACTS,
        Permission.CREATE_CASES,
        Permission.VIEW_ALL_CASES,
        Permission.EDIT_ALL_CASES,
        Permission.DELETE_CASES,
        Permission.VIEW_REPORTS,
        Permission.CREATE_REPORTS,
        Permission.EXPORT_DATA,
        Permission.MANAGE_SETTINGS,
        Permission.VIEW_AUDIT_LOGS,
    ],
    
    [Role.MANAGER]: [
        Permission.VIEW_USERS,
        Permission.CREATE_LEADS,
        Permission.VIEW_ALL_LEADS,
        Permission.EDIT_ALL_LEADS,
        Permission.CREATE_OPPORTUNITIES,
        Permission.VIEW_ALL_OPPORTUNITIES,
        Permission.EDIT_ALL_OPPORTUNITIES,
        Permission.CREATE_ACCOUNTS,
        Permission.VIEW_ACCOUNTS,
        Permission.EDIT_ACCOUNTS,
        Permission.CREATE_CONTACTS,
        Permission.VIEW_CONTACTS,
        Permission.EDIT_CONTACTS,
        Permission.CREATE_CASES,
        Permission.VIEW_ALL_CASES,
        Permission.EDIT_ALL_CASES,
        Permission.VIEW_REPORTS,
        Permission.CREATE_REPORTS,
        Permission.EXPORT_DATA,
    ],
    
    [Role.SALES]: [
        Permission.CREATE_LEADS,
        Permission.VIEW_OWN_LEADS,
        Permission.EDIT_OWN_LEADS,
        Permission.CREATE_OPPORTUNITIES,
        Permission.VIEW_OWN_OPPORTUNITIES,
        Permission.EDIT_OWN_OPPORTUNITIES,
        Permission.VIEW_ACCOUNTS,
        Permission.VIEW_CONTACTS,
        Permission.CREATE_CONTACTS,
        Permission.VIEW_REPORTS,
    ],
    
    [Role.SUPPORT]: [
        Permission.VIEW_ACCOUNTS,
        Permission.VIEW_CONTACTS,
        Permission.CREATE_CASES,
        Permission.VIEW_OWN_CASES,
        Permission.EDIT_OWN_CASES,
        Permission.VIEW_REPORTS,
    ],
    
    [Role.GUEST]: [
        Permission.VIEW_OWN_LEADS,
        Permission.VIEW_OWN_OPPORTUNITIES,
    ],
};

export function hasPermission(role: Role | string, permission: Permission): boolean {
    const userRole = role as Role;
    const permissions = ROLE_PERMISSIONS[userRole] || [];
    return permissions.includes(permission);
}

export function hasAnyPermission(role: Role | string, permissions: Permission[]): boolean {
    return permissions.some(permission => hasPermission(role, permission));
}

export function hasAllPermissions(role: Role | string, permissions: Permission[]): boolean {
    return permissions.every(permission => hasPermission(role, permission));
}

export function getRolePermissions(role: Role | string): Permission[] {
    return ROLE_PERMISSIONS[role as Role] || [];
}

export function canAccessResource(
    userRole: Role | string,
    ownerId: string,
    currentUserId: string,
    requiredPermission: Permission
): boolean {
    // Check if user has global permission
    if (hasPermission(userRole, requiredPermission)) {
        return true;
    }
    
    // Check if user has "own" permission and is the owner
    const ownPermission = getOwnPermission(requiredPermission);
    if (ownPermission && hasPermission(userRole, ownPermission) && ownerId === currentUserId) {
        return true;
    }
    
    return false;
}

function getOwnPermission(globalPermission: Permission): Permission | null {
    const mapping: Record<string, Permission> = {
        [Permission.VIEW_ALL_LEADS]: Permission.VIEW_OWN_LEADS,
        [Permission.EDIT_ALL_LEADS]: Permission.EDIT_OWN_LEADS,
        [Permission.VIEW_ALL_OPPORTUNITIES]: Permission.VIEW_OWN_OPPORTUNITIES,
        [Permission.EDIT_ALL_OPPORTUNITIES]: Permission.EDIT_OWN_OPPORTUNITIES,
        [Permission.VIEW_ALL_CASES]: Permission.VIEW_OWN_CASES,
        [Permission.EDIT_ALL_CASES]: Permission.EDIT_OWN_CASES,
    };
    return mapping[globalPermission] || null;
}
