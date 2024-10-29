import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Search } from './pages/Search';
import { CompanyProfile } from './pages/CompanyProfile';
import { LoginForm } from './components/auth/LoginForm';
import { AdminDashboard } from './pages/admin/AdminDashboard';

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