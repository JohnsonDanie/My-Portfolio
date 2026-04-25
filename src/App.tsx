import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AuthGuard from './components/admin/AuthGuard';

import HomePage from './pages/HomePage';
import LoginPage from './pages/admin/LoginPage';
import AdminLayout from './components/admin/AdminLayout';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<HomePage />} />
          
          {/* Admin Login */}
          <Route path="/admin/login" element={<LoginPage />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<AuthGuard><AdminLayout /></AuthGuard>}>
            <Route index element={<div className="text-white text-2xl font-bold">Dashboard Placeholder</div>} />
            <Route path="profile" element={<div className="text-white text-2xl font-bold">Profile Editor Placeholder</div>} />
            <Route path="projects" element={<div className="text-white text-2xl font-bold">Projects Manager Placeholder</div>} />
            <Route path="skills" element={<div className="text-white text-2xl font-bold">Skills Manager Placeholder</div>} />
            <Route path="experience" element={<div className="text-white text-2xl font-bold">Experience Manager Placeholder</div>} />
            <Route path="blog" element={<div className="text-white text-2xl font-bold">Blog Manager Placeholder</div>} />
            <Route path="messages" element={<div className="text-white text-2xl font-bold">Messages Placeholder</div>} />
            <Route path="settings" element={<div className="text-white text-2xl font-bold">Settings Placeholder</div>} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
