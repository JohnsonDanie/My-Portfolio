import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AuthGuard from './components/admin/AuthGuard';

import HomePage from './pages/HomePage';
import LoginPage from './pages/admin/LoginPage';
import AdminLayout from './components/admin/AdminLayout';
import ProfileEditor from './pages/admin/ProfileEditor';
import ProjectsManager from './pages/admin/ProjectsManager';
import SkillsManager from './pages/admin/SkillsManager';
import ExperienceManager from './pages/admin/ExperienceManager';
import BlogManager from './pages/admin/BlogManager';
import MessagesViewer from './pages/admin/MessagesViewer';
import Dashboard from './pages/admin/Dashboard';

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
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<ProfileEditor />} />
            <Route path="projects" element={<ProjectsManager />} />
            <Route path="skills" element={<SkillsManager />} />
            <Route path="experience" element={<ExperienceManager />} />
            <Route path="blog" element={<BlogManager />} />
            <Route path="messages" element={<MessagesViewer />} />
            <Route path="settings" element={<div className="text-white text-2xl font-bold p-8">Settings coming soon...</div>} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
