import React from 'react';
import { PERMISSIONS } from '../types/auth';
import { usePermissions } from '../hooks/usePermissions';

interface PermissionGateProps {
  children: React.ReactNode;
  permissions: Array<keyof typeof PERMISSIONS>;
  requireAll?: boolean;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  children,
  permissions,
  requireAll = false
}) => {
  const { hasAnyPermission, hasAllPermissions } = usePermissions();

  const hasAccess = requireAll
    ? hasAllPermissions(permissions)
    : hasAnyPermission(permissions);

  if (!hasAccess) return null;

  return <>{children}</>;
};