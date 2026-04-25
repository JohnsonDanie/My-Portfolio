import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  User, 
  Briefcase, 
  Code, 
  PenTool, 
  MessageSquare, 
  Settings, 
  LogOut,
  Menu,
  X,
  Code2
} from 'lucide-react';
import { useState } from 'react';

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} />, exact: true },
  { href: '/admin/profile', label: 'Profile', icon: <User size={18} /> },
  { href: '/admin/projects', label: 'Projects', icon: <Briefcase size={18} /> },
  { href: '/admin/skills', label: 'Skills', icon: <Code size={18} /> },
  { href: '/admin/experience', label: 'Experience', icon: <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2 9v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9'/%3E%3Cpath d='M4 9V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4'/%3E%3Cpath d='M12 12h.01'/%3E%3C/svg%3E" width="18" className="opacity-70 group-hover:opacity-100" /> },
  { href: '/admin/blog', label: 'Blog', icon: <PenTool size={18} /> },
  { href: '/admin/messages', label: 'Messages', icon: <MessageSquare size={18} /> },
  { href: '/admin/settings', label: 'Settings', icon: <Settings size={18} /> },
];

export default function AdminLayout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#030810] flex text-slate-300">
      
      {/* Mobile Header (visible only on md and below) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#0a1628] border-b border-indigo-500/10 z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-500 text-white">
             <Settings size={16} />
           </div>
           <span className="font-bold text-white">CMS</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-400">
           {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-64 bg-[#0a1628] border-r border-indigo-500/10 z-30
        flex flex-col transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Title area */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-indigo-500/10 shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20">
             <Code2 size={16} />
          </div>
          <span className="font-bold text-lg text-white">Portfolio Admin</span>
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {adminLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.exact}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors group
                ${isActive 
                  ? 'bg-indigo-500/10 text-indigo-400' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}
              `}
            >
              <div className="shrink-0">{link.icon}</div>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout area */}
        <div className="p-4 border-t border-indigo-500/10 shrink-0">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg font-medium text-slate-400 hover:text-white hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
          >
            <LogOut size={18} className="shrink-0" />
            Sign Out
          </button>
          
          <div className="mt-4 text-center">
             <button onClick={() => navigate('/')} className="text-xs text-slate-500 hover:text-indigo-400 transition-colors">
               Return to Public Site
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col md:pt-0 pt-16">
         {/* Top bar on desktop */}
         <header className="hidden md:flex h-16 bg-[#050c1a] border-b border-indigo-500/5 items-center justify-end px-8 shrink-0">
            <span className="text-sm font-medium text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/50">
               Authenticated Session
            </span>
         </header>
         
         <div className="flex-1 p-6 md:p-8 overflow-y-auto">
           <Outlet />
         </div>
      </main>
      
      {/* Mobile scrim overlay */}
      {mobileMenuOpen && (
         <div 
           className="fixed inset-0 bg-black/60 z-20 md:hidden backdrop-blur-sm"
           onClick={() => setMobileMenuOpen(false)}
         />
      )}
    </div>
  );
}
