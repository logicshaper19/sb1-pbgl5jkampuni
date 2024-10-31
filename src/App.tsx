import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';

// Import from app directory
import Search from './app/search/page';
import CompanyProfile from './app/companies/[id]/page';
import AdminDashboard from './app/admin/page';
import LoginForm from './app/login/page';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route element={<Layout />}>
            <Route index element={<Search />} />
            <Route path="/company/:id" element={<CompanyProfile />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;