import { useAuth } from '../context/AuthContext';
import { PERMISSIONS } from '../types/auth';

export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (permission: keyof typeof PERMISSIONS) => {
    if (!user) return false;
    
    // Admin has all permissions
    if (user.role === 'ADMIN') return true;
    
    return user.permissions.some(p => p.name === PERMISSIONS[permission]);
  };

  const hasAnyPermission = (permissions: Array<keyof typeof PERMISSIONS>) => {
    return permissions.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissions: Array<keyof typeof PERMISSIONS>) => {
    return permissions.every(permission => hasPermission(permission));
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  };
};