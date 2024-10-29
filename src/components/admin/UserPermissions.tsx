import React, { useState, useEffect } from 'react';
import { User, Permission } from '../../types/auth';
import { Save, X } from 'lucide-react';

interface UserPermissionsProps {
  userId: string;
  onClose: () => void;
}

export const UserPermissions = ({ userId, onClose }: UserPermissionsProps) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    try {
      const [userResponse, permissionsResponse] = await Promise.all([
        fetch(`/api/users/${userId}`),
        fetch('/api/permissions')
      ]);

      const userData = await userResponse.json();
      const permissionsData = await permissionsResponse.json();

      setUser(userData);
      setAllPermissions(permissionsData);
      setSelectedPermissions(new Set(userData.permissions.map((p: Permission) => p.id)));
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const currentPermissions = new Set(user.permissions.map(p => p.id));
      const permissionsToAdd = [...selectedPermissions].filter(id => !currentPermissions.has(id));
      const permissionsToRemove = [...currentPermissions].filter(id => !selectedPermissions.has(id));

      if (permissionsToAdd.length > 0) {
        await fetch('/api/permissions/assign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            permissionIds: permissionsToAdd
          })
        });
      }

      if (permissionsToRemove.length > 0) {
        await fetch('/api/permissions/revoke', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            permissionIds: permissionsToRemove
          })
        });
      }

      onClose();
    } catch (error) {
      console.error('Failed to save permissions:', error);
    } finally {
      setSaving(false);
    }
  };

  const togglePermission = (permissionId: string) => {
    const newSelected = new Set(selectedPermissions);
    if (newSelected.has(permissionId)) {
      newSelected.delete(permissionId);
    } else {
      newSelected.add(permissionId);
    }
    setSelectedPermissions(newSelected);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            Manage Permissions: {user.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {allPermissions.map((permission) => (
            <label
              key={permission.id}
              className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={selectedPermissions.has(permission.id)}
                onChange={() => togglePermission(permission.id)}
                className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <div className="font-medium">{permission.name}</div>
                <div className="text-sm text-gray-500">{permission.description}</div>
              </div>
            </label>
          ))}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};