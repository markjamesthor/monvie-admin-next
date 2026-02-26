// Admin roles definition
export enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  MANAGER = 'manager',
  OPERATOR = 'operator',
  MARKETING = 'marketing',
  VIEWER = 'viewer',
}

// Role permissions mapping
export const ROLE_PERMISSIONS: Record<AdminRole, {
  canManageOrders: boolean;
  canManageProduction: boolean;
  canViewAnalytics: boolean;
  canManageRecovery: boolean;
  canManageSettings: boolean;
  canManageTeam: boolean;
}> = {
  [AdminRole.SUPER_ADMIN]: {
    canManageOrders: true,
    canManageProduction: true,
    canViewAnalytics: true,
    canManageRecovery: true,
    canManageSettings: true,
    canManageTeam: true,
  },
  [AdminRole.MANAGER]: {
    canManageOrders: true,
    canManageProduction: true,
    canViewAnalytics: true,
    canManageRecovery: true,
    canManageSettings: false,
    canManageTeam: false,
  },
  [AdminRole.OPERATOR]: {
    canManageOrders: true,
    canManageProduction: true,
    canViewAnalytics: false,
    canManageRecovery: false,
    canManageSettings: false,
    canManageTeam: false,
  },
  [AdminRole.MARKETING]: {
    canManageOrders: false,
    canManageProduction: false,
    canViewAnalytics: true,
    canManageRecovery: true,
    canManageSettings: false,
    canManageTeam: false,
  },
  [AdminRole.VIEWER]: {
    canManageOrders: false,
    canManageProduction: false,
    canViewAnalytics: true,
    canManageRecovery: false,
    canManageSettings: false,
    canManageTeam: false,
  },
};

// Mock admin users (for development)
export const MOCK_ADMIN_USERS = [
  { id: 'admin-001', email: 'admin@monvie.kr', name: 'Mark (대표)', role: AdminRole.SUPER_ADMIN },
  { id: 'admin-002', email: 'ops@monvie.kr', name: '운영팀장 김민수', role: AdminRole.MANAGER },
  { id: 'admin-003', email: 'staff@monvie.kr', name: '운영팀원 이지현', role: AdminRole.OPERATOR },
  { id: 'admin-004', email: 'marketing@monvie.kr', name: '마케팅 박소영', role: AdminRole.MARKETING },
];

// Simple session check (placeholder for NextAuth)
export function getSession(): { user: typeof MOCK_ADMIN_USERS[0] } | null {
  if (typeof window === 'undefined') return null;
  const stored = sessionStorage.getItem('monvie-admin-session');
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function setSession(user: typeof MOCK_ADMIN_USERS[0]): void {
  sessionStorage.setItem('monvie-admin-session', JSON.stringify({ user }));
}

export function clearSession(): void {
  sessionStorage.removeItem('monvie-admin-session');
}
