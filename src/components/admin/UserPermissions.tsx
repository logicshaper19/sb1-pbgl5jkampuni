'use client';

import { useState, useEffect, useCallback } from 'react';
import type { User } from '@/types/auth';

interface UserPermissionsProps {
  userId: string;
  onUpdate?: (permissions: string[]) => void;
}

interface ExtendedUser extends User {
  permissions: string[];
}

export function UserPermissions({ userId, onUpdate }: UserPermissionsProps) {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`/api/users/${userId}/permissions`);
      if (!response.ok) throw new Error('Failed to fetch permissions');
      const data = await response.json();
      setUser(data);
      setSelectedPermissions(data.permissions || []);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePermissionToggle = async (permission: string) => {
    const newPermissions = selectedPermissions.includes(permission)
      ? selectedPermissions.filter(p => p !== permission)
      : [...selectedPermissions, permission];

    setSelectedPermissions(newPermissions);
    onUpdate?.(newPermissions);

    try {
      await fetch(`/api/users/${userId}/permissions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissions: newPermissions })
      });
    } catch (error) {
      console.error('Error updating permissions:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  const availablePermissions = [
    'VIEW_USERS',
    'EDIT_USERS',
    'DELETE_USERS',
    'MANAGE_PERMISSIONS'
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">User Permissions</h3>
      <div className="space-y-2">
        {availablePermissions.map(permission => (
          <label key={permission} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedPermissions.includes(permission)}
              onChange={() => handlePermissionToggle(permission)}
              className="rounded border-gray-300"
            />
            <span>{permission}</span>
          </label>
        ))}
      </div>
    </div>
  );
}