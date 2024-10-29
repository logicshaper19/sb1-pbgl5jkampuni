import React, { useState, useEffect } from 'react';
import { Permission } from '../../types/auth';
import { Plus, Edit, Trash2 } from 'lucide-react';

export const RoleManagement = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const response = await fetch('/api/permissions');
      const data = await response.json();
      setPermissions(data);
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this permission?')) return;

    try {
      await fetch(`/api/permissions/${id}`, { method: 'DELETE' });
      setPermissions(permissions.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete permission:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Role Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Permission
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {permissions.map((permission) => (
                <tr key={permission.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {permission.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {permission.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedPermission(permission)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(permission.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {(showAddModal || selectedPermission) && (
        <PermissionModal
          permission={selectedPermission}
          onClose={() => {
            setShowAddModal(false);
            setSelectedPermission(null);
          }}
          onSave={async (data) => {
            try {
              const url = selectedPermission 
                ? `/api/permissions/${selectedPermission.id}`
                : '/api/permissions';
              const method = selectedPermission ? 'PATCH' : 'POST';
              
              const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
              });
              
              if (!response.ok) throw new Error('Failed to save permission');
              
              fetchPermissions();
              setShowAddModal(false);
              setSelectedPermission(null);
            } catch (error) {
              console.error('Save error:', error);
            }
          }}
        />
      )}
    </div>
  );
};

interface PermissionModalProps {
  permission: Permission | null;
  onClose: () => void;
  onSave: (data: Partial<Permission>) => Promise<void>;
}

const PermissionModal = ({ permission, onClose, onSave }: PermissionModalProps) => {
  const [data, setData] = useState({
    name: permission?.name || '',
    description: permission?.description || '',
  });

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">
          {permission ? 'Edit Permission' : 'Add Permission'}
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(data)}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};