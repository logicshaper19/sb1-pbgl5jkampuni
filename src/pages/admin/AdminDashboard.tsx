import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminOverview } from './AdminOverview';
import { CompanyList } from './CompanyList';
import { CompanyForm } from './CompanyForm';
import { UserManagement } from './UserManagement';
import { RoleManagement } from './RoleManagement';

export const AdminDashboard = () => {
  return (
    <Routes>
      <Route index element={<AdminOverview />} />
      <Route path="companies" element={<CompanyList />} />
      <Route path="companies/new" element={<CompanyForm />} />
      <Route path="companies/:id/edit" element={<CompanyForm />} />
      <Route path="users" element={<UserManagement />} />
      <Route path="roles" element={<RoleManagement />} />
    </Routes>
  );
};